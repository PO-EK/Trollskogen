import type { AdventureNode } from "../adventureTypes";
import { drop } from "../enemy";

export const places: Record<string, AdventureNode> = {
  start: {
    id: "start",

    text: "Du står framför den stora skogen. Vad vill du slåss emot?",
    choices: [
      {
        text: "En varg - Lätt",
        nextNodeId: "attackWolf",
      },
      {
        text: "En bandit - Medium",
        nextNodeId: "attackBandit",
      },

      {
        text: "En Legoknäkt - Svår",
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
    text: "En man i klädd i läder och bälten hoppar ut framför dig och höjer sin yxa. 'Ge mig ditt guld så dödar jag dig!' ropar han hotfullt.",

    choices: [
      {
        text: "Menar du inte 'ELLER så dödar jag dig'?",
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
        text: "Titta bakom dig! (Spring iväg)",

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
    text: "Ett soldat i rustning dyker upp, han är ful och ser inte så smart ut. Han luktar inte så bra, heller.",

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
