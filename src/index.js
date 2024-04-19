const { sentimentExtractiveSummary } = require("./functions/extractiveText.js");
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

async function sentimentSummary(text, options = {}) {
  // check the global config and assign out variables
  // check the options and assign out variables, overwriting existing
  // run summarization using the specified summarization and sentiment analysis engines respectively
  // return the results
}

module.exports = {
  sentimentExtractiveSummary,
  sentimentLSASummary,
  sentimentLexRankSummary,
  sentimentMMRSummary,
  sentimentTextRankSummary,
  sentimentTextRankWithWordEmbeddingsSummary,
};
