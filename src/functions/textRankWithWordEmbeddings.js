/* TextRank with Word Embeddings for Text Summarization:

This approach combines the TextRank algorithm with word embeddings, which are dense vector representations of words that capture semantic and syntactic information.
Instead of using co-occurrence relationships between words, this method computes sentence similarity using word embeddings.
Sentences are represented as vectors by averaging or combining the word embeddings of their constituent words.
The TextRank algorithm then operates on these sentence vectors to identify the most important sentences for the summary.
*/
const natural = require("natural");
const SentenceTokenizer = natural.SentenceTokenizer;
const { manageErrors } = require("./errors.js");
const {
  getSentimentRankAdjustment,
  calculateAdjustedRank,
  cosineSimilarity,
  getWordEmbeddings,
} = require("./shared.js");
const { getSentiment } = require("./sentimentAnalysis.js");

/**
 * Generates a sentiment-aware summary using TextRank with word embeddings. Emphasizes sentences with semantically important words and strong sentiment.
 *
 * @param {string} text - The input text for summarization.
 * @param {number} [numberOfSentences=5] -  Desired number of sentences in the summary.
 * @param {number} [positiveSentimentThreshold=0] - Minimum sentiment score to consider a sentence positive.
 * @param {number} [negativeSentimentThreshold=0] - Maximum sentiment score to consider a sentence negative.
 * @param {number} [positiveRankBoost=0] - Boost applied to the ranking of positive sentences.
 * @param {number} [negativeRankBoost=0] - Boost applied to the ranking of negative sentences.
 * @returns {string} The generated summary.
 * @throws {Error} If any input parameters are invalid (delegated to 'manageErrors').
 *
 * @example
 *
 * const article = "The new technology is amazing but expensive. I love the design of the product!";
 * const summary = await sentimentTextRankWithWordEmbeddingsSummary(article, 2);
 * console.log(summary);
 */

async function sentimentTextRankWithWordEmbeddingsSummary(
  text,
  numberOfSentences = 5,
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
    negativeRankBoost
  );

  const sentenceTokenizer = new SentenceTokenizer();
  let sentences = sentenceTokenizer.tokenize(text);

  // Get embeddings for each sentence
  let vectors = sentences.map((sentence) => getWordEmbeddings(sentence));

  // Build similarity matrix based on cosine similarity of embeddings
  let similarityMatrix = vectors.map((vec, i) =>
    vectors.map((vec2, j) => (i === j ? 0 : cosineSimilarity(vec, vec2)))
  );

  // Calculate scores using TextRank formula iteratively
  let sentenceScores = Array(sentences.length).fill(1);
  for (let iter = 0; iter < 20; iter++) {
    let newScores = sentenceScores.slice();
    for (let i = 0; i < sentences.length; i++) {
      let sum = similarityMatrix[i].reduce(
        (acc, sim, j) => acc + sim * sentenceScores[j],
        0
      );
      newScores[i] = 0.15 + 0.85 * sum; // damping factor of 0.85
    }
    sentenceScores = newScores;
  }

  // Compute sentiments and adjust ranks
  let sentenceDetails = sentences.map((sentence, index) => {
    const sentimentScore = getSentiment(sentence);

    const sentimentRankAdjustment = getSentimentRankAdjustment(
      sentimentScore,
      positiveSentimentThreshold,
      negativeSentimentThreshold,
      positiveRankBoost,
      negativeRankBoost
    );
    return {
      sentence,
      rank: calculateAdjustedRank(
        sentenceScores[index],
        sentimentRankAdjustment
      ),
      sentiment: sentimentScore,
    };
  });

  // Sort sentences by the modified rank
  sentenceDetails.sort((a, b) => b.rank - a.rank);

  // Select the top N sentences and return them as a single string
  return sentenceDetails
    .slice(0, numberOfSentences)
    .map((detail) => detail.sentence)
    .join(" ");
}

module.exports = { sentimentTextRankWithWordEmbeddingsSummary };
