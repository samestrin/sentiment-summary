const { sentimentTextRankSummary } = require("./textRank.js");
const { sentimentLexRankSummary } = require("./lexRank.js");
const { sentimentSeq2SeqSummary } = require("./sequenceToSequence.js");

module.exports = {
  sentimentTextRankSummary,
  sentimentLexRankSummary,
  sentimentSeq2SeqSummary,
};
