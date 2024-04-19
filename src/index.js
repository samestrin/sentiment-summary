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

module.exports = {
  sentimentExtractiveSummary,
  sentimentLSASummary,
  sentimentLexRankSummary,
  sentimentMMRSummary,
  sentimentSeq2SeqSummary,
  sentimentTextRankSummary,
  sentimentTextRankWithWordEmbeddingsSummary,
};
