import type { AdventureEncounter } from "../../adventureTypes";

export const boar: AdventureEncounter = {
  startNodeId: "boarStart",
  nodes: {
    boarStart: {
      id: "boarStart",
      text: "Marken längs stigen är uppbökad, med jord och rötter utspridda i högar. Något frustar bakom en grupp granar.",
      choices: [
        {
          text: "Titta efter.",
          nextNodeId: "boarCharge",
        },
        {
          text: "Vänd tillbaka.",
          effects: [{ type: "endAdventure" }],
        },
      ],
    },
    boarCharge: {
      id: "boarCharge",
      text: "Kvistar knäcks när en vildgalt stormar fram mellan träden med sänkt huvud.",
      choices: [
        {
          text: "Försvara dig!",
          effects: [
            {
              type: "startCombat",
              enemyId: "boar",
              extraLoot: [],
              winNodeId: "boarWon",
              loseNodeId: "boarLost",
            },
          ],
        },
      ],
    },
    boarWon: {
      id: "boarWon",
      text: "Galten sjunker ihop i ett snår av kvistar. Det blir tyst, bortsett från ditt eget andetag.",
      choices: [
        {
          text: "Återvänd till stigen.",
          effects: [{ type: "endAdventure" }],
        },
      ],
    },
    boarLost: {
      id: "boarLost",
      text: "Du kastar dig bakom en tjock trädstam, och galten rusar förbi. När ljudet har tystnat tar du dig tillbaka till stigen.",
      choices: [
        {
          text: "Fortsätt tillbaka.",
          effects: [{ type: "endAdventure" }],
        },
      ],
    },
  },
};
