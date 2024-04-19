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

async function sentimentSummary(text, options = {}) {}

module.exports = {
  sentimentExtractiveSummary,
  sentimentLSASummary,
  sentimentLexRankSummary,
  sentimentMMRSummary,
  sentimentTextRankSummary,
  sentimentTextRankWithWordEmbeddingsSummary,
};
