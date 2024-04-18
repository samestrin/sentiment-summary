// loadModel.js
const tf = require("@tensorflow/tfjs-node");
const path = require("path");

// Define the cache directory
const cacheDir = path.join(__dirname, "model_cache");

// Default model URL
const defaultModelUrl =
  "https://huggingface.co/albert-base-v2/resolve/main/pytorch_model.bin";

// Load and cache the default model
let model;

const loadModel = async () => {
  if (!model) {
    model = await tf.node.loadCachedModel(defaultModelUrl, {
      fromTFHub: false,
      cacheDir,
    });
  }
  return model;
};

module.exports = { loadModel };
