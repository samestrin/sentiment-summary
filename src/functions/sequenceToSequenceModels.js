const natural = require("natural");
const tokenizer = new natural.WordTokenizer();
const SentenceTokenizer = natural.SentenceTokenizer;
const vader = require("vader-sentiment");
const { manageErrors } = require("./errors.js");
const { loadModel } = require("./loadModel");
const {
  getSentimentRankAdjustment,
  calculateAdjustedRank,
} = require("./shared.js");
/**
 * Generates a summary from a given text using the pre-trained ALBERT Seq2Seq model,
 * with sentiment analysis influencing the sentence selection.
 *
 * @param {string} text - The input text from which the summary is generated.
 * @param {number} numberOfSentences - The desired number of sentences in the generated summary (default is 5).
 * @param {number} beamSize - The beam size for the beam search algorithm used during generation (default is 5).
 * @param {number} positiveSentimentThreshold - The threshold above which a positive sentiment score triggers a rank boost (default is 0.5).
 * @param {number} negativeSentimentThreshold - The threshold below which a negative sentiment score triggers a rank boost (default is -0.5).
 * @param {number} positiveRankBoost - The multiplier applied to the base TextRank score for sentences with positive sentiments above the threshold (default is 1.5).
 * @param {number} negativeRankBoost - The multiplier applied to the base TextRank score for sentences with negative sentiments below the threshold (default is 1.5).
 *
 * @returns {string} A string representing the generated summary.
 */
async function sentimentSeq2SeqSummary(
  text,
  numberOfSentences = 5,
  beamSize = 5,
  positiveSentimentThreshold = 0.5,
  negativeSentimentThreshold = -0.5,
  positiveRankBoost = 1.5,
  negativeRankBoost = 1.5
) {
  // Throw errors if invalid input values are passed
  manageErrors(
    text,
    numberOfSentences,
    positiveSentimentThreshold,
    negativeSentimentThreshold,
    positiveRankBoost,
    negativeRankBoost,
    beamSize
  );

  // Load the model
  const model = await loadModel();

  // Tokenize the input text
  const sentenceTokenizer = new SentenceTokenizer();
  const sentences = sentenceTokenizer.tokenize(text);
  const encodedInput = sentences.map((sentence) =>
    tokenizer.tokenize(sentence)
  );

  // Calculate TextRank scores and sentiment scores
  const sentenceDetails = textRankWithSentimentScores(
    sentences,
    positiveSentimentThreshold,
    negativeSentimentThreshold,
    positiveRankBoost,
    negativeRankBoost
  );

  // Sort sentences by the adjusted TextRank scores
  sentenceDetails.sort((a, b) => b.rank - a.rank);

  // Select the top N sentences based on the adjusted TextRank scores
  const topSentences = sentenceDetails
    .slice(0, numberOfSentences)
    .map((details) => details.sentence);

  // Generate the summary using the pre-trained ALBERT model
  const summary = await model.generateText(topSentences, {
    numBeams: beamSize,
    maxLength: numberOfSentences,
    earlyStoppingThreshold: 0.5,
  });

  return summary;
}

/**
 * Calculates TextRank scores for sentences, adjusting them based on sentiment scores.
 *
 * @param {string[]} sentences - The array of sentences to analyze.
 * @param {number} positiveSentimentThreshold - The threshold above which a positive sentiment score triggers a rank boost.
 * @param {number} negativeSentimentThreshold - The threshold below which a negative sentiment score triggers a rank boost.
 * @param {number} positiveRankBoost - The multiplier applied to the base TextRank score for sentences with positive sentiments above the threshold.
 * @param {number} negativeRankBoost - The multiplier applied to the base TextRank score for sentences with negative sentiments below the threshold.
 *
 * @returns {Object[]} An array of objects containing the sentence, TextRank score, and sentiment score.
 */
function textRankWithSentimentScores(
  sentences,
  positiveSentimentThreshold,
  negativeSentimentThreshold,
  positiveRankBoost,
  negativeRankBoost
) {
  const textRankScores = textRankSentences(sentences);

  return textRankScores.map((details) => {
    const sentimentScore = vader.SentimentIntensityAnalyzer.polarity_scores(
      details.sentence
    ).compound;

    const sentimentRankAdjustment = getSentimentRankAdjustment(
      sentimentScore,
      positiveSentimentThreshold,
      negativeSentimentThreshold,
      positiveRankBoost,
      negativeRankBoost
    );

    return {
      ...details,
      sentiment: sentimentScore,
      rank: calculateAdjustedRank(details.rank, sentimentRankAdjustment),
    };
  });
}

// Existing textRankSentences function from the previous code

module.exports = { sentimentSeq2SeqSummary };
