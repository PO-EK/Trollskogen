import type { AdventureEncounter } from "../../adventureTypes";

export const ambusher: AdventureEncounter = {
  startNodeId: "ambusherStart",
  nodes: {
    ambusherStart: {
      id: "ambusherStart",
      text: "Det är för tyst. Inga fåglar, inget prassel i lövverket. Någonstans bakom dig knäcks en kvist.",
      choices: [
        {
          text: "Vänd dig om.",
          nextNodeId: "ambusherStrike",
        },
        {
          text: "Skynda dig tillbaka.",
          effects: [{ type: "endAdventure" }],
        },
      ],
    },
    ambusherStrike: {
      id: "ambusherStrike",
      text: "En spejare glider ut ur skuggan bakom en trädstam med kniven redan i handen. Han ler snett. 'Du såg mig.'",
      choices: [
        {
          text: "Försvara dig!",
          effects: [
            {
              type: "startCombat",
              enemyId: "ambusher",
              extraLoot: [],
              winNodeId: "ambusherWon",
              loseNodeId: "ambusherLost",
            },
          ],
        },
      ],
    },
    ambusherWon: {
      id: "ambusherWon",
      text: "Spejaren sjunker ihop vid roten av trädet. Du lyssnar, men inget mer rör sig runt dig.",
      choices: [
        {
          text: "Återvänd till stigen.",
          effects: [{ type: "endAdventure" }],
        },
      ],
    },
    ambusherLost: {
      id: "ambusherLost",
      text: "Kniven glider förbi, och du slänger dig åt sidan och springer. Du hör inga steg bakom dig förrän du är tillbaka på stigen.",
      choices: [
        {
          text: "Fortsätt tillbaka.",
          effects: [{ type: "endAdventure" }],
        },
      ],
    },
  },
};
