const natural = require("natural");
const vader = require("vader-sentiment");
const stopwords = require("natural").stopwords;
const { manageErrors } = require("./errors.js");
const {
  getSentimentRankAdjustment,
  calculateAdjustedRank,
} = require("./shared.js");

// Function to extract keywords from the text
function extractKeywords(text, numKeywords = 10) {
  const allWords = text.toLowerCase().split(" ");
  const filteredWords = allWords.filter((word) => !stopwords.includes(word));

  const wordFrequencies = {};
  filteredWords.forEach((word) => {
    wordFrequencies[word] = (wordFrequencies[word] || 0) + 1;
  });

  // Sort keywords by frequency (descending)
  const sortedKeywords = Object.keys(wordFrequencies).sort(
    (a, b) => wordFrequencies[b] - wordFrequencies[a]
  );

  return sortedKeywords.slice(0, numKeywords);
}

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
  negativeRankBoost = 0
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

  // Extract keywords from the entire input text
  const keywords = extractKeywords(text);

  // Calculate keyword frequency scores and track original positions
  let sentenceDetails = sentences
    .map((sentence, index) => {
      if (sentence.trim()) {
        // Ensure the sentence has content
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
          keywordFrequencyScore,
          sentimentRankAdjustment,
          positiveSentimentThreshold,
          negativeSentimentThreshold,
          positiveRankBoost,
          negativeRankBoost,
        };
      } else {
        return null; // Return null for empty or whitespace-only sentences
      }
    })
    .filter((item) => item !== null); // Filter out null entries

  // Sort by adjusted rank to get the top sentences
  sentenceDetails.sort((a, b) => b.rank - a.rank);

  // Select the top N sentences as per numberOfSentences, maintaining their original order
  const topSentences = sentenceDetails.slice(0, numberOfSentences);

  // Sort these top sentences back into their original order
  topSentences.sort((a, b) => a.index - b.index);

  // Map to just the sentences, already trimmed
  const summarySentences = topSentences.map((detail) => detail.sentence.trim());

  // Join all selected sentences into a single summary string
  const summary = summarySentences.join(" ").trim();

  return summary;
}

module.exports = { sentimentExtractiveSummary };
