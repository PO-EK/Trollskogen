import type { AdventureNode } from "../adventureTypes";

export const banditCamp: Record<string, AdventureNode> = Object.assign({
  start: {
    id: "start",
    text: "Ett läger fullt av banditer.",
    choices: [
      {
        text: "Smyg runt och attackera enskilda rövare.",
        effects: [
          {
            type: "startCombat",
            enemyId: "bandit",
            extraLoot: [],
            winNodeId: "fightWon",
            loseNodeId: "fightLost",
          },
        ],
      },
      {
        text: "Attackera deras spejare.",
        effects: [
          {
            type: "startCombat",
            enemyId: "ambusher",
            extraLoot: [],
            winNodeId: "fightWon",
            loseNodeId: "fightLost",
          },
        ],
      },
      {
        text: "Utmana den starkaste till strid.",
        effects: [
          {
            type: "startCombat",
            enemyId: "mercenary",
            extraLoot: [],
            winNodeId: "fightWon",
            loseNodeId: "fightLost",
          },
        ],
      },
      {
        text: "Lämna lägret.",
        effects: [{ type: "endAdventure" }],
      },
    ],
  },
  fightWon: {
    id: "fightWon",
    text: "Dina fiende ligger besegrad, du har vunnit.",
    choices: [
      { text: "Fortsätt slåss", nextNodeId: "start" },
      {
        text: "Fly ut i skogen.",
        effects: [
          {
            type: "endAdventure",
          },
        ],
      },
    ],
  },
  fightLost: {
    id: "fightLost",
    text: "Allt blir svart...",
    choices: [
      {
        text: "Någon räddar dig...",
        effects: [
          {
            type: "endAdventure",
          },
        ],
      },
    ],
  },
});
