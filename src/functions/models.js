// Default model URL (Change this to a valid TensorFlow.js model URL)

const defaultModel = "albert-base-v2-emotion";

function getModelPath(modelName) {
  const matchedModel = getModelUrl(modelName);
  if (matchedModel) {
    return matchedModel.replace("https://huggingface.co/", "");
  } else {
    throw new Error(`Model '${modelName}' not found.`);
  }
}
function getModelUrl(modelName) {
  const matchedModel = getModel(modelName);
  if (matchedModel) {
    return matchedModel.URL;
  } else {
    throw new Error(`Model '${modelName}' not found.`);
  }
}

function getModel(modelName) {
  const models = getModels();
  const matchedModel = models.find((model) => model.name === modelName);
  if (matchedModel) {
    return matchedModel;
  } else {
    throw new Error(`Model '${modelName}' not found.`);
  }
}

function getModels() {
  const models = [
    {
      name: "albert-base-v2",
      URL: "https://huggingface.co/albert/albert-base-v2",
    },
    {
      name: "albert-base-v2-finetuned-ner",
      URL: "https://huggingface.co/ArBert/albert-base-v2-finetuned-ner",
      accuracy: 0.985,
      f1Score: 0.934,
    },
    {
      name: "albert-base-v2-emotion",
      URL: "https://huggingface.co/bhadresh-savani/albert-base-v2-emotion",
      accuracy: 93,
      f1Score: 93.65,
      textSamplePerSecond: 182.794,
    },
    {
      name: "bertweet-base-emotion-analysis",
      URL: "https://huggingface.co/finiteautomata/bertweet-base-emotion-analysis",
    },
    {
      name: "bert-base-uncased-emotion",
      URL: "https://huggingface.co/bhadresh-savani/bert-base-uncased-emotion",
      accuracy: 94.05,
      f1Score: 94.06,
      textSamplePerSecond: 190.152,
    },
    {
      name: "distilbert-base-uncased-emotion",
      URL: "https://huggingface.co/bhadresh-savani/distilbert-base-uncased-emotion",
      accuracy: 93.8,
      f1Score: 93.79,
      textSamplePerSecond: 398.69,
    },
    {
      name: "distilbert-political-tweets",
      URL: "https://huggingface.co/m-newhauser/distilbert-political-tweets",
      accuracy: 90.9076,
      f1Score: 0.9117,
    },
    {
      name: "emotion-english-distilroberta-base",
      URL: "https://huggingface.co/j-hartmann/emotion-english-distilroberta-base",
    },
    {
      name: "roberta-base-emotion",
      URL: "https://huggingface.co/bhadresh-savani/roberta-base-emotion",
      accuracy: 93.95,
      f1Score: 93.97,
      textSamplePerSecond: 195.639,
    },
    {
      name: "roberta-base-emotion-go_emotions",
      URL: "https://huggingface.co/SamLowe/roberta-base-go_emotions",
    },
    {
      name: "twitter-roberta-base-sentiment-latest",
      URL: "https://huggingface.co/cardiffnlp/twitter-roberta-base-sentiment-latest",
    },
  ];
  return models;
}

module.exports = {
  getModel,
  getModelUrl,
  getModelPath,
  getModels,

  defaultModel,
};
