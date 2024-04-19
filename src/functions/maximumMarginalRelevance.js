/* Maximum Marginal Relevance (MMR) for Text Summarization:
MMR is a technique that aims to produce summaries that are both relevant to the original text and diverse in content.
It iteratively selects sentences that have high relevance to the document but minimal redundancy with sentences already included in the summary.
MMR strikes a balance between relevance and diversity, resulting in summaries that cover the main topics while minimizing repetition.
*/

const natural = require("natural");
const TfIdf = natural.TfIdf;
const SentenceTokenizer = natural.SentenceTokenizer;
const { manageErrors } = require("./errors.js");
const {
  getSentimentRankAdjustment,
  calculateAdjustedRank,
  getTfIdfVectors,
  cosineSimilarity,
} = require("./shared.js");
const { getSentiment } = require("./sentiment.js");

/**
 * Generates a sentiment-aware summary using the Maximum Marginal Relevance (MMR) algorithm.
 * Emphasizes sentences with strong sentiment while ensuring diversity in the summary.
 *
 * @param {string} text - The input text for summarization.
 * @param {number} [numberOfSentences=5] -  Desired number of sentences in the summary.
 * @param {number} [lambda=0.7] -  Balances relevance and diversity in summary (higher lambda prioritizes relevance).
 * @param {number} [positiveSentimentThreshold=0] - Minimum sentiment score to consider a sentence positive.
 * @param {number} [negativeSentimentThreshold=0] - Maximum sentiment score to consider a sentence negative.
 * @param {number} [positiveRankBoost=0] - Boost applied to the ranking of positive sentences.
 * @param {number} [negativeRankBoost=0] - Boost applied to the ranking of negative sentences.
 * @returns {string} The generated summary.
 * @throws {Error} If any input parameters are invalid (delegated to 'manageErrors').
 *
 * @example
 *
 * const article = "The product has innovative features and works well. However, it is quite expensive, and the customer support could be better.";
 * const summary = await sentimentMMRSummary(article, 3);
 * console.log(summary);
 */

async function sentimentMMRSummary(
  text,
  numberOfSentences = 5,
  lambda = 0.7,
  positiveSentimentThreshold = 0,
  negativeSentimentThreshold = 0,
  positiveRankBoost = 0,
  negativeRankBoost = 0
) {
  manageErrors(
    text,
    numberOfSentences,
    positiveSentimentThreshold,
    negativeSentimentThreshold,
    positiveRankBoost,
    negativeRankBoost,
    lambda
  );

  const sentenceTokenizer = new SentenceTokenizer();
  const sentences = sentenceTokenizer.tokenize(text);
  const tfidf = new TfIdf();
  sentences.forEach((sentence) => tfidf.addDocument(sentence));
  const vectors = getTfIdfVectors(tfidf);

  // Compute initial relevance scores based on TF-IDF cosine similarity with the whole document
  let docVector = vectors.reduce((acc, vec) => {
    Object.keys(vec).forEach((key) => {
      acc[key] = (acc[key] || 0) + vec[key];
    });
    return acc;
  }, {});

  let relevanceScores = vectors.map((vec) => cosineSimilarity(vec, docVector));

  // Compute sentiment scores and adjust initial relevance
  const sentimentAdjustments = await Promise.all(
    sentences.map((sentence, index) =>
      getSentiment(sentence).then((sentimentScore) => {
        return getSentimentRankAdjustment(
          sentimentScore,
          positiveSentimentThreshold,
          negativeSentimentThreshold,
          positiveRankBoost,
          negativeRankBoost
        );
      })
    )
  );

  relevanceScores = relevanceScores.map((score, index) =>
    calculateAdjustedRank(score, sentimentAdjustments[index])
  );

  let summary = [];
  let selectedIndices = new Set();

  // Select the top N sentences based on MMR
  for (let i = 0; i < numberOfSentences; i++) {
    let mmrScores = relevanceScores.map((score, index) => {
      if (selectedIndices.has(index)) return -Infinity;
      let diversity = Array.from(selectedIndices).reduce((acc, si) => {
        return acc + cosineSimilarity(vectors[index], vectors[si]);
      }, 0);

      return lambda * score - (1 - lambda) * diversity;
    });

    let maxIndex = mmrScores.indexOf(Math.max(...mmrScores));
    selectedIndices.add(maxIndex);
    summary.push(sentences[maxIndex]);
  }

  return summary.join(" ");
}

module.exports = { sentimentMMRSummary };
