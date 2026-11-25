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
        text: "Börja leta efter nyckeln",
        condition: {
          type: "storyFlag",
          flag: "openStorageQuest.Started",
          value: false,
        },
        nextNodeId: "searchForStorageKey",
        effects: [
          {
            type: "setStoryFlag",
            flag: "openStorageQuest.Started",
            value: true,
          },
        ],
      },
      {
        text: "Prova nyckeln",
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
          { type: "addExperience", amount: 18 },
        ],
      },
      {
        text: "Tillbaka",
        nextNodeId: "start",
      },
    ],
  },

  searchForStorageKey: {
    id: "searchForStorageKey",
    text: "Du börjar leta igenom den lilla stugan. Du tittar under den rangliga sängen, i de tomma skåpen och bakom spisen. Förutom damm och några gamla trasor hittar du inte mycket. Till sist känner du något kallt och tungt bakom en lös golvbräda: en stor järnnyckel.",
    choices: [
      {
        text: "Ta nyckeln",
        nextNodeId: "start",
        effects: [{ type: "spawnLoot", itemId: "storageKey" }],
      },
    ],
  },

  inBed: {
    id: "inBed",
    text: "Du sparkar av dig stövlarna och tar av dig tillräckligt med kläder för att känna dig bekväm. Du sätter dig på sängen och känner genast skillnaden mot din sovrulle.",
    choices: [
      {
        text: "Sov en natt - Återhämta dig helt.",
        nextNodeId: "start",
        effects: [{ type: "sleep" }],
      },
      {
        text: "Tillbaka",
        nextNodeId: "start",
      },
    ],
  },
};
