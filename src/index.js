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
