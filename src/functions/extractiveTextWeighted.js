/* Extractive Text Weighted for Text Summarization:
This method ranks sentences based on the frequency of keywords or phrases they contain and the "title"" word score. 
The "title" is the first 1% of the sentences from the submitted body of texts. The max number of sentences for a "title" is 3.
Sentences with more frequent words or phrases are considered more important and included in the summary.
Sentences with words or phrases are considered more important if they appear in the "title".
It is a simple and efficient approach but may not capture semantic relationships or context as well as other techniques.
*/

const natural = require("natural");
const stopwords = require("natural").stopwords;
const { manageErrors } = require("./errors.js");
const {
  getSentimentRankAdjustment,
  calculateAdjustedRank,
} = require("./shared.js");
const { getSentiment } = require("./sentimentAnalysis.js");

/**
 * Extracts the most frequent keywords from a given text.
 *
 * @param {string} text - The input text to extract keywords from.
 * @param {number} [numKeywords=10] - The number of keywords to extract.
 * @returns {string[]} An array of the top 'numKeywords' keywords, sorted by frequency.
 */

function extractKeywords(text, numKeywords = 10) {
  const allWords = text.toLowerCase().split(/\s+/);
  const filteredWords = allWords.filter((word) => !stopwords.includes(word));

  const wordFrequencies = {};
  filteredWords.forEach((word) => {
    wordFrequencies[word] = (wordFrequencies[word] || 0) + 1;
  });

  const sortedKeywords = Object.keys(wordFrequencies).sort(
    (a, b) => wordFrequencies[b] - wordFrequencies[a]
  );

  return sortedKeywords.slice(0, numKeywords);
}

/**
 * Calculates a score for a sentence based on the presence of targeted keywords.
 *
 * @param {string} sentence - The sentence to be scored.
 * @param {string[]} keywords - An array of keywords to score against.
 * @returns {number} A score representing the number of keywords found in the sentence.
 */

function calculateKeywordFrequencyScore(sentence, keywords) {
  const words = sentence.split(/\s+/);
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

/**
 * Generates a summary based on keyword frequency, emphasizing words in the document's "title".
 * Also adjusts sentence importance based on their sentiment.
 *
 * @param {string} text - The input text for summarization.
 * @param {number} [numberOfSentences=5] - The desired number of sentences in the summary.
 * @param {number} [positiveSentimentThreshold=0] - Minimum sentiment score for positive sentiment consideration.
 * @param {number} [negativeSentimentThreshold=0] - Maximum sentiment score for negative sentiment consideration.
 * @param {number} [positiveRankBoost=0] - Boost applied to the ranking of positive sentences.
 * @param {number} [negativeRankBoost=0] - Boost applied to the ranking of negative sentences.
 * @returns {string} The generated summary.
 * @throws {Error} If any input parameters are invalid.
 */

async function sentimentExtractiveWeightedSummary(
  text,
  numberOfSentences = 5,
  positiveSentimentThreshold = 0,
  negativeSentimentThreshold = 0,
  positiveRankBoost = 0,
  negativeRankBoost = 0
) {
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

  // Define the "title" as the first 1% of sentences but not more than 3 sentences
  const titleLength = Math.min(Math.ceil(sentences.length * 0.01), 3);
  const titleSentences = sentences.slice(0, titleLength);
  const titleWords = titleSentences
    .join(" ")
    .split(/\s+/)
    .filter((word) => !stopwords.includes(word.toLowerCase()));

  const keywords = extractKeywords(text);
  let sentenceDetails = await Promise.all(
    sentences.slice(titleLength).map(async (sentence, index) => {
      const keywordFrequencyScore = calculateKeywordFrequencyScore(
        sentence,
        keywords
      );
      const titleWordScore = calculateKeywordFrequencyScore(
        sentence,
        titleWords
      );
      const sentimentScore = await getSentiment(sentence);
      const sentimentRankAdjustment = getSentimentRankAdjustment(
        sentimentScore,
        positiveSentimentThreshold,
        negativeSentimentThreshold,
        positiveRankBoost,
        negativeRankBoost
      );

      return {
        sentence,
        index: index + titleLength, // adjust index to account for title sentences
        sentiment: sentimentScore,
        rank: calculateAdjustedRank(
          keywordFrequencyScore + titleWordScore, // combine keyword and title word scores
          sentimentRankAdjustment
        ),
      };
    })
  );

  sentenceDetails = sentenceDetails.filter((item) => item !== null);
  sentenceDetails.sort((a, b) => b.rank - a.rank);
  const topSentences = sentenceDetails
    .slice(0, numberOfSentences)
    .sort((a, b) => a.index - b.index);
  const summary = topSentences
    .map((detail) => detail.sentence.trim())
    .join(" ")
    .trim();

  return summary;
}

module.exports = { sentimentExtractiveWeightedSummary };
