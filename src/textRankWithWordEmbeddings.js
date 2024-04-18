const natural = require("natural");
const SentenceTokenizer = natural.SentenceTokenizer;
const vader = require("vader-sentiment");
const { manageErrors } = require("./errors.js");

const {
  getSentimentRankAdjustment,
  calculateAdjustedRanked,
  cosineSimilarity,
  getWordEmbeddings,
} = require("./shared.js");

/**
 * Generates a summary from a given text by ranking sentences based on their TextRank score using word embeddings adjusted by their sentiment.
 * This function integrates the use of TextRank enhanced by word embeddings for better semantic understanding and sentiment analysis to adjust these ranks based on emotional content.
 *
 * @param {string} text - The input text from which the summary is generated.
 * @param {number} numberOfSentences - The number of top-ranked sentences to include in the summary (default is 5).
 * @param {number} positiveSentimentThreshold - The threshold above which a positive sentiment score triggers a rank boost.
 * @param {number} negativeSentimentThreshold - The threshold below which a negative sentiment score triggers a rank boost.
 * @param {number} positiveRankBoost - The multiplier applied to the base TextRank score for sentences with positive sentiments above the threshold.
 * @param {number} negativeRankBoost - The multiplier applied to the base TextRank score for sentences with negative sentiments below the threshold.
 *
 * @returns {string} A string that concatenates the top-ranked sentences to form the summary.
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
    const sentimentScore =
      vader.SentimentIntensityAnalyzer.polarity_scores(sentence).compound;
    const sentimentRankAdjustment = getSentimentRankAdjustment(
      sentimentScore,
      positiveSentimentThreshold,
      negativeSentimentThreshold,
      positiveRankBoost,
      negativeRankBoost
    );
    return {
      sentence,
      rank: calculateAdjustedRanked(
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
