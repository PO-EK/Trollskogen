import type { AdventureNode } from "../adventureTypes";

export const byHus: Record<string, AdventureNode> = {
  start: {
    id: "start",
    text: "Det finns inget att göra här ännu.",
    choices: [
      {
        text: "Lämna stugan.",
        effects: [{ type: "endAdventure" }],
      },
    ],
  },
};
