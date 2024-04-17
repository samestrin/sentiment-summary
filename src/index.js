const natural = require("natural");
var textrank = require("textrank-node");

function sentimentSummary(
  text,
  numberOfSentences = 5,
  sentimentThreshold = 1,
  rankBoost = 2
) {
  // Initialize TextRank and sentiment analyzer
  const textRankTxt = new TextRank(text);
  const tokenizer = new natural.WordTokenizer();
  const analyzer = new natural.SentimentAnalyzer(
    "English",
    natural.PorterStemmer,
    "afinn"
  );

  // Extract sentences using TextRank and compute their sentiments
  let sentenceDetails = textRankTxt.summarize().map((item) => ({
    sentence: item.sentence,
    baseRank: item.rank,
    sentiment: analyzer.getSentiment(tokenizer.tokenize(item.sentence)),
  }));

  // Modify TextRank scores based on sentiment scores
  sentenceDetails = sentenceDetails.map((details) => {
    let sentimentRankAdjustment = 0;
    // Check if sentiment is positive and above the threshold for boosting
    if (details.sentiment >= sentimentThreshold) {
      sentimentRankAdjustment = rankBoost;
    }
    // Check if sentiment is negative and below the threshold for boosting
    else if (details.sentiment <= -sentimentThreshold) {
      sentimentRankAdjustment = rankBoost;
    }
    return {
      ...details,
      rank: details.baseRank * (1 + sentimentRankAdjustment),
    };
  });

  // Sort sentences by the modified rank that includes sentiment adjustment
  sentenceDetails.sort((a, b) => b.rank - a.rank);

  // Select the top N sentences and return them as a single string
  return sentenceDetails
    .slice(0, numberOfSentences)
    .map((details) => details.sentence)
    .join(" ");
}

module.exports = { sentimentSummary };
