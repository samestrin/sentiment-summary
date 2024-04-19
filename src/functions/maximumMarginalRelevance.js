const natural = require("natural");
const TfIdf = natural.TfIdf;
const SentenceTokenizer = natural.SentenceTokenizer;
const vader = require("vader-sentiment");
const { manageErrors } = require("./errors.js");
const {
  getSentimentRankAdjustment,
  calculateAdjustedRank,
  getTfIdfVectors,
  cosineSimilarity,
} = require("./shared.js");

/**
 * Generates a summary from a given text by ranking sentences based on their Maximum Marginal Relevance (MMR) score adjusted by their sentiment.
 * MMR aims to reduce redundancy and improve the diversity of the sentences in the summary while considering the sentiment of sentences to emphasize emotional content.
 *
 * @param {string} text - The input text from which the summary is generated.
 * @param {number} numberOfSentences - The number of top-ranked sentences to include in the summary (default is 5).
 * @param {number} lambda - The trade-off parameter between relevance and diversity (range [0,1]).
 * @param {number} positiveSentimentThreshold - The threshold above which a positive sentiment score triggers a rank boost.
 * @param {number} negativeSentimentThreshold - The threshold below which a negative sentiment score triggers a rank boost.
 * @param {number} positiveRankBoost - The multiplier for positive sentiment impact on ranking.
 * @param {number} negativeRankBoost - The multiplier for negative sentiment impact on ranking.
 *
 * @returns {string} A string that concatenates the top-ranked sentences to form the summary.
 */
function sentimentMMRSummary(
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
  let sentences = sentenceTokenizer.tokenize(text);

  let tfidf = new TfIdf();
  sentences.forEach((sentence) => tfidf.addDocument(sentence));
  let vectors = getTfIdfVectors(tfidf);

  // Compute initial relevance scores based on TF-IDF cosine similarity with the whole document
  let docVector = vectors.reduce((acc, vec) => {
    Object.keys(vec).forEach((key) => {
      acc[key] = (acc[key] || 0) + vec[key];
    });
    return acc;
  }, {});

  let relevanceScores = vectors.map((vec) => cosineSimilarity(vec, docVector));

  // Compute sentiment scores and adjust initial relevance
  relevanceScores = relevanceScores.map((score, index) => {
    const sentimentScore = vader.SentimentIntensityAnalyzer.polarity_scores(
      sentences[index]
    ).compound;
    const sentimentAdjustment = getSentimentRankAdjustment(
      sentimentScore,
      positiveSentimentThreshold,
      negativeSentimentThreshold,
      positiveRankBoost,
      negativeRankBoost
    );

    let adjustedRank = calculateAdjustedRank(score, sentimentAdjustment);

    return adjustedRank;
  });
  console.log(relevanceScores);
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
