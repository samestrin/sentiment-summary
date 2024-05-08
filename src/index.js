/**
 * The sentiment-summary npm module generates text summaries weighted by the sentiment expressed in individual sentences.
 * It analyzes the sentiment of each sentence within a larger body of text and emphasizes or deemphasizes sentences based
 * on their sentiment scores during the summarization process.
 *
 * Copyright (c) 2024-PRESENT Sam Estrin
 * This script is licensed under the MIT License (see LICENSE for details)
 * GitHub: https://github.com/samestrin/sentiment-summary
 */

const { sentimentSummary } = require("./functions/summary.js");

const {
  getModel,
  getModelUrl,
  getModelPath,
  getModels,
  defaultModel,
} = require("./functions/models.js");

module.exports = {
  sentimentSummary,
  getModel,
  getModelUrl,
  getModelPath,
  getModels,
};
