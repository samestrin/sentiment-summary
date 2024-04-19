/*
This code provides utility functions for managing and accessing information about machine learning models from the Hugging Face model repository.
 */

const defaultModel = "sentiment-roberta-large-english";

let modelDataCache;

/**
 * Retrieves a model path of a specific model by its name.
 *
 * @param {string} modelName - The name of the model to search for.
 * @returns {string} A relative model path.
 * @throws {Error} If the requested model is not found.
 */

function getModelPath(modelName) {
  const matchedModel = getModel(modelName);
  if (matchedModel) {
    return matchedModel.path;
  } else {
    throw new Error(`Model '${modelName}' not found.`);
  }
}

/**
 * Retrieves the URL of a specific model by its name.
 *
 * @param {string} modelName - The name of the model to search for.
 * @returns {string} The URL where the model is hosted.
 * @throws {Error} If the requested model is not found.
 */

function getModelUrl(modelName) {
  const matchedModel = getModel(modelName);
  if (matchedModel) {
    return matchedModel.URL;
  } else {
    throw new Error(`Model '${modelName}' not found.`);
  }
}

/**
 * Retrieves a specific model's details by its name from the list of available models.
 *
 * @param {string} modelName - The name of the model to search for.
 * @returns {object} The model object containing 'name' and 'URL'.
 * @throws {Error} If the requested model is not found.
 */

function getModel(modelName) {
  const models = getModels();
  const matchedModel = models.find((model) => model.name === modelName);
  if (matchedModel) {
    return matchedModel;
  } else {
    throw new Error(`Model '${modelName}' not found.`);
  }
}

/**
 * Retrieves a list of available sentiment analysis models, optionally filtered by type.
 * Includes descriptions and type tags to aid in model selection. Results are cached for efficiency.
 *
 * @param {string} [type=""] - Filter models by a specific type (e.g., 'finance', 'news').
 * @returns {object[]} An array of model objects with the structure:
 *   * name: The model's name (e.g., "sentiment-roberta-large-english")
 *   * path: Relative path suitable for TensorFlow.js
 *   * URL:  Link to the model on Hugging Face.
 *   * description: A short explanation of the model.
 *   * type: The category of the model (e.g., "finance," "general")
 */

