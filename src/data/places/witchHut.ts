import type { AdventureNode } from "../adventureTypes";

export const witchHut: Record<string, AdventureNode> = {
  start: {
    id: "start",

    text: "Häxans hus, beskriv det",

    choices: [
      {
        text: "Knacka på",
        effects: [
          {
            type: "endAdventure",
          },
        ],
      },
    ],
  },
};
