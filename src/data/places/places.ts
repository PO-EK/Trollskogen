import type { AdventureNode } from "../adventureTypes";
import { drop } from "../enemy";

export const places: Record<string, AdventureNode> = {
  start: {
    id: "start",

    text: "Du står framför den stora skogen. Vad vill du slåss emot?",
    choices: [
      {
        text: "Du ser en varg - Lätt",
        nextNodeId: "attackWolf",
      },
      {
        text: "Du ser en bandit - Medium",
        nextNodeId: "attackBandit",
      },

      {
        text: "Du ser Legoknäkt - Svår",
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
  attackTroll: {
    id: "attackTroll",
    text: "Ett stort troll dyker upp, han är ful och ser inte så smart ut. Han luktar inte så bra, heller.",

    choices: [
      {
        text: "Försvara dig!",
        effects: [
          {
            type: "startCombat",
            enemyId: "mercenary",
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
    text: "Fienden ligger slagen på marken. Dags att loota!.",
    choices: [{ text: "Fortsätt", nextNodeId: "start" }],
  },
  fightLost: {
    id: "fightLost",
    text: "Allt blir svart...",
    choices: [{ text: "Någon räddar dig", nextNodeId: "start" }],
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
            extraLoot: [drop("cloth")],
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
