const natural = require("natural");
const TfIdf = natural.TfIdf;
const tokenizer = new natural.WordTokenizer();
const SentenceTokenizer = natural.SentenceTokenizer;
const vader = require("vader-sentiment");
const { manageErrors } = require("./errors.js");
const {
  getSentimentRankAdjustment,
  calculateAdjustedRanked,
  getTfIdfVectors,
  cosineSimilarity,
} = require("./shared.js");

/**
 * Generates a summary from a given text by ranking sentences based on their TextRank score adjusted by their sentiment.
 * This function integrates the use of TextRank for determining the importance of sentences within the text and sentiment analysis
 * to adjust these ranks based on the emotional content of sentences. Sentences with significant positive or negative sentiments
 * are given a rank boost to emphasize their relevance in the summary.
 *
 * @param {string} text - The input text from which the summary is generated.
 * @param {number} numberOfSentences - The number of top-ranked sentences to include in the summary (default is 5).
 * @param {number} positiveSentimentThreshold - The threshold above which a positive sentiment score triggers a rank boost (default is 0).
 * @param {number} negativeSentimentThreshold - The threshold below which a negative sentiment score triggers a rank boost (default is 0).
 * @param {number} positiveRankBoost - The multiplier applied to the base TextRank score for sentences with positive sentiments above the threshold (default is 0).
 * @param {number} negativeRankBoost - The multiplier applied to the base TextRank score for sentences with negative sentiments below the threshold (default is 0).
 *
 * @returns {string} A string that concatenates the top-ranked sentences to form the summary.
 *
 * The function works by initializing TextRank and sentiment analysis using the 'vader-sentiment' library. It first tokenizes the text into sentences,
 * computes their base TextRank scores, and evaluates their sentiment scores. Depending on whether the sentiment scores are above or below
 * specified thresholds, the function adjusts the TextRank scores by the specified boosts. Sentences are then sorted by their adjusted ranks,
 * and the top sentences as specified by 'numberOfSentences' are concatenated to form the final summary.
 *
 * This function is especially useful for texts where understanding the emotional tone is crucial, such as in reviews, feedback, or news articles.
 */
function sentimentTextRankSummary(
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

  // Create an instance of SentenceTokenizer and Vader SentimentIntensityAnalyzer
  const sentenceTokenizer = new SentenceTokenizer();

  // Split text into sentences
  let sentences = sentenceTokenizer.tokenize(text);

  // Extract sentences using TextRank
  let sentenceDetails = textRankSentences(sentences);

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
      rank: calculateAdjustedRanked(details.rank, sentimentRankAdjustment),
    };
  });

  // Sort sentences by the modified rank
  sentenceDetails.sort((a, b) => b.rank - a.rank);
  //console.log(sentenceDetails);
  // Select the top N sentences and return them as a single string
  let summary = sentenceDetails
    .slice(0, numberOfSentences)
    .map((details) => details.sentence)
    .join(" ");
  //  console.log(summary);
  return summary;
}

function textRankSentences(sentences) {
  let tfidf = new TfIdf();
  sentences.forEach((sentence) => tfidf.addDocument(sentence));
  const vectors = getTfIdfVectors(tfidf);

  let sentenceScores = Array(sentences.length).fill(1); // Initial score for each sentence
  let similarityMatrix = sentences.map(() => Array(sentences.length).fill(0));

  // Build similarity matrix
  for (let i = 0; i < sentences.length; i++) {
    for (let j = i + 1; j < sentences.length; j++) {
      let similarity = cosineSimilarity(vectors[i], vectors[j]);
      similarityMatrix[i][j] = similarity;
      similarityMatrix[j][i] = similarity;
    }
  }

  // Calculate scores using TextRank formula iteratively
  for (let iter = 0; iter < 20; iter++) {
    let newScores = sentenceScores.slice();
    for (let i = 0; i < sentences.length; i++) {
      let sum = 0;
      for (let j = 0; j < sentences.length; j++) {
        if (i !== j && similarityMatrix[i][j] > 0) {
          sum += similarityMatrix[i][j] / (sentences[j].length || 1); // normalizing by sentence length
        }
      }
      newScores[i] = 0.15 + 0.85 * sum; // damping factor of 0.85
    }
    sentenceScores = newScores;
  }

  return sentences.map((sentence, index) => ({
    sentence,
    rank: sentenceScores[index],
  }));
}

module.exports = { sentimentTextRankSummary };