function getModels(type = "") {
  if (!modelDataCache) {
    const models = [
      {
        URL: "https://huggingface.co/mrm8488/distilroberta-finetuned-financial-news-sentiment-analysis",
        description: `This model is a fine-tuned version of distilroberta-base on the financial_phrasebank dataset.`,
        type: "general",
      },
      {
        URL: "https://huggingface.co/cardiffnlp/twitter-roberta-base-sentiment-latest",
        description: `This is a RoBERTa-base model trained on ~124M tweets from January 2018 to December 2021, and finetuned for sentiment analysis with the TweetEval benchmark. UPDATED (2022)`,
        type: "general",
      },
      {
        URL: "https://huggingface.co/siebert/sentiment-roberta-large-english",
        description: `This model ("SiEBERT", prefix for "Sentiment in English") is a fine-tuned checkpoint of RoBERTa-large (Liu et al. 2019).`,
        type: "general",
      },
      {
        URL: "https://huggingface.co/ShashwatDash/finetuning-sentiment-model-3000-samples-bert-small",
        description: `This model is a fine-tuned version of prajjwal1/bert-small on an unknown dataset.`,
        type: "general",
      },
      {
        URL: "https://huggingface.co/sbcBI/sentiment_analysis_model",
        description: `Pretrained model on English language using a masked language modeling (MLM) objective.`,
        type: "general",
      },
      {
        URL: "https://huggingface.co/ahmedrachid/FinancialBERT-Sentiment-Analysis",
        description: `FinancialBERT is a BERT model pre-trained on a large corpora of financial texts. The purpose is to enhance financial NLP research and practice in financial domain.`,
        type: "finance",
      },
      {
        URL: "https://huggingface.co/shashanksrinath/News_Sentiment_Analysis",
        description: `This model is a fine-tuned version of cardiffnlp/twitter-roberta-base-sentiment-latest on an unknown dataset.`,
        type: "news",
      },
      {
        URL: "https://huggingface.co/Jean-Baptiste/roberta-large-financial-news-sentiment-en",
        description: `This model was train on financial_news_sentiment_mixte_with_phrasebank_75 dataset. Model fine-tuned from roberta-large for sentiment classification of financial news (emphasis on Canadian news).`,
        type: "finance",
      },
      {
        URL: "https://huggingface.co/mrm8488/deberta-v3-ft-financial-news-sentiment-analysis",
        description: `This model is a fine-tuned version of microsoft/deberta-v3-small on the None dataset.`,
        type: "finance",
      },
      {
        URL: "https://huggingface.co/soleimanian/financial-roberta-large-sentiment",
        description: `Financial-RoBERTa is built by further training and fine-tuning the RoBERTa Large language model using a large corpus created from 10k, 10Q, 8K, Earnings Call Transcripts, CSR Reports, ESG News, and Financial News text.`,
        type: "finance",
      },
      {
        URL: "https://huggingface.co/mrm8488/distilroberta-finetuned-financial-news-sentiment-analysis",
        description: `This model is a fine-tuned version of distilroberta-base on the financial_phrasebank dataset.`,
        type: "finance",
      },
      {
        URL: "https://huggingface.co/LiyaT3/sentiment-analysis-imdb-distilbert",
        description: `This model is a fine-tuned version of distilbert-base-uncased on IMDb dataset.`,
        type: "movie",
      },
      {
        URL: "https://huggingface.co/cardiffnlp/twitter-roberta-base-2021-124m-sentiment",
        description: `This model is a fine-tuned version of cardiffnlp/twitter-roberta-base-2021-124m on the tweet_eval (sentiment) via tweetnlp.`,
        type: "general",
      },
      {
        URL: "https://huggingface.co/karimbkh/BERT_fineTuned_Sentiment_Classification_Yelp",
        description: `Sentiment classification of restaurant reviews from the Yelp dataset.Fine-tuned BERT (Bidirectional Encoder Representations from Transformers) for sequence classification.`,
        type: "restaurant",
      },
      {
        URL: "https://huggingface.co/MidhunKanadan/SentimentBERT-AIWriting",
        description: `This model is a fine-tuned version of bert-base-uncased for sentiment classification, particularly tailored for AI-assisted argumentative writing.`,
        type: "general",
      },
      {
        URL: "https://huggingface.co/AdamCodd/distilbert-base-uncased-finetuned-sentiment-amazon",
        description: `This model is a fine-tuned version of distilbert-base-uncased on a subset of the amazon-polarity dataset.`,
        type: "product reviews",
      },
      {
        URL: "https://huggingface.co/Kaludi/Reviews-Sentiment-Analysis",
        description: `A model used to analyze the overall sentiment of customer reviews for a specific product or service, whether it’s positive or negative. `,
        type: "product reviews",
      },
      {
        URL: "https://huggingface.co/juliensimon/reviews-sentiment-analysis",
        description: ``,
        type: "product reviews",
      },
      {
        URL: "https://huggingface.co/FinanceInc/auditor_sentiment_finetuned",
        description: `This model has been finetuned from the proprietary version of FinBERT trained internally using demo.org proprietary dataset of auditor evaluation of sentiment.`,
        type: "finance",
      },
      {
        URL: "https://huggingface.co/LiYuan/amazon-review-sentiment-analysis",
        description: `This model is a fine-tuned version of nlptown/bert-base-multilingual-uncased-sentiment on an Amazon US Customer Reviews Dataset. The`,
        type: "product reviews",
      },
      {
        URL: "https://huggingface.co/samayash/finetuning-financial-news-sentiment",
        description: `This model is a fine-tuned version of distilbert-base-uncased on the None dataset.`,
        type: "finance",
      },
      {
        URL: "https://huggingface.co/pavankrishna/news_sentiment_analysis",
        description: ``,
        type: "news",
      },
      {
        URL: "https://huggingface.co/ugursa/yahoo-finance-news-sentiment",
        description: ``,
        type: "finance",
      },
      {
        URL: "https://huggingface.co/fhamborg/roberta-targeted-sentiment-classification-newsarticles",
        description: ``,
        type: "news",
      },
    ];

    // Extract names/paths and sort the models by name
    models.forEach((model) => {
      // Extract the path from the URL
      model.path = model.URL.replace("https://huggingface.co/", "");

      // Extract the name from the URL, assuming it is the last segment after splitting by '/'
      const urlParts = model.URL.split("/");
      model.name = urlParts[urlParts.length - 1];
    });

    // Sort the models array by name
    models.sort((a, b) => a.name.localeCompare(b.name));
    modelDataCache = models;
  }

  // Return filtered models by type if type parameter is provided
  if (type) {
    return modelDataCache.filter((model) => model.type === type);
  } else {
    // Return all models if no type specified
    return modelDataCache;
  }
}

module.exports = {
  getModel,
  getModelUrl,
  getModelPath,
  getModels,

  defaultModel,
};
