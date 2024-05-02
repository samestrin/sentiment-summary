# Sentiment Summary

[![Star on GitHub](https://img.shields.io/github/stars/samestrin/sentiment-summary?style=social)](https://github.com/samestrin/sentiment-summary/stargazers) [![Fork on GitHub](https://img.shields.io/github/forks/samestrin/sentiment-summary?style=social)](https://github.com/samestrin/sentiment-summary/network/members) [![Watch on GitHub](https://img.shields.io/github/watchers/samestrin/sentiment-summary?style=social)](https://github.com/samestrin/sentiment-summary/watchers)

![Version 0.0.1](https://img.shields.io/badge/Version-0.0.1-blue) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![Built with Node.js](https://img.shields.io/badge/Built%20with-Node.js-green)](https://nodejs.org/)

The **sentiment-summary** npm module generates text summaries that are weighted by the sentiment expressed in individual sentences. It analyzes the sentiment of each sentence within a larger body of text and emphasizes or deemphasizes sentences based on their sentiment scores during the summarization process.

This module supports:

- Seven different summarization algorithms: **Extractive Text, Extractive Text Title Weighted, Latent Semantic Analysis (LSA), Maximum Marginal Relevance (MMR), TextRank, and TextRank with Word Embeddings**.
- Six different sentiment analysis engines: **Hugging-Face, Natural, Sentiment (AFINN-165 based), sentiment-analysis (AFINN-111 based), VADER, and wink-sentiment**.

_sentiment-summary is under active development._

[https://github.com/samestrin/sentiment-summary](https://github.com/samestrin/sentiment-summary)

### Summarization Algorithms Supported:

#### Extractive Text:

This method ranks sentences based on the frequency of keywords or phrases they contain. Sentences with more frequent words or phrases are considered more important and included in the summary. It is a simple and efficient approach but may not capture semantic relationships or context as well as other techniques.

#### Extractive Text Summarization Title Weighted:

This method ranks sentences based on two factors: the frequency of keywords or phrases they contain, and the presence of words from the document's "title" section. The "title" is defined as the first few sentences (1% of the total, up to a maximum of 3 sentences) in the input text. Words from these title sentences are considered more important and given additional weight when scoring each sentence. Sentences containing more frequent keywords or phrases, as well as words from the title section, are considered more important and included in the summary. While efficient, this approach may not fully capture semantic relationships or context as effectively as more advanced techniques.

#### Latent Semantic Analysis (LSA):

LSA is a technique that analyzes the relationships between a set of documents and the terms they contain. It constructs a semantic space where documents and terms are represented as vectors. In the context of text summarization, LSA can identify the most important sentences or passages that capture the core meaning and topics of the original text. It achieves this by finding the sentences with the highest semantic similarity to the overall document vector.

#### LexRank:

LexRank is a graph-based summarization method inspired by the PageRank algorithm used in web search engines. It constructs a graph representation of the text, where vertices represent sentences, and edges represent semantic similarity between sentences. The algorithm then computes a centrality score for each sentence, indicating its importance within the text. Highly scored sentences are selected to form the summary, capturing the most salient information.

#### Maximum Marginal Relevance (MMR):

MMR is a technique that aims to produce summaries that are both relevant to the original text and diverse in content. It iteratively selects sentences that have high relevance to the document but minimal redundancy with sentences already included in the summary. MMR strikes a balance between relevance and diversity, resulting in summaries that cover the main topics while minimizing repetition.

#### TextRank:

TextRank is another graph-based summarization method similar to LexRank. However, instead of using semantic similarity between sentences, TextRank uses co-occurrence relationships between words or phrases to construct the graph. Vertices represent words or phrases, and edges represent co-occurrence links between them. The algorithm computes a centrality score for each word or phrase, and sentences containing the highest-ranked words or phrases are selected for the summary.

#### TextRank with Word Embeddings:

This approach combines the TextRank algorithm with word embeddings, which are dense vector representations of words that capture semantic and syntactic information. Instead of using co-occurrence relationships between words, this method computes sentence similarity using word embeddings. Sentences are represented as vectors by averaging or combining the word embeddings of their constituent words. The TextRank algorithm then operates on these sentence vectors to identify the most important sentences for the summary.

## Installation

```bash
npm install sentiment-summary
```

## Usage

@todo pending major update

### Hugging Face Support

This module comes pre-configured with 24 Hugging Face models that can be used with the Hugging Face sentiment analysis engine. They are grouped into 6 categories:

- Finance (8 models)
- General (7 models)
- Movies (1 Model)
- News (3 Models)
- Product Reviews (4 Models)
- Restaurant Reviews (1 Models)

You can easily load any of these modules using their alias _name_ value. To access a list of models:

```javascript
const { getModels } = require("sentiment-summary");

models = getModels();
console.log(models);
```

If you'd prefer to use a custom model, you can use the global configuration object or the options object argument and set:

```javascript
const { setup } = require("sentiment-summary");

setup({
  sentimentEngine: "hugging-face",
  sentimentEngineModel: yourDesiredModel,
});

async function main() {
  let summary = async sentimentSummary(text)
}

main();

```

or

```javascript
const { sentimentSummary } = require("sentiment-summary");

async function main() {
  let summary = async sentimentSummary(text,
  {
    sentimentEngine: "hugging-face",
    sentimentEngineModel: yourDesiredModel,
  });
}

main();
```

## Documentation

[https://sentiment-summary-documentation.netlify.app/](https://sentiment-summary-documentation.netlify.app/)

## Contribute

Contributions to this project are welcome. Please fork the repository and submit a pull request with your changes or improvements.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Share

[![Twitter](https://img.shields.io/badge/X-Tweet-blue)](https://twitter.com/intent/tweet?text=Check%20out%20this%20awesome%20project!&url=https://github.com/samestrin/sentiment-summary) [![Facebook](https://img.shields.io/badge/Facebook-Share-blue)](https://www.facebook.com/sharer/sharer.php?u=https://github.com/samestrin/sentiment-summary) [![LinkedIn](https://img.shields.io/badge/LinkedIn-Share-blue)](https://www.linkedin.com/sharing/share-offsite/?url=https://github.com/samestrin/sentiment-summary)
