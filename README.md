The sentiment-summary module generates summaries from larger bodies of text taking sentence level sentiment into consideration.

```javascript
const { sentimentSummary } = require("sentiment-summary");

let text = `
Toronto gold heist: Police arrest alleged gun-runner linked to C$20m airport theft

Canadian police have made arrests and issued nine warrants in the largest gold theft in the country's history.

More than 6,500 gold bars worth C$20m ($14.5m/£11.6m), were stolen from Toronto Pearson Airport, in April 2023, along with millions in cash.

The alleged driver was arrested in the US carrying dozens of guns that police say were intended for use in Canada.

Police said the "Netflix-series"-style heist was executed by a "well-organised group of criminals".

The investigation is ongoing.

The announcement on Wednesday by the Canadian Peel Regional Police and the US Alcohol, Tobacco and Firearms Bureau came exactly one year after the massive gold heist, reportedly the sixth largest in the world.

The year-long joint investigation was code-named Project 24K. It has included dozens of search warrants and interviews.

So far, police have recovered C$90,000 of "pure gold", fashioned into six "crudely made" bracelets. They also seized smelting pots, casts and moulds, as well as C$430,000 in cash that police said were the profits of gold sales.

In September, Pennsylvania police arrested an Ontario man illegally in the US, who they allege to be the gang's driver, police said.

The man, named by police as Durante King-McClean, 25, was stopped in Philadelphia for a traffic violation, and firearms were discovered in his car.

"One of those firearms had an obliterated serial number, 11 of them were stolen, and two of them were converted into fully automatic machine guns," said Eric Degree, a special agent of the ATF in Philadelphia.

According to police, those guns were "intended for import into Canada". "This isn't just about a gold heist, this is about how gold becomes guns," said Nando Iannicca, chair of the Peel Police Services Board.

Police said the guns seized in the US were a "dotted line" to people's wellbeing in Canada.

The man remains in custody in the US on firearms trafficking charges.

Five other suspects, two of whom were employees of the airline carrying the goods, were arrested and bailed to appear at court at a later date.

Three arrest warrants have been issued for others in Canada.

The 17 April 2023 heist happened inside a cargo facility, after the goods arrived on an Air Canada flight from Zurich, Switzerland.

Police allege that an unidentified person was able to access the goods by showing a fake airway bill - a document that accompanies shipped items.

A five-tonne lorry was then used to steal the gold, weighing roughly 400kg (881lb), police said.

Months after the theft, Brink's International, a US-based security company due to coordinate the shipment of the goods, sued Air Canada.

Brink's alleged that the airline had been "reckless" and had failed to prevent the theft, making no attempt to verify the identity of the person who "absconded with the cargo".

According to the lawsuit, the goods were stolen 42 minutes after being unloaded from the plane.

"No security protocols or features were in place to monitor, restrict or otherwise regulate the unidentified individual's access to the facilities," Brink's claimed.

Air Canada has denied "each and every allegation" made by Brink's, rejecting any accusations of "careless" conduct. The airport has claimed the thieves "accessed the public side of a warehouse that is leased to a third party, outside of our primary security line".

Brink's is suing for damages liability, and has asked that the value of the goods stolen be paid back by the airline in full.

The five suspects who were arrested and released are Parmpal Sidhu, 54, Amit Jalota, 40, Ammad Chaudhary, 43, Ali Raza, 37, and Prasath Paramalingam, 35.

Canada-wide arrests warrants were issued for Simran Preet Panesar, 31, Archit Grover, 36, and Arsalan Chaudhary, 42, who are still at large.
`;

let numberOfSentences = 5;
let sentimentThreshold = 0.5;
let rankBoost = 2;

let summary = sentimentSummary(
  text,
  numberOfSentences,
  sentimentThreshold,
  rankBoost
);
```
