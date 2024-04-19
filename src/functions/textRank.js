/* TextRank for Text Summarization:
TextRank is another graph-based summarization method similar to LexRank.
However, instead of using semantic similarity between sentences, TextRank uses co-occurrence relationships between words or phrases to construct the graph.
Vertices represent words or phrases, and edges represent co-occurrence links between them.
The algorithm computes a centrality score for each word or phrase, and sentences containing the highest-ranked words or phrases are selected for the summary.
*/

const natural = require("natural");
const { manageErrors } = require("./errors.js");
const {
  getSentimentRankAdjustment,
  calculateAdjustedRank,
  getTfIdfVectors,
  cosineSimilarity,
} = require("./shared.js");
const { getSentiment } = require("./sentiment.js");

/**
 * Generates a sentiment-aware summary using the TextRank algorithm. Prioritizes sentences containing important words/phrases and those with strong sentiments.
 *
 * @param {string} text - The input text for summarization.
 * @param {number} [numberOfSentences=5] -  Desired number of sentences in the summary.
 * @param {number} [positiveSentimentThreshold=0] - Minimum sentiment score to consider a sentence positive.
 * @param {number} [negativeSentimentThreshold=0] - Maximum sentiment score to consider a sentence negative.
 * @param {number} [positiveRankBoost=0] - Boost applied to the ranking of positive sentences.
 * @param {number} [negativeRankBoost=0] - Boost applied to the ranking of negative sentences.
 * @returns {string} The generated summary.
 * @throws {Error} If any input parameters are invalid (delegated to 'manageErrors').
 *
 * @example
 *
 * const review = "The scenery was beautiful but the hotel room was cramped. I really enjoyed the food though!";
 * const summary = await sentimentTextRankSummary(review, 2);
 * console.log(summary);
 */

async function sentimentTextRankSummary(
  text,
  numberOfSentences = 5,
  positiveSentimentThreshold = 0,
  negativeSentimentThreshold = 0,
  positiveRankBoost = 0,
  negativeRankBoost = 0
) {
  // Validate input values
  manageErrors(
    text,
    numberOfSentences,
    positiveSentimentThreshold,
    negativeSentimentThreshold,
    positiveRankBoost,
    negativeRankBoost
  );

  const sentenceTokenizer = new natural.SentenceTokenizer();
  let sentences = sentenceTokenizer.tokenize(text);

  let sentenceDetails = await textRankSentences(sentences);
  sentenceDetails = await Promise.all(
    sentenceDetails.map(async (details) => {
      let sentimentScore = await getSentiment(details.sentence);
      let sentimentRankAdjustment = getSentimentRankAdjustment(
        sentimentScore,
        positiveSentimentThreshold,
        negativeSentimentThreshold,
        positiveRankBoost,
        negativeRankBoost
      );

      return {
        ...details,
        sentiment: sentimentScore,
        rank: calculateAdjustedRank(details.rank, sentimentRankAdjustment),
      };
    })
  );

  sentenceDetails.sort((a, b) => b.rank - a.rank);
  let summary = sentenceDetails
    .slice(0, numberOfSentences)
    .map((details) => details.sentence)
    .join(" ");
  return summary;
}

async function textRankSentences(sentences) {
  const tfidf = new natural.TfIdf();
  sentences.forEach((sentence) => tfidf.addDocument(sentence));
  const vectors = getTfIdfVectors(tfidf);

  let sentenceScores = Array(sentences.length).fill(1);
  let similarityMatrix = sentences.map(() => Array(sentences.length).fill(0));

  for (let i = 0; i < sentences.length; i++) {
    for (let j = i + 1; j < sentences.length; j++) {
      let similarity = cosineSimilarity(vectors[i], vectors[j]);
      similarityMatrix[i][j] = similarity;
      similarityMatrix[j][i] = similarity;
    }
  }

  for (let iter = 0; iter < 20; iter++) {
    let newScores = sentenceScores.slice();
    for (let i = 0; i < sentences.length; i++) {
      let sum = 0;
      for (let j = 0; j < sentences.length; j++) {
        if (i !== j && similarityMatrix[i][j] > 0) {
          sum += similarityMatrix[i][j] / (sentences[j].length || 1);
        }
      }
      newScores[i] = 0.15 + 0.85 * sum;
    }
    sentenceScores = newScores;
  }

  return sentences.map((sentence, index) => ({
    sentence,
    rank: sentenceScores[index],
  }));
}
