const natural = require("natural");
const SentenceTokenizer = natural.SentenceTokenizer;
const vader = require("vader-sentiment");
const TfIdf = natural.TfIdf;
const { manageErrors } = require("./errors.js");
const {
  getSentimentRankAdjustment,
  calculateAdjustedRank,
  getTfIdfVectors,
  cosineSimilarity,
} = require("./shared.js");
/**
 * Generates a summary from a given text by ranking sentences based on their LexRank score adjusted by their sentiment.
 * LexRank is a graph-based method for determining key sentences in the text by ranking them according to their centrality in the sentence similarity graph.
 * This function integrates sentiment analysis to adjust the ranks based on the emotional content of the sentences, emphasizing sentences with significant positive or negative sentiments.
 *
 * @param {string} text - The input text from which the summary is generated.
 * @param {number} numberOfSentences - The number of top-ranked sentences to include in the summary (default is 5).
 * @param {number} positiveSentimentThreshold - The threshold above which a positive sentiment score triggers a rank boost (default is 0).
 * @param {number} negativeSentimentThreshold - The threshold below which a negative sentiment score triggers a rank boost (default is 0).
 * @param {number} positiveRankBoost - The multiplier applied to the base LexRank score for sentences with positive sentiments above the threshold (default is 0).
 * @param {number} negativeRankBoost - The multiplier applied to the base LexRank score for sentences with negative sentiments below the threshold (default is 0).
 *
 * @returns {string} A string that concatenates the top-ranked sentences to form the summary.
 */
function sentimentLexRankSummary(
  text,
  numberOfSentences = 5,
  positiveSentimentThreshold = 0,
  negativeSentimentThreshold = 0,
  positiveRankBoost = 0,
  negativeRankBoost = 0
) {
  // throw errors if invalid input values are passed
  manageErrors(
    text,
    numberOfSentences,
    positiveSentimentThreshold,
    negativeSentimentThreshold,
    positiveRankBoost,
    negativeRankBoost
  );

  // Create an instance of SentenceTokenizer
  const sentenceTokenizer = new SentenceTokenizer();
  let sentences = sentenceTokenizer.tokenize(text);

  // Calculate LexRank scores
  let sentenceDetails = lexRankSentences(sentences);

  // Compute sentiments and adjust ranks
  sentenceDetails = sentenceDetails.map((details) => {
    let sentimentScore = vader.SentimentIntensityAnalyzer.polarity_scores(
      details.sentence
    ).compound;

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
  });

  // Sort sentences by the modified rank
  sentenceDetails.sort((a, b) => b.rank - a.rank);

  // Select the top N sentences and return them as a single string
  return sentenceDetails
    .slice(0, numberOfSentences)
    .map((details) => details.sentence)
    .join(" ");
}

function lexRankSentences(sentences) {
  let tfidf = new TfIdf();
  sentences.forEach((sentence) => tfidf.addDocument(sentence));
  let vectors = getTfIdfVectors(tfidf);

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

  // Use power method to approximate principal eigenvector
  let ranks = powerMethod(similarityMatrix, degrees, 0.85, 100);

  return sentences.map((sentence, index) => ({
    sentence,
    rank: ranks[index],
  }));
}

function calculateThreshold(similarityMatrix) {
  let scores = similarityMatrix.flat();
  return scores.reduce((a, b) => a + b, 0) / scores.length;
}

function powerMethod(matrix, degrees, damping = 0.85, maxIter = 100) {
  let N = matrix.length;
  let p = Array(N).fill(1 / N);
  for (let iter = 0; iter < maxIter; iter++) {
    let newP = Array(N).fill(1 - damping);
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
