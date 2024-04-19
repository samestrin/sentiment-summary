/* Latent Semantic Analysis (LSA) for Text Summarization:
LSA is a technique that analyzes the relationships between a set of documents and the terms they contain.
It constructs a semantic space where documents and terms are represented as vectors.
In the context of text summarization, LSA can identify the most important sentences or passages that capture the core meaning and topics of the original text.
It achieves this by finding the sentences with the highest semantic similarity to the overall document vector.
*/

const natural = require("natural");
const SentenceTokenizer = natural.SentenceTokenizer;
const numeric = require("numeric");
const { manageErrors } = require("./errors.js");
const {
  getSentimentRankAdjustment,
  calculateAdjustedRank,
  getTfIdfMatrix,
} = require("./shared.js");
const { getSentiment } = require("./sentimentAnalysis.js");

/**
 * Generates a sentiment-aware summary using Latent Semantic Analysis (LSA).
 * Emphasizes sentences with strong positive or negative sentiments.
 *
 * @param {string} text - The input text for summarization.
 * @param {number} [numberOfSentences=5] -  Desired number of sentences in the summary.
 * @param {number} [positiveSentimentThreshold=0.1] - Minimum sentiment score to consider a sentence positive.
 * @param {number} [negativeSentimentThreshold=-0.1] - Maximum sentiment score to consider a sentence negative.
 * @param {number} [positiveRankBoost=2] - Boost applied to the ranking of positive sentences.
 * @param {number} [negativeRankBoost=2] - Boost applied to the ranking of negative sentences.
 * @returns {string} The generated summary.
 * @throws {Error} If any input parameters are invalid.
 *
 * @example
 *
 * const article = "The new movie was terrible! The plot was confusing, and the acting was subpar. However, I really enjoyed the special effects.";
 * const summary = await sentimentLSASummary(article, 3);
 * console.log(summary);
 */

async function sentimentLSASummary(
  text,
  numberOfSentences = 5,
  positiveSentimentThreshold = 0.1,
  negativeSentimentThreshold = -0.1,
  positiveRankBoost = 2,
  negativeRankBoost = 2
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
  const sentences = sentenceTokenizer.tokenize(text);

  // Calculate the TF-IDF matrix
  const { matrix, terms } = getTfIdfMatrix(sentences);

  // Perform SVD
  const { U, S, V } = numeric.svd(matrix);

  // Use the singular values to rank sentences
  const sentenceScores = S.map((s, i) => s * s);

  // Compute sentiments and adjust ranks asynchronously
  const sentenceDetails = await Promise.all(
    sentences.map(async (sentence, index) => {
      const sentimentScore = await getSentiment(sentence);

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
      };
    })
  );

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
