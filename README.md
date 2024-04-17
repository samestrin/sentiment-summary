The sentiment-summary module generates summaries from larger bodies of text taking sentence level sentiment into consideration.

```javascript
const { sentimentSummary } = require("sentiment-summary");

let summary = sentimentSummary(
  text,
  numberOfSentences,
  sentimentThreshold,
  rankBoost
);
```
