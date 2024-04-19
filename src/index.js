const { sentimentTextRankSummary } = require("./textRank.js");
const { sentimentLexRankSummary } = require("./lexRank.js");
const { sentimentSeq2SeqSummary } = require("./sequenceToSequenceModels.js");
const { sentimentExtractiveSummary } = require("./extractiveText.js");
const { sentimentLSASummary } = require("./latentSemanticAnalysis.js");

module.exports = {
  sentimentTextRankSummary,
  sentimentLexRankSummary,
  sentimentSeq2SeqSummary,
  sentimentExtractiveSummary,
  sentimentLSASummary,
};
