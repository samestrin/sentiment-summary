# Sentiment Summary

The sentiment-summary module generates summaries from larger bodies of text taking sentence level sentiment into consideration. A modified TextRank algorithm is used.

## Installation

```bash
npm install sentiment-summary
```

## Usage

```javascript
const { sentimentSummary } = require("sentiment-summary");

let text = `Toronto gold heist: Police arrest alleged gun-runner linked to C$20m airport theft

Canadian police have made arrests and issued nine warrants in the largest gold theft in the country's history.

More than 6,500 gold bars worth C$20m ($14.5m/£11.6m), were stolen from Toronto Pearson Airport, in April 2023, along with millions in cash.

The alleged driver was arrested in the US carrying dozens of guns that police say were intended for use in Canada.

Police said the "Netflix-series"-style heist was executed by a "well-organised group of criminals".

The investigation is ongoing.`;

let numberOfSentences = 5;
let positiveSentimentThreshold = 1;
let negativeSentimentThreshold = -1;
let positiveRankBoost = 2;
let negativeRankBoost = 1;

let summary = sentimentSummary(
  text,
  numberOfSentences,
  positiveSentimentThreshold,
  negativeSentimentThreshold,
  positiveRankBoost,
  negativeRankBoost
);

console.log(summary);
```
