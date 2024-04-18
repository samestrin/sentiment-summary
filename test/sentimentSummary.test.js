// Import the necessary class from 'natural'
const natural = require("natural");
const SentenceTokenizer = natural.SentenceTokenizer;

const {
  sentimentTextRankSummary,
  sentimentLexRankSummary,
} = require("../src/index.js");

// Create an instance of SentenceTokenizer
const tokenizer = new SentenceTokenizer();

const text = `Canine Companions: The Joys and Challenges of Dog Ownership
Dogs, often referred to as "man's best friend," have earned their place by our side for millennia. Their loyalty, playful nature, and companionship bring immense joy to countless homes. However, owning a dog is a significant commitment that shouldn't be taken lightly.  Between chewed furniture, barking complaints from neighbors, and the ever-present need for walks, there can be a fair share of challenges that come with sharing your life with a canine companion.
Despite the hurdles, the positive aspects of dog ownership far outweigh the difficulties. Studies have shown that dogs can reduce stress and anxiety, while promoting exercise and an active lifestyle. Their unconditional love and enthusiasm for life is truly infectious. Owning a dog can also foster a sense of responsibility and routine, especially for children.
The right breed selection can significantly impact your experience. High-energy breeds like Border Collies require ample stimulation and activity, while more laid-back breeds like Pugs are content with shorter walks and couch cuddles.  Researching different breeds and their needs is crucial for finding a furry friend that complements your lifestyle.
Ultimately, the decision to get a dog is a personal one. By carefully considering your lifestyle and weighing the potential drawbacks against the undeniable rewards, you can determine if a furry friend is the perfect addition to your life.`;

describe("sentimentTextRankSummary", () => {
  test("generates correct summary positive sentiment", () => {
    let summary = sentimentTextRankSummary(text, 5, 0.25, 0, 0.75, 0);
    console.log(summary);
    expect(summary).toContain(`In the end, GloRilla got arrested`);
  });

  test("generates correct number of sentences for positive sentiment", () => {
    let summary = sentimentTextRankSummary(text, 5, 0.25, 0, 0.75, 0);
    let sentences = tokenizer.tokenize(summary);
    expect(sentences).toHaveLength(5);
  });

  test("generates correct summary negative sentiment", () => {
    let summary = sentimentTextRankSummary(text, 5, 0, -0.25, 0, -0.75);
    console.log(summary);
    expect(summary).toContain(`suspicion of driving under the influence`);
  });

  test("generates correct number of sentences for negative sentiment", () => {
    let summary = sentimentTextRankSummary(text, 5, 0, -0.25, 0, -0.75);
    let sentences = tokenizer.tokenize(summary);
    expect(sentences).toHaveLength(5);
  });
});

describe("sentimentLexRankSummary", () => {
  test("generates correct summary positive sentiment", () => {
    let summary = sentimentLexRankSummary(text, 5, 0.25, 0, 0.75, 0);
    console.log(summary);
    expect(summary).toContain(
      `she apparently had a wardrobe malfunction while this all went down`
    );
  });

  test("generates correct number of sentences for positive sentiment", () => {
    let summary = sentimentLexRankSummary(text, 5, 0.25, 0, 0.75, 0);
    let sentences = tokenizer.tokenize(summary);
    expect(sentences).toHaveLength(5);
  });

  test("generates correct summary negative sentiment", () => {
    let summary = sentimentLexRankSummary(text, 5, 0, -0.25, 0, -0.75);
    console.log(summary);
    expect(summary).toContain(`suspicion of driving under the influence`);
  });

  test("generates correct number of sentences for negative sentiment", () => {
    let summary = sentimentLexRankSummary(text, 5, 0, -0.25, 0, -0.75);
    let sentences = tokenizer.tokenize(summary);
    expect(sentences).toHaveLength(5);
  });
});
