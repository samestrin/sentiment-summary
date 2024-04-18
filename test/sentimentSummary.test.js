// Import the necessary class from 'natural'
const natural = require("natural");
const SentenceTokenizer = natural.SentenceTokenizer;

const {
  sentimentTextRankSummary,
  sentimentLexRankSummary,
} = require("../src/index.js");

// Create an instance of SentenceTokenizer
const tokenizer = new SentenceTokenizer();

const text = `GloRilla found herself in a jail cell this week after cops busted her for DUI -- and she apparently had a wardrobe malfunction while this all went down ... TMZ has learned.

According to a police report, obtained by TMZ, the rapper was arrested and booked early Tuesday morning on suspicion of driving under the influence, consuming/possessing an open alcoholic beverage container and a separate traffic charge in Gwinnett County, GA.

She was hauled into jail around 6:12 AM ET and bonded out a few hours later. Her booking info, obtained by TMZ, notes that one of her aliases is Hallelujah ... which is her legal middle name.

As for what exactly happened here -- cops say they saw a vehicle making a U-turn at a solid red traffic light around 4 AM ET, so they pulled the vehicle over to see what was what.

The officer who took the report claims he smelled marijuana and alcohol emanating from the car, and claims GloRilla told him she'd been drinking that evening ... but, he explains she wouldn't say how much she'd consumed, and insisted she was good to drive.

The police say they then administered a field sobriety test -- which they claim GloRilla was shaky on, especially staying on her feet. They put her through the wringer, it seems -- making her do the eye-follow test, the walk-and-turn, one-leg balance, walk-in-a-straight-line, etc.    

On just about all of them ... the cops claim she bombed. Finally, they got to the breathalyzer ... which the police claim she refused to submit to. During this whole back and forth, the cop says GloRilla's breast slipped out from under her clothes -- which he had to tell her about.

In the end, GloRilla got arrested -- and cops say an associate came to pick up her vehicle.    

What's interesting is that GloRilla herself hasn't shown any indication she ran into legal trouble. Her IG is full of people twerking their asses to her and Megan Thee Stallion's new 'Wanna Be' song. So, business as usual in other words.

We've reached out to GloRilla ... so far, no word back.`;

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
