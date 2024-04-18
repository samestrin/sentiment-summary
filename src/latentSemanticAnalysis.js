const natural = require("natural");
const SentenceTokenizer = natural.SentenceTokenizer;
const vader = require("vader-sentiment");
const svd = require("svd-js");
const { manageErrors } = require("./errors.js");
const {
  getSentimentRankAdjustment,
  calculateAdjustedRank,
  getTfIdfMatrix,
} = require("./shared.js");

/**
 * Generates a summary from a given text by ranking sentences based on their LSA score adjusted by their sentiment.
 * LSA uses singular value decomposition on a term-document matrix to identify patterns in the relationships between the terms and concepts in the text.
 * Sentiments of sentences are evaluated to boost their importance based on emotional content.
 *
 * @param {string} text - The input text from which the summary is generated.
 * @param {number} numberOfSentences - The number of top-ranked sentences to include in the summary (default is 5).
 * @param {number} positiveSentimentThreshold - The threshold above which a positive sentiment score triggers a rank boost (default is 0.1).
 * @param {number} negativeSentimentThreshold - The threshold below which a negative sentiment score triggers a rank boost (default is -0.1).
 * @param {number} positiveRankBoost - The multiplier applied to the base LSA score for sentences with positive sentiments above the threshold (default is 2).
 * @param {number} negativeRankBoost - The multiplier applied to the base LSA score for sentences with negative sentiments below the threshold (default is 2).
 *
 * @returns {string} A string that concatenates the top-ranked sentences to form the summary.
 */
function sentimentLSASummary(
  text,
  numberOfSentences = 5,
  positiveSentimentThreshold = 0.1,
  negativeSentimentThreshold = -0.1,
  positiveRankBoost = 2,
  negativeRankBoost = 2
) {
  // throw errors if invalid input values are passed
  manageErrors(
    text,
    numberOfSentences,
    positiveSentimentThreshold,
    negativeSentimentThreshold,
    positiveRankBoost,
    negativeRankBoost
  );

  const sentenceTokenizer = new SentenceTokenizer();
  const sentences = sentenceTokenizer.tokenize(text);

  // Calculate the TF-IDF matrix
  const { matrix, terms } = getTfIdfMatrix(sentences);

  // Perform SVD
  const { u, s, v } = svd.svd(matrix);

  // We use the diagonal S matrix to rank sentences based on their singular values
  const sentenceScores = v[0].map((_, i) => s[i] * s[i]);

  // Compute sentiments and adjust ranks
  let sentenceDetails = sentences.map((sentence, index) => {
    const sentimentScore =
      vader.SentimentIntensityAnalyzer.polarity_scores(sentence).compound;

    let sentimentRankAdjustment = getSentimentRankAdjustment(
      sentimentScore,
      positiveSentimentThreshold,
      negativeSentimentThreshold,
      positiveRankBoost,
      negativeRankBoost
    );

    return {
      sentence,
      sentiment: sentimentScore,
      rank: calculateAdjustedRank(
        sentenceScores[index],
        sentimentRankAdjustment
      ),
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

// Export the function if it needs to be used in other modules
module.exports = { sentimentLSASummary };
