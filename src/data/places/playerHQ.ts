import type { AdventureNode } from "../adventureTypes";

export const playerHQ: Record<string, AdventureNode> = {
  intro: {
    id: "intro",
    text: "Det här är din lilla stuga: ett enda rum, men mysigt och utrustat med allt du behöver. Här finns en spis, en säng och en låst kista.",
    choices: [
      {
        text: "Gå in",
        nextNodeId: "start",
        effects: [
          { type: "setStoryFlag", flag: "playerHQ.IntroSeen", value: true },
        ],
      },
    ],
  },

  start: {
    id: "start",
    text: "Du står i din stuga.",

    choices: [
      {
        text: "Gå till sängs.",
        nextNodeId: "inBed",
      },
      {
        text: "Undersök den låsta kistan",
        nextNodeId: "storageChest",
        condition: { type: "storyFlag", flag: "unlockedStorage", value: false },
      },
      {
        text: "Öppna kistan",
        condition: { type: "storyFlag", flag: "unlockedStorage", value: true },
        effects: [{ type: "openStorage" }],
      },
      {
        text: "Lämna stugan",
        effects: [
          {
            type: "endAdventure",
          },
        ],
      },
    ],
  },

  storageChest: {
    id: "storageChest",
    text: "Kistan är av trä, förstärkt med tjocka metallband. Den ser tung och säker ut, men låset håller den stängd. Du behöver hitta en nyckel.",
    choices: [
      {
        text: "Börja leta efter nyckeln",
        condition: {
          type: "storyFlag",
          flag: "openStorageQuest.Started",
          value: false,
        },
        nextNodeId: "start",
        effects: [
          {
            type: "setStoryFlag",
            flag: "openStorageQuest.Started",
            value: true,
          },
        ],
      },
      {
        text: "Använd nyckeln",
        condition: [
          {
            type: "storyFlag",
            flag: "openStorageQuest.Started",
            value: true,
          },
          { type: "hasItem", itemId: "storageKey" },
        ],
        nextNodeId: "start",
        effects: [
          { type: "removeItem", itemId: "storageKey" },
          { type: "setStoryFlag", flag: "unlockedStorage", value: true },
          { type: "openStorage" },
        ],
      },
      {
        text: "Tillbaka",
        nextNodeId: "start",
      },
    ],
  },

  inBed: {
    id: "inBed",
    text: "Du sparkar av dig stövlarna och tar av dig tillräckligt med kläder för att känna dig bekväm. Du sätter dig på sängen och känner genast skillnaden mot din sovrulle.",
    choices: [
      {
        text: "Vila en stund - Läka dina sår.",
        nextNodeId: "start",
        effects: [{ type: "fullHeal" }],
      },
      {
        text: "Tillbaka",
        nextNodeId: "start",
      },
    ],
  },
};
