/* LexRank for Text Summarization:
LexRank is a graph-based summarization method inspired by the PageRank algorithm used in web search engines.
It constructs a graph representation of the text, where vertices represent sentences, and edges represent semantic similarity between sentences.
The algorithm then computes a centrality score for each sentence, indicating its importance within the text.
Highly scored sentences are selected to form the summary, capturing the most salient information.
*/

const natural = require("natural");
const SentenceTokenizer = natural.SentenceTokenizer;
const TfIdf = natural.TfIdf;
const { manageErrors } = require("./errors.js");
const {
  getSentimentRankAdjustment,
  calculateAdjustedRank,
  getTfIdfVectors,
  cosineSimilarity,
} = require("./shared.js");
const { getSentiment } = require("./sentimentAnalysis.js");

/**
 * Generates a sentiment-aware summary using the LexRank algorithm. Prioritizes sentences with strong positive or negative sentiment.
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
 * const review = "The food was delicious! The service was slow, but overall it was a great experience.";
 * const summary = await sentimentLexRankSummary(review, 2);
 * console.log(summary);
 */

async function sentimentLexRankSummary(
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

  // Tokenize the text into sentences
  const sentenceTokenizer = new SentenceTokenizer();
  let sentences = sentenceTokenizer.tokenize(text);

  // Calculate LexRank scores
  let sentenceDetails = lexRankSentences(sentences);

  // Compute sentiments and adjust ranks asynchronously
  const sentimentDetails = await Promise.all(
    sentenceDetails.map(async (details) => {
      const sentimentScore = await getSentiment(details.sentence);

      const sentimentRankAdjustment = getSentimentRankAdjustment(
        sentimentScore,
        positiveSentimentThreshold,
        negativeSentimentThreshold,
        positiveRankBoost,
        negativeRankBoost
      );

      return {
        ...details,
        rank: calculateAdjustedRank(details.rank, sentimentRankAdjustment),
      };
    })
  );

  // Sort sentences by the modified rank
  sentimentDetails.sort((a, b) => b.rank - a.rank);

  // Select the top N sentences and return them as a single string
  return sentimentDetails
    .slice(0, numberOfSentences)
    .map((details) => details.sentence)
    .join(" ");
}

/**
 * Computes LexRank scores for sentences to determine their importance within a text.
 *
 * @param {string[]} sentences - An array of sentences from the input text.
 * @returns {object[]} Array of objects, each containing:
 *   * sentence: The original sentence.
 *   * rank: The calculated LexRank importance score.
 */

function lexRankSentences(sentences) {
  let tfidf = new TfIdf();
  sentences.forEach((sentence) => tfidf.addDocument(sentence));
  let vectors = getTfIdfVectors(tfidf); // Ensure this returns a proper list of vectors

  // Compute the cosine similarity matrix
  let similarityMatrix = vectors.map((vecA) =>
    vectors.map((vecB) => cosineSimilarity(vecA, vecB))
  );

  let threshold = calculateThreshold(similarityMatrix);

  // Apply threshold to similarity matrix and calculate degrees
  let degrees = Array(sentences.length).fill(0);
  similarityMatrix = similarityMatrix.map((row, i) =>
    row.map((score, j) => {
      if (score > threshold && i !== j) {
        degrees[i]++;
        return 1;
      }
      return 0;
    })
  );

  // Check if any degrees are zero and adjust them to avoid division by zero
  degrees = degrees.map((degree) => (degree === 0 ? 1 : degree));

  // Use power method to approximate principal eigenvector
  let ranks = powerMethod(similarityMatrix, degrees, 0.85, 100);

  return sentences.map((sentence, index) => ({
    sentence,
    rank: ranks[index],
  }));
}

/**
 * Calculates a similarity threshold for building the LexRank graph.
 *
 * @param {number[][]} similarityMatrix - A matrix representing the cosine similarities between sentences.
 * @returns {number} The average similarity score, used as a threshold.
 */

function calculateThreshold(similarityMatrix) {
  let scores = similarityMatrix.flat();
  return scores.reduce((a, b) => a + b, 0) / scores.length;
}

/**
 * Approximates the principal eigenvector (representing sentence importance) of a graph using the power iteration method.
 *
 * @param {number[][]} matrix -  Represents a graph, often an adjacency or similarity matrix.
 * @param {number[]} degrees  - Represents the out-degrees of each node in the graph.
 * @param {number} [damping=0.85]  - Damping factor to prevent oscillations (probability of a 'random jump').
 * @param {number} [maxIter=100] -  Maximum number of iterations for convergence.
 * @returns {number[]}  An array of scores approximating the importance of each node (sentence).
 */

function powerMethod(matrix, degrees, damping = 0.85, maxIter = 100) {
  let N = matrix.length;
  let p = Array(N).fill(1 / N); // Start with an equal probability for each node
  for (let iter = 0; iter < maxIter; iter++) {
    let newP = Array(N).fill((1 - damping) / N); // Ensure the random teleportation is uniformly distributed
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        newP[i] += ((damping * matrix[j][i]) / degrees[j]) * p[j];
      }
    }
    p = newP;
  }
  return p;
}

module.exports = { sentimentLexRankSummary };
