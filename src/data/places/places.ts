import type { AdventureNode } from "../adventureTypes";
import { drop } from "../enemy";

export const places: Record<string, AdventureNode> = {
  start: {
    id: "start",

    text: "Du står framför den stora skogen.",
    choices: [
      {
        text: "Följ vägen",
        nextNodeId: "attack",
      },
      {
        text: "Gå in i skogen",
        nextNodeId: "attack",
      },
      {
        text: "Ge upp och gå hem!",

        effects: [
          {
            type: "endAdventure",
          },
        ],
      },
    ],
  },
  attack: {
    id: "attack",
    text: "Du ser en man i rustning som rör sig mot dig. Du tror först att det är en rövare eller rånare men han beter sig konstigt, han drar med benet och verkar helt förvirrad. När du går närmare så ser du att hans skin verkar grönt, som om det ruttnat, och hans röda ögon är full av hat. Han höjer sitt vapen och attackerar dig.",

    choices: [
      {
        text: "Försvara dig!",
        effects: [
          {
            type: "startCombat",
            enemyId: "bandit",
            extraLoot: [drop("health_potion")],
            winNodeId: "fightWon",
            loseNodeId: "fightLost",
          },
        ],
      },
    ],
  },
  fightWon: {
    id: "fightWon",
    text: "Rövaren ligger slagen på marken. Du söker igenom hans saker.",
    choices: [{ text: "Fortsätt", nextNodeId: "start" }],
  },
  fightLost: {
    id: "fightLost",
    text: "Allt blir svart...",
    choices: [{ text: "Vakna", nextNodeId: "start" }],
  },
};
