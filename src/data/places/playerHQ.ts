import type { AdventureNode } from "../adventureTypes";

export const playerHQ: Record<string, AdventureNode> = {
  start: {
    id: "start",

    text: "Din lilla stuga. Det är inte lyxigt men det duger för dem som är van att sova i skogen.",

    choices: [
      {
        text: "Öppna din kista",
        nextNodeId: "storageChest",
      },
      {
        text: "Använd arbetsbänken.",
        nextNodeId: "workbench",
      },
      {
        text: "Gå till sängs.",
        nextNodeId: "inBed",
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
    text: "Kistan är gjord av trä men bunden med tjock metal, den ser väldigt tung och säker ut. Du låser upp den med den stora svara järn nyckel som följde med huset. Här kan du förvara saker du till spara, utan rädsla att det ska försvinna.",
    choices: [
      {
        text: "Tillbaka",
        nextNodeId: "start",
      },
    ],
  },

  workbench: {
    id: "workbench",
    text: "Du sätter dig vid snickarbänken. Den som bodde här för måste ha tagit väl hand om den. Här kan du skapa föremål eller bearbeta matrial.",
    choices: [
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
        text: "Tillbaka",
        nextNodeId: "start",
      },
    ],
  },
};
