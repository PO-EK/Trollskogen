import type { AdventureNode } from "../adventureTypes";

export const playerHQ: Record<string, AdventureNode> = {
  intro: {
    id: "intro",
    text: "Det här är din lilla stuga, tydligen så försvann ägarna. De försökte fly mot stora staden. Ingen vet om de lyckades, men du kan nu använda deras hus.",
    choices: [
      {
        text: "Gå in",
        nextNodeId: "start",
        effects: [
          {
            type: "setStoryFlag",
            flag: "playerHQ.IntroSeen",
            value: true,
          },
        ],
      },
    ],
  },

  start: {
    id: "start",
    text: "Dörren knirrar när du går in och du stänger den noga bakom dig. Ditt hem är enkelt: ett enda rum, men mysigt och utrustat med allt du behöver. Här finns en spis, en säng och en stor kista.",

    choices: [
      {
        text: "Gå till sängs.",
        nextNodeId: "inBed",
      },
      {
        text: "Undersök kistan",
        nextNodeId: "lockedStorageChest",
        condition: { type: "storyFlag", flag: "unlockedStorage", value: false },
      },
      {
        text: "Öppna kistan",
        nextNodeId: "storageChest",
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
    text: "Kistan är av trä, förstärkt med tjocka metallband. Den ser tung och säker ut.",
    choices: [
      {
        text: "Tillbaka",
        nextNodeId: "start",
      },
    ],
  },

  lockedStorageChest: {
    id: "lockedStorageChest",
    text: "Kistan är av trä, förstärkt med tjocka metallband. Den ser tung och säker ut. \n\nDu provar att öppna den men den är låst. Du funderar på att bryta upp den men inser att kistan kan vara till använding om du hittar nyckeln.",
    choices: [
      {
        text: "Börja leta efter en nyckeln",
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
        text: "Prova den nyckel du har",
        condition: [
          {
            type: "storyFlag",
            flag: "openStorageQuest.Started",
            value: true,
          },
          { type: "hasItem", itemId: "storageKey" },
        ],
        nextNodeId: "storageChest",
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
