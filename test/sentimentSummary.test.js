const { sentimentSummary } = require("../src/index");

describe("sentimentSummary", () => {
  test("generates correct summary", () => {
    const text = `Toronto gold heist: Police arrest alleged gun-runner linked to C$20m airport theft

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

`;

    let summary = sentimentSummary(text, 5, 1.5, 1, 5, 0);
    expect(summary).toContain(
      `Canadian police have made arrests and issued nine warrants in the largest gold theft in the country's history.`
    );

    summary = sentimentSummary(text, 5, 1, 0.25, 0, 5);
    expect(summary).toContain(
      `They also seized smelting pots, casts and moulds, as well as C$430,000 in cash that police said were the profits of gold sales.`
    );
  });
});
