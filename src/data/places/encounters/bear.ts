import type { AdventureEncounter } from "../../adventureTypes";

export const bear: AdventureEncounter = {
  startNodeId: "bearStart",
  nodes: {
    bearStart: {
      id: "bearStart",
      text: "Barken på en tall är fläkt i långa strimmor, och sav rinner ur såren. Ett djupt brummande hörs bortom träden.",
      choices: [
        {
          text: "Följ ljudet.",
          nextNodeId: "bearRises",
        },
        {
          text: "Vänd tillbaka.",
          effects: [{ type: "endAdventure" }],
        },
      ],
    },
    bearRises: {
      id: "bearRises",
      text: "En trollbjörn reser sig på bakbenen mellan träden och ryter så att det ekar.",
      choices: [
        {
          text: "Försvara dig!",
          effects: [
            {
              type: "startCombat",
              enemyId: "bear",
              extraLoot: [],
              winNodeId: "bearWon",
              loseNodeId: "bearLost",
            },
          ],
        },
      ],
    },
    bearWon: {
      id: "bearWon",
      text: "Björnen sjunker ihop med ett sista, dovt rytande. Skogen är tyst igen.",
      choices: [
        {
          text: "Återvänd till stigen.",
          effects: [{ type: "endAdventure" }],
        },
      ],
    },
    bearLost: {
      id: "bearLost",
      text: "Du rullar undan och reser dig, och tar dig bort genom snåren tills ryten bleknar bakom dig.",
      choices: [
        {
          text: "Fortsätt tillbaka.",
          effects: [{ type: "endAdventure" }],
        },
      ],
    },
  },
};
