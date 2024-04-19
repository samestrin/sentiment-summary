const { getConfig } = require("./functions/moduleConfig");

const { sentimentExtractiveSummary } = require("./functions/extractiveText.js");
const {
  sentimentExtractiveWeightedSummary,
} = require("./functions/extractiveTextWeighted.js");
const {
  sentimentLSASummary,
} = require("./functions/latentSemanticAnalysis.js");
const { sentimentLexRankSummary } = require("./functions/lexRank.js");
const {
  sentimentMMRSummary,
} = require("./functions/maximumMarginalRelevance.js");
const { sentimentTextRankSummary } = require("./functions/textRank.js");
const {
  sentimentTextRankWithWordEmbeddingsSummary,
} = require("./functions/textRankWithWordEmbeddings.js");

/**
 * Generates a summary based on a provided text, applying sentiment analysis. Prioritizes configuration settings and supports multiple summarization and sentiment engines.
 *
 * @param {string} text - The input text for summarization and analysis.
 * @param {object} [options={}] - Configuration options with the following properties:
 *   * summarizationEngine (string): The summarization engine to use (e.g., 'extractiveText').
 *   * sentimentEngine (string): The sentiment engine to use (e.g., 'vader', 'hugging-face').
 *   * sentimentEngineModel (string): Model name, if using the 'hugging-face' sentiment engine.
 *   * numberOfSentences (number): Desired number of sentences in the summary.
 *   * positiveSentimentThreshold (number): Minimum score to consider a sentence positive.
 *   * negativeSentimentThreshold (number): Maximum score to consider a sentence negative.
 *   * positiveRankBoost (number): Adjustment applied to the ranking of positive sentences.
 *   * negativeRankBoost (number): Adjustment applied to the ranking of negative sentences.
 *   * lambda (number): Parameter for certain summarization algorithms (like MMR).
 *
 * @returns {string} The generated sentiment-aware summary.
 * @throws {Error} Potentially if configuration issues arise.
 */

async function sentimentSummary(text, options = {}) {
  // get the global config

  let config = getConfig(); // Assume getConfig() always returns an object

  if (typeof variable !== "object" || variable === null) {
    options = {};
  }

  let summarizationEngine =
    config.summarizationEngine ||
    options.summarizationEngine ||
    "extractiveText";

  let sentimentEngine =
    config.sentimentEngine || options.sentimentEngine || "vader";

  let sentimentEngineModel = false;

  if (sentimentEngine === "hugging-face") {
    sentimentEngineModel =
      config.sentimentEngineModel ||
      options.sentimentEngineModel ||
      "sentiment-roberta-large-english";
  }

  let numberOfSentences =
    config.numberOfSentences || options.numberOfSentences || 5;

  let positiveSentimentThreshold =
    config.positiveSentimentThreshold ||
    options.positiveSentimentThreshold ||
    0;

  let negativeSentimentThreshold =
    config.negativeSentimentThreshold ||
    options.negativeSentimentThreshold ||
    0;

  let positiveRankBoost =
    config.positiveRankBoost || options.positiveRankBoost || 0;

  let negativeRankBoost =
    config.negativeRankBoost || options.negativeRankBoost || 0;

  let lambda = config.lambda || options.lambda || 0;

  // run summarization using the specified summarization and sentiment analysis engines respectively
  // return the results
}
module.exports = { sentimentSummary };
