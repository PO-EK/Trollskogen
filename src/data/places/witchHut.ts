import type { AdventureNode } from "../adventureTypes";

export const witchHut: Record<string, AdventureNode> = {
  start: {
    id: "start",

    text: "Beskriv häxans hus",

    choices: [
      {
        text: "Knacka på",
        effects: [
          {
            type: "endAdventure",
          },
        ],
      },
      {
        text: "Återvänd till byn.",
        effects: [
          {
            type: "endAdventure",
          },
        ],
      },
    ],
  },
};
