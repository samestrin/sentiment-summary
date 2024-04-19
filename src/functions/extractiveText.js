/* Extractive Text for Text Summarization:
This method ranks sentences based on the frequency of keywords or phrases they contain.
Sentences with more frequent words or phrases are considered more important and included in the summary.
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
 * Extracts the most relevant keywords from a given text.
 *
 * @param {string} text - The input text to extract keywords from.
 * @param {number} [numKeywords=10] - The desired number of keywords to extract.
 * @returns {string[]} An array of the top 'numKeywords' keywords.
 *
 * @example
 *
 * const document = "Natural language processing is awesome for text analysis.";
 * const keywords = extractKeywords(document, 5);
 * console.log(keywords); // Output: ['natural', 'language', 'processing', 'awesome', 'text']
 */

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

/**
 * Calculates a score for a sentence based on the presence of targeted keywords.
 *
 * @param {string} sentence - The sentence to be scored.
 * @param {string[]} keywords - An array of keywords to score against.
 * @returns {number} A score representing the number of keywords found in the sentence.
 *
 * @example
 *
 * const sentence = "This sentence includes important keywords.";
 * const keywords = ['sentence', 'important', 'keywords'];
 * const score = calculateKeywordFrequencyScore(sentence, keywords);
 * console.log(score); // Output: 3
 */

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

/**
 * Generates a sentiment-aware extractive summary of a given text.
 *
 * @param {string} text - The input text for summarization.
 * @param {number} [numberOfSentences=5] -  Desired number of sentences in the summary.
 * @param {number} [positiveSentimentThreshold=0] - Minimum sentiment score to consider a sentence positive.
 * @param {number} [negativeSentimentThreshold=0] - Maximum sentiment score to consider a sentence negative.
 * @param {number} [positiveRankBoost=0] - Boost applied to the ranking of positive sentences.
 * @param {number} [negativeRankBoost=0] - Boost applied to the ranking of negative sentence.
 * @returns {string} The generated summary.
 * @throws {Error} If any input parameters are invalid.
 *
 * @example
 *
 * const review = "This product is amazing! I have some minor issues, but overall, I would highly recommend it.";
 * const summary = await sentimentExtractiveSummary(review, 2);
 * console.log(summary); // Output: "This product is amazing! I would highly recommend it."
 */

async function sentimentExtractiveSummary(
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
  const keywords = extractKeywords(text);

  let sentenceDetails = await Promise.all(
    sentences.map(async (sentence, index) => {
      if (sentence.trim()) {
        const keywordFrequencyScore = calculateKeywordFrequencyScore(
          sentence,
          keywords
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
          index,
          sentiment: sentimentScore,
          rank: calculateAdjustedRank(
            keywordFrequencyScore,
            sentimentRankAdjustment
          ),
        };
      }
      return null;
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

module.exports = { sentimentExtractiveSummary };
