const natural = require("natural");
const { manageErrors } = require("./errors.js");
const {
  getSentimentRankAdjustment,
  calculateAdjustedRank,
  getTfIdfVectors,
  cosineSimilarity,
} = require("./shared.js");
const { getSentiment } = require("./sentiment.js");

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
