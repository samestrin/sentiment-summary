const tf = require("@tensorflow/tfjs-node");
const tokenizer =
  require("@tensorflow/tfjs-node/dist/ops/utils.js").node.nlp.BertTokenizer.fromStaticData();
const { loadModel } = require("./loadModel");

// Load the model
const model = await loadModel();

/**
 * Get word embeddings for each word in a sentence using ALBERT.
 * @param {string} sentence - The sentence to process.
 * @returns {Promise<Array>} A promise that resolves to an array of vectors, one for each word.
 */
async function getWordEmbeddings(sentence) {
  // Tokenize the input sentence
  const tokens = tokenizer.tokenize(sentence);
  const inputIds = tokenizer.buildInputIds(tokens);

  // Pass the tokens to the model and get the output
  const output = model.execute({ input_ids: tf.tensor([inputIds]) });

  // Extract the word embeddings from the model output
  const wordEmbeddings = output[0].arraySync()[0];

  return wordEmbeddings;
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

function calculateAdjustedRanked(rank = 0, sentimentRankAdjustment = 0) {
  return rank + sentimentRankAdjustment;
}

module.exports = {
  getWordEmbeddings,
  getSentimentRankAdjustment,
  getTfIdfVectors,
  getTfIdfMatrix,
  cosineSimilarity,
  calculateAdjustedRanked,
};
