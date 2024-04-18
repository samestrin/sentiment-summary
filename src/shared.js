function calculateAdjustedRanked(rank = 0, sentimentRankAdjustment = 0) {
  return rank + sentimentRankAdjustment;
}

function getSentimentRankAdjustment(
  sentimentScore,
  positiveSentimentThreshold,
  negativeSentimentThreshold,
  positiveRankBoost,
  negativeRankBoost
) {
  let sentimentRankAdjustment = 0;
  if (sentimentScore >= positiveSentimentThreshold) {
    sentimentRankAdjustment = positiveRankBoost * sentimentScore;
  } else if (sentimentScore <= negativeSentimentThreshold) {
    sentimentRankAdjustment = negativeRankBoost * sentimentScore;
  }
  return sentimentRankAdjustment;
}

function getTfIdfVectors(tfidf) {
  const vectors = [];
  tfidf.documents.forEach((doc, index) => {
    const vector = {};
    for (const term in doc) {
      if (doc.hasOwnProperty(term)) {
        vector[term] = tfidf.tfidf(term, index);
      }
    }
    vectors.push(vector);
  });
  return vectors;
}

const natural = require("natural");
const TfIdf = natural.TfIdf;

function getTfIdfMatrix(documents) {
  const tfidf = new TfIdf();
  documents.forEach((doc) => tfidf.addDocument(doc));
  const matrix = [];
  const terms = [];

  // Assuming the first document includes all terms, this needs adaptation for larger, diverse corpora
  for (let term in tfidf.documents[0]) {
    if (!isNaN(term)) continue; // Skip term indices
    terms.push(term);
    const termColumn = [];
    for (let i = 0; i < documents.length; i++) {
      termColumn.push(tfidf.tfidf(term, i));
    }
    matrix.push(termColumn);
  }
  return { matrix: matrix.map((_, i) => matrix.map((row) => row[i])), terms };
}

function cosineSimilarity(vecA, vecB) {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  const keys = new Set(Object.keys(vecA).concat(Object.keys(vecB)));
  for (const key of keys) {
    const valueA = vecA[key] || 0;
    const valueB = vecB[key] || 0;
    dotProduct += valueA * valueB;
    normA += valueA * valueA;
    normB += valueB * valueB;
  }
  return normA === 0 || normB === 0
    ? 0
    : dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

module.exports = {
  getSentimentRankAdjustment,
  getTfIdfVectors,
  getTfIdfMatrix,
  cosineSimilarity,
  calculateAdjustedRanked,
};
