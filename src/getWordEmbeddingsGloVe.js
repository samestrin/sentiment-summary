const fastText = require("node-fasttext");

// Load the fastText model (adjust the path to where your model is stored)
const modelPath = "../gloVe/glove.6B.50d.txt";

let modelLoaded = false;

fastText.loadModel(modelPath, function (err) {
  if (err) {
    console.error("Failed to load the fastText model:", err);
    return;
  }
  modelLoaded = true;
  console.log("fastText model loaded successfully.");
});

/**
 * Get word embeddings for each word in a sentence using fastText.
 * @param {string} sentence - The sentence to process.
 * @returns {Promise<Array>} A promise that resolves to an array of vectors, one for each word.
 */
function getWordEmbeddings(sentence) {
  return new Promise((resolve, reject) => {
    if (!modelLoaded) {
      return reject(new Error("fastText model is not loaded yet."));
    }
    const words = sentence.split(/\s+/);
    let embeddings = [];
    let count = 0;

    words.forEach((word) => {
      fastText.getWordVector(word, function (err, vector) {
        if (err) {
          console.error("Error getting vector for word:", word, err);
          embeddings.push(Array(300).fill(0)); // Assume 300 dimensions and fill with zeros on error
        } else {
          embeddings.push(vector);
        }
        count++;
        if (count === words.length) {
          resolve(embeddings);
        }
      });
    });
  });
}
module.exports = { getWordEmbeddings };
