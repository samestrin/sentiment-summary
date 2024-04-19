/**
 * Validates input parameters for text summarization functions, throwing errors for invalid input.
 *
 * @param {string} text - The input text for summarization.
 * @param {number} numberOfSentences - The desired number of sentences in the summary.
 * @param {number} positiveSentimentThreshold - The threshold for considering a sentiment as positive.
 * @param {number} negativeSentimentThreshold - The threshold for considering a sentiment as negative.
 * @param {number} positiveRankBoost - Multiplier for boosting the rank of positive sentences.
 * @param {number} negativeRankBoost - Multiplier for boosting the rank of negative sentences.
 * @param {number} [lambda=false] - An optional parameter.
 * @throws {Error} If any of the input parameters are invalid.
 *
 * @example
 *
 * manageErrors("This is a sample text", 3, 0.2, -0.1, 1.5, 1.2);
 */

function manageErrors(
  text,
  numberOfSentences,
  positiveSentimentThreshold,
  negativeSentimentThreshold,
  positiveRankBoost,
  negativeRankBoost,
  lambda = false
) {
  if (typeof text !== "string" || text.trim() === "") {
    throw new Error("Invalid or empty text input");
  }

  if (typeof numberOfSentences !== "number" || !numberOfSentences) {
    throw new Error("Invalid numberOfSentences (Not a number or zero)");
  }

  if (
    typeof numberOfSentences !== "number" ||
    positiveSentimentThreshold > 1 ||
    positiveSentimentThreshold < -1
  ) {
    throw new Error(
      "Invalid positiveSentimentThreshold (Not a number or outside of range)"
    );
  }

  if (
    typeof numberOfSentences !== "number" ||
    negativeSentimentThreshold > 1 ||
    negativeSentimentThreshold < -1
  ) {
    throw new Error(
      "Invalid negativeSentimentThreshold (Not a number or outside of range)"
    );
  }

  if (
    typeof numberOfSentences !== "number" ||
    positiveRankBoost > 1 ||
    positiveRankBoost < -1
  ) {
    throw new Error(
      "Invalid positiveRankBoost (Not a number or outside of range)"
    );
  }

  if (
    typeof negativeRankBoost !== "number" ||
    negativeRankBoost > 1 ||
    negativeRankBoost < -1
  ) {
    throw new Error(
      "Invalid negativeRankBoost (Not a number or outside of range)"
    );
  }
  if (lambda && typeof lambda !== "number") {
    throw new Error("Invalid lambda (Not a number)");
  }
}
module.exports = { manageErrors };
