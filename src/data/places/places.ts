import type { AdventureNode } from "../adventureTypes";
import { drop } from "../enemy";

export const places: Record<string, AdventureNode> = {
  start: {
    id: "start",

    text: "Du står framför den stora skogen.",
    choices: [
      {
        text: "Du ser en bandit - Attackera",
        nextNodeId: "attackBandit",
      },
      {
        text: "Du ser en varg - Attackera",
        nextNodeId: "attackWolf",
      },
      {
        text: "Du ser ett Troll - Attackera",
        nextNodeId: "attackTroll",
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
  attackBandit: {
    id: "attackBandit",
    text: "Du ser en man i rustning som rör sig mot dig. Du tror först att det är en rövare eller rånare men han beter sig konstigt, han drar med benet och verkar helt förvirrad. När du går närmare så ser du att hans skin verkar grönt, som om det ruttnat, och hans röda ögon är full av hat. Han höjer sitt vapen och attackerar dig.",

    choices: [
      {
        text: "Försvara dig!",
        effects: [
          {
            type: "startCombat",
            enemyId: "bandit",
            extraLoot: [drop("iron_sword")],
            winNodeId: "fightWon",
            loseNodeId: "fightLost",
          },
        ],
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
  attackTroll: {
    id: "attackTroll",
    text: "Ett stort troll dyker upp, han är ful och ser inte så smart ut. Dessutom luktar han inte så bra.",

    choices: [
      {
        text: "Försvara dig!",
        effects: [
          {
            type: "startCombat",
            enemyId: "troll",
            extraLoot: [drop("battle_axe")],
            winNodeId: "fightWon",
            loseNodeId: "fightLost",
          },
        ],
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

  fightWon: {
    id: "fightWon",
    text: "Fienden ligger slagen på marken. Du söker igenom hans saker.",
    choices: [{ text: "Fortsätt", nextNodeId: "start" }],
  },
  fightLost: {
    id: "fightLost",
    text: "Allt blir svart...",
    choices: [{ text: "Vakna", nextNodeId: "start" }],
  },

  attackWolf: {
    id: "attackWolf",
    text: "En stor svart varg försöker äta upp dig!",

    choices: [
      {
        text: "Försvara dig!",
        effects: [
          {
            type: "startCombat",
            enemyId: "wolf",
            extraLoot: [drop("health_potion")],
            winNodeId: "fightWon",
            loseNodeId: "fightLost",
          },
        ],
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
};
