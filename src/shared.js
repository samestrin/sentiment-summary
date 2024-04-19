const tf = require("@tensorflow/tfjs-node");
const { BertTokenizer } = require("@tensorflow/tfjs-node");
const { loadModel } = require("./loadModel");
const stopwords = require("natural").stopwords;
const TfIdf = require("natural").TfIdf;

let model;
/**
 * Get word embeddings for each word in a sentence using ALBERT.
 * @param {string} sentence - The sentence to process.
 * @returns {Promise<Array>} A promise that resolves to an array of vectors, one for each word.
 */
async function getWordEmbeddings(sentence) {
  // Load the model
  model = await loadModel();

  // Tokenize the input sentence

  const tokenizer = BertTokenizer.fromStaticData();

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

function preprocessDocument(document) {
  // Lowercase, remove non-alphabet characters, split into words, filter stopwords and short words
  return document
    .toLowerCase()
    .replace(/[^a-z\s]/gi, "")
    .split(/\s+/)
    .filter((word) => word.length > 1 && !stopwords.includes(word));
}

function getTfIdfMatrix(documents, minDocFrequency = 0) {
  const tfidf = new TfIdf();
  documents
    .map(preprocessDocument)
    .forEach((doc) => tfidf.addDocument(doc.join(" "))); // Join words for TfIdf

  let terms = new Set();
  tfidf.documents.forEach((doc) => {
    Object.keys(doc).forEach((term) => {
      if (!isNaN(term)) return; // Skip numeric indices
      terms.add(term);
    });
  });

  terms = Array.from(terms);

  // Building the term-document matrix with terms as rows
  const matrix = terms.map((term) => {
    return documents.map((_, i) => tfidf.tfidf(term, i));
  });

  // Filter matrix and terms based on document frequency
  const filteredMatrix = matrix.filter((row, idx) => {
    const docFrequency =
      row.filter((value) => value > 0).length / documents.length;
    return docFrequency >= minDocFrequency;
  });
  const filteredTerms = terms.filter((_, idx) => {
    const row = matrix[idx];
    const docFrequency =
      row.filter((value) => value > 0).length / documents.length;
    return docFrequency >= minDocFrequency;
  });

  // Debug to check term frequencies
  filteredTerms.forEach((term, idx) => {
    const count = filteredMatrix[idx].filter((value) => value > 0).length;
  });

  return { matrix: filteredMatrix, terms: filteredTerms }; // Return the untransposed filtered matrix
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

function calculateAdjustedRank(rank = 0, sentimentRankAdjustment = 0) {
  return rank + rank * sentimentRankAdjustment;
}

module.exports = {
  getWordEmbeddings,
  getSentimentRankAdjustment,
  getTfIdfVectors,
  getTfIdfMatrix,
  cosineSimilarity,
  calculateAdjustedRank,
};
