import type { AdventureNode } from "../adventureTypes";

export const witchHut: Record<string, AdventureNode> = {
  start: {
    id: "start",

    text: "Den gamla häxan jobbar över sin kokande gryta, men har svårt att röra på sig ser ut att ha ont i kroppen.",

    choices: [
      {
        text: "Behöver du hjälp?",
        nextNodeId: "healTheWitchStart",
        condition: {
          type: "storyFlag",
          flag: "healTheWitch.Complete",
          value: false,
        },
      },
      {
        text: "Lär mig magi, tack.",
        nextNodeId: "learnMagic",
      },
      {
        text: "Hej då.",
        effects: [
          {
            type: "endAdventure",
          },
        ],
      },
    ],
  },

  healTheWitchStart: {
    id: "healTheWitchStart",

    text: "Jag har ganska ont, kan du ge mig en Läkande Dryck? Jag har inte tid att blanda en själv just nu.",

    choices: [
      {
        text: "Ja, jag har en.",
        nextNodeId: "healWitch",
        condition: {
          type: "hasItem",
          itemId: "health_potion",
        },
        effects: [
          {
            type: "openQuestContainer",
            questId: "healTheWitch",
            acceptedItemId: "health_potion",
          },
        ],
      },
      {
        text: "Nej, men jag ska leta efter en.",
        nextNodeId: "start",
      },
    ],
  },

  healWitch: {
    id: "healWitch",
    text: "Hon håller ut handen. 'Jag kan ge dig 80 kroner som belöning'",
    choices: [
      {
        text: "Behåll pengarna, jag söker kunskap.",
        nextNodeId: "start",
        condition: {
          type: "storyFlag",
          flag: "healTheWitch.Delivered",
          value: true,
        },
        effects: [
          {
            type: "setStoryFlag",
            flag: "healTheWitch.Complete",
            value: true,
          },
        ],
      },
      {
        text: "Här, ge mig pengar!",
        nextNodeId: "start",
        condition: {
          type: "storyFlag",
          flag: "healTheWitch.Delivered",
          value: true,
        },
        effects: [
          {
            type: "addGold",
            amount: 80,
          },
          {
            type: "setStoryFlag",
            flag: "healTheWitch.Complete",
            value: true,
          },
        ],
      },

      {
        text: "Tyvärr, jag behöver den.",
        nextNodeId: "start",
        condition: {
          type: "storyFlag",
          flag: "healTheWitch.Delivered",
          value: false,
        },
      },
    ],
  },

  learnMagic: {
    id: "learnMagic",
    text: "'Åh? Okej. Nu kan du trolla!' Säger hon och knäpper med fingrarna.",
    choices: [
      {
        text: "Wow, tack! Nu går jag och trollar bort mina fiender.",
        effects: [
          {
            type: "endAdventure",
          },
        ],
      },
    ],
  },
};
