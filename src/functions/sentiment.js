const vader = require("vader-sentiment");
import { env, pipeline } from "@xenova/transformers";
import { defaultModel, getModelPath } from "./models.js";

// Define the cache directory
env.cacheDir = path.join(__dirname, "../../.model_cache");

let classifier;

async function getSentiment(text, engine = "vader", model = "") {
  let sentimentScore = 0;

  switch (engine) {
    case "hugging-face":
      let hfModel = getModelPath(model);

      if (!hfModel) {
        hfModel = getModelPath(defaultModel);
      }

      return getHuggingFaceSentiment(text, model);

      break;

    case "vader":
    default:
      return getVaderSentiment(text);
      break;
  }
}

async function getHuggingFaceSentiment(text, model) {
  try {
    if (!classifier) {
      classifier = await pipeline("sentiment-analysis", { model });
    }
  } catch (error) {
    console.error("Failed to load model:", error);
  }

  try {
    const result = await classifier(text);

    // Normalizing the score - assuming the result includes a label and score
    let normalizedScore = 0;

    // Example normalization logic
    if (result.label === "POSITIVE") {
      normalizedScore = result.score; // Map directly if positive
    } else if (result.label === "NEGATIVE") {
      normalizedScore = -result.score; // Negate if negative
    }

    // Ensure the score is within [-1, 1]
    normalizedScore = Math.max(-1, Math.min(1, normalizedScore));

    return normalizedScore;
  } catch (error) {
    console.error("Failed to classify text:", error);
  }
}

function getVaderSentiment(text) {
  return vader.SentimentIntensityAnalyzer.polarity_scores(text).compound;
}

module.exports = { getSentiment };
