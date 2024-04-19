// Import the necessary class from 'natural'
const natural = require("natural");
const SentenceTokenizer = natural.SentenceTokenizer;

const {
  sentimentTextRankSummary,
  sentimentLexRankSummary,
  sentimentExtractiveSummary,
  sentimentLSASummary,
  sentimentMMRSummary,
  sentimentSeq2SeqSummary,
} = require("../src/index.js");

// Create an instance of SentenceTokenizer
const tokenizer = new SentenceTokenizer();

const text = `Dogs, loyal companions for thousands of years, bring endless joy. Wagging tails and happy barks brighten even the gloomiest day. Their unconditional love mends hearts and fills lives with laughter. Playful antics and a comforting presence enrich our lives in unimaginable ways. Walks with our furry friends become adventures, introducing us to new people and fostering a strong sense of community.
Some folks might tell you dog ownership is a nightmare. Puppy piranhas chew furniture and shoes with relentless glee, leaving you questioning your sanity. Rude awakenings become the norm as your furry alarm clock nudges you for a pre-dawn bathroom break. Rain or shine, walks transform you into an all-weather poop patrol officer. The financial burden is real, with food, vet bills, and training costs adding up fast. Traveling gets complicated, requiring pet-friendly accommodations and potentially expensive doggy daycare. Dog ownership is a lifestyle shift, demanding significant time, energy, and resources.
Despite the challenges, the rewards outweigh the struggles. Studies show dogs reduce stress and anxiety, while promoting exercise and a healthy lifestyle. Their infectious enthusiasm for life and unwavering love are truly special. Raising a dog teaches responsibility and creates a sense of routine, especially for children.
Choosing the right breed makes all the difference. High-energy Border Collies need constant stimulation and activity, while laid-back Pugs are happy with short walks and couch cuddles. Researching different breeds and their needs is crucial for finding a perfect furry friend that complements your lifestyle.
Ultimately, getting a dog is a personal decision. By carefully considering your lifestyle and weighing the drawbacks against the undeniable rewards, you can determine if a furry friend is the perfect addition to your life.`;

describe("sentimentExtractiveSummary", () => {
  test("generates correct summary positive sentiment", () => {
    let summary = sentimentExtractiveSummary(text, 5, 0.5, 0, 0.9, 0);
    expect(summary).toContain(
      `Their unconditional love mends hearts and fills lives with laughter.`
    );
  });

  test("generates correct number of sentences for positive sentiment", () => {
    let summary = sentimentExtractiveSummary(text, 5, 0.5, 0, 0.9, 0);
    let sentences = tokenizer.tokenize(summary);
    expect(sentences).toHaveLength(5);
  });

  test("generates correct summary negative sentiment", () => {
    let summary = sentimentExtractiveSummary(text, 5, 0.5, -1, -1, 1);
    expect(summary).toContain(
      `Some folks might tell you dog ownership is a nightmare.`
    );
  });

  test("generates correct number of sentences for negative sentiment", () => {
    let summary = sentimentExtractiveSummary(text, 5, 0.5, -1, -1, 1);
    let sentences = tokenizer.tokenize(summary);
    expect(sentences).toHaveLength(5);
  });
});

describe("sentimentLSASummary", () => {
  test("generates correct summary positive sentiment", () => {
    let summary = sentimentLSASummary(text, 5, 0.5, 0, 0.9, 0);
    expect(summary).toContain(
      `Their unconditional love mends hearts and fills lives with laughter.`
    );
  });

  test("generates correct number of sentences for positive sentiment", () => {
    let summary = sentimentLSASummary(text, 5, 0.5, 0, 0.9, 0);
    let sentences = tokenizer.tokenize(summary);
    expect(sentences).toHaveLength(5);
  });

  test("generates correct summary negative sentiment", () => {
    let summary = sentimentLSASummary(text, 5, 0.5, -1, -1, 1);
    expect(summary).toContain(
      `Some folks might tell you dog ownership is a nightmare.`
    );
  });

  test("generates correct number of sentences for negative sentiment", () => {
    let summary = sentimentLSASummary(text, 5, 0.5, -1, -1, 1);
    let sentences = tokenizer.tokenize(summary);
    expect(sentences).toHaveLength(5);
  });
});

describe("sentimentLexRankSummary", () => {
  test("generates correct summary positive sentiment", () => {
    let summary = sentimentLexRankSummary(text, 5, 0.5, 0, 0.9, 0);
    expect(summary).toContain(
      `Their unconditional love mends hearts and fills lives with laughter.`
    );
  });

  test("generates correct number of sentences for positive sentiment", () => {
    let summary = sentimentLexRankSummary(text, 5, 0.5, 0, 0.9, 0);
    let sentences = tokenizer.tokenize(summary);
    expect(sentences).toHaveLength(5);
  });

  test("generates correct summary negative sentiment", () => {
    let summary = sentimentLexRankSummary(text, 5, 0.5, -1, -1, 1);
    expect(summary).toContain(
      `Some folks might tell you dog ownership is a nightmare.`
    );
  });

  test("generates correct number of sentences for negative sentiment", () => {
    let summary = sentimentLexRankSummary(text, 5, 0.5, -1, -1, 1);
    let sentences = tokenizer.tokenize(summary);
    expect(sentences).toHaveLength(5);
  });
});

describe("sentimentMMRSummary", () => {
  test("generates correct summary positive sentiment", () => {
    let summary = sentimentMMRSummary(text, 5, 0.5, 0.75, 0, 1, 0);
    expect(summary).toContain(
      `Their unconditional love mends hearts and fills lives with laughter.`
    );
  });

  test("generates correct number of sentences for positive sentiment", () => {
    let summary = sentimentMMRSummary(text, 5, 0.5, 0.5, 0, 0.9, 0);
    let sentences = tokenizer.tokenize(summary);
    expect(sentences).toHaveLength(5);
  });

  test("generates correct summary negative sentiment", () => {
    let summary = sentimentMMRSummary(text, 5, 0.5, 0.5, -1, -1, 1);
    expect(summary).toContain(
      `Rude awakenings become the norm as your furry alarm clock nudges you for a pre-dawn bathroom break.`
    );
  });

  test("generates correct number of sentences for negative sentiment", () => {
    let summary = sentimentMMRSummary(text, 5, 0.5, 0.5, -1, -1, 1);
    let sentences = tokenizer.tokenize(summary);
    expect(sentences).toHaveLength(5);
  });
});

/*
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


*/
