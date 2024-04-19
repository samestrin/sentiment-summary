const { sentimentTextRankSummary } = require("./functions/textRank.js");
const { sentimentLexRankSummary } = require("./functions/lexRank.js");
const {
  sentimentSeq2SeqSummary,
} = require("./functions/sequenceToSequenceModels.js");
const { sentimentExtractiveSummary } = require("./functions/extractiveText.js");
const {
  sentimentLSASummary,
} = require("./functions/latentSemanticAnalysis.js");
const {
  sentimentMMRSummary,
} = require("./functions/maximumMarginalRelevance.js");

module.exports = {
  sentimentTextRankSummary,
  sentimentLexRankSummary,
  sentimentSeq2SeqSummary,
  sentimentExtractiveSummary,
  sentimentLSASummary,
  sentimentMMRSummary,
};
