const vader = require("vader-sentiment");
const Sentiment = require("sentiment");
const natural = require("natural");
const afinnSentiment = new natural.SentimentAnalyzer("English", natural.Afinn);
const winkSentiment = require("wink-sentiment");

import { env, pipeline } from "@xenova/transformers";

var sentimentAnalysis = require("sentiment-analysis");

const { defaultModel, getModelPath } = require("./models.js");

// Define the cache directory
env.cacheDir = path.join(__dirname, "../../.model_cache");

let classifier;

/**
 * Calculates a sentiment score for the provided text using the selected sentiment analysis engine.
 * Supports multiple engines: VADER, Hugging Face, Sentiment (AFINN-165), wink-sentiment,
 * sentiment-analysis (AFINN-111), Natural Node, and ml-sentiment.
 *
 * @param {string} text - The input text to analyze.
 * @param {string} [engine="vader"] - The engine to use. Options include:
 *   * 'vader', 'hugging-face', 'sentiment'(AFINN-165), 'wink-sentiment',
 *   * 'sentiment-analysis' (AFINN-111), 'natural'
 * @param {string} [model=""] -  Name of the Hugging Face model (if 'hugging-face' engine selected).
 * @returns {number} A sentiment score between -1 (most negative) and 1 (most positive).
 */

async function getSentiment(text, engine = "vader", model = "") {
  let sentimentScore = 0;

  switch (engine) {
    case "hugging-face":
      let hfModel = getModelPath(model);
      if (!hfModel) {
        hfModel = getModelPath(defaultModel);
      }
      sentimentScore = getHuggingFace(text, model);
      break;

    case "sentiment":
    case "AFINN-165":
      sentimentScore = getSentimentNPM(text);
      break;

    case "wink-sentiment":
      return getWinkSentiment(text);
      break;

    case "sentiment-analysis":
    case "AFINN-111":
      sentimentScore = getSentimentAnalysis(text);
      break;

    case "natural":
      sentimentScore = getNatural(text);
      break;

    case "vader":
    default:
      sentimentScore = getVader(text);
      break;
  }

  return sentimentScore;
}

/**
 * Calculates a sentiment score for the provided text using a Hugging Face sentiment analysis model.
 * Loads the model dynamically and normalizes the output score.
 *
 * @param {string} text - The input text to analyze.
 * @param {string} model - The name of the Hugging Face model.
 * @returns {number}  A sentiment score between -1 (most negative) and 1 (most positive).
 * @throws {Error} If there are issues loading or using the Hugging Face model.
 */

async function getHuggingFace(text, model) {
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

/**
 * Calculates a sentiment score for the provided text using the VADER sentiment analysis library.
 *
 * @param {string} text -  The input text to analyze.
 * @returns {number}  A sentiment score between -1 (most negative) and 1 (most positive).
 */

function getVader(text) {
  return vader.SentimentIntensityAnalyzer.polarity_scores(text).compound;
}

/**
 * Calculates a sentiment score using the 'sentiment' npm module (AFINN-165 based).
 *
 * @param {string} text - The input text to analyze.
 * @returns {number}  A sentiment score between -1 (most negative) and 1 (most positive).
 */

function getSentimentNPM(text) {
  const sentiment = new Sentiment();
  const result = sentiment.analyze(text);
  // Normalizing the score to be between -1 and 1
  let normalizedScore =
    result.score / Math.max(1, Math.abs(result.comparative));
  normalizedScore = Math.max(-1, Math.min(1, normalizedScore));
  return normalizedScore;
}

/**
 * Calculates a sentiment score using the 'sentiment-analysis' npm module (AFINN-111 based).
 *
 * @param {string} text - The input text to analyze.
 * @returns {number} A sentiment score in a range specific to the 'sentiment-analysis' module.
 *                   Output may need normalization to the [-1, 1] range.
 */

function getSentimentAnalysis(text) {
  return sentimentAnalysis(text);
}

/**
 * Calculates a sentiment score using the 'wink-sentiment' npm module.
 * Normalizes score from the module's output range to the standard [-1, 1] range.
 *
 * @param {string} text - The input text to analyze.
 * @returns {number} A sentiment score between -1 (most negative) and 1 (most positive).
 */

function getWinkSentiment(text) {
  const result = winkSentiment(text);
  // Normalize the score: result.score ranges from very negative to very positive
  const normalizedScore = Math.max(-1, Math.min(1, result.score / 5)); // Adjust 5 based on observed maximum scores
  return normalizedScore;
}

/**
 * Calculates a sentiment score using the Natural Node.js library with an AFINN-based analyzer.
 * Normalizes the score to the standard [-1, 1] range.
 *
 * @param {string} text - The input text to analyze.
 * @returns {number} A sentiment score between -1 (most negative) and 1 (most positive).
 */

function getNatural(text) {
  const tokenizedText = new natural.WordTokenizer().tokenize(text); // Tokenize input text
  const analysisResult = afinnSentiment.getSentiment(tokenizedText);

  // Normalizing the sentiment score to be between -1 and 1
  // Assuming that scores typically range between -5 to 5, adjust based on observed scores if needed
  const normalizedScore = Math.max(-1, Math.min(1, analysisResult / 5));
  return normalizedScore;
}

module.exports = { getSentiment };
