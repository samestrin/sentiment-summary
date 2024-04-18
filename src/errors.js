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
