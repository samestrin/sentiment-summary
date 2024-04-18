const natural = require("natural");
const vader = require("vader-sentiment");
const stopwords = require("natural").stopwords;
const { manageErrors } = require("./errors.js");
const {
  getSentimentRankAdjustment,
  calculateAdjustedRank,
} = require("./shared.js");

// Function to calculate keyword frequency scores
function calculateKeywordFrequencyScore(sentence, keywords) {
  const words = sentence.split(" ");
  const filteredWords = words.filter(
    (word) => !stopwords.includes(word.toLowerCase())
  );
  let score = 0;
  keywords.forEach((keyword) => {
    if (filteredWords.includes(keyword.toLowerCase())) {
      score++;
    }
  });
  return score;
}

// Sentiment-Aware Extractive Summarization
function sentimentExtractiveSummary(
  text,
  numberOfSentences = 5,
  positiveSentimentThreshold = 0,
  negativeSentimentThreshold = 0,
  positiveRankBoost = 0,
  negativeRankBoost = 0,
  keywords
) {
  // Error handling
  manageErrors(
    text,
    numberOfSentences,
    positiveSentimentThreshold,
    negativeSentimentThreshold,
    positiveRankBoost,
    negativeRankBoost
  );

  const sentenceTokenizer = new natural.SentenceTokenizer();
  const sentences = sentenceTokenizer.tokenize(text);

  // Calculate keyword frequency scores and track original positions
  let sentenceDetails = sentences.map((sentence, index) => {
    const keywordFrequencyScore = calculateKeywordFrequencyScore(
      sentence,
      keywords
    );
    const sentimentScore =
      vader.SentimentIntensityAnalyzer.polarity_scores(sentence).compound;
    const sentimentRankAdjustment = getSentimentRankAdjustment(
      sentimentScore,
      positiveSentimentThreshold,
      negativeSentimentThreshold,
      positiveRankBoost,
      negativeRankBoost
    );

    return {
      sentence,
      index,
      sentiment: sentimentScore,
      rank: calculateAdjustedRank(
        keywordFrequencyScore,
        sentimentRankAdjustment
      ),
    };
  });

  // Sort by adjusted rank
  sentenceDetails.sort((a, b) => b.rank - a.rank);

  // Build summary while maintaining original order
  const summarySentences = [];
  for (let i = 0; i < numberOfSentences; i++) {
    const topSentenceDetails = sentenceDetails[i];
    summarySentences[topSentenceDetails.index] = topSentenceDetails.sentence;
  }
  const summary = summarySentences.join(" ");

  console.log(summary);
  return summary;
}

module.exports = { sentimentExtractiveSummary };
