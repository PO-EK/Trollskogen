import type { AdventureEncounter } from "../../adventureTypes";

export const foxfire: AdventureEncounter = {
  startNodeId: "foxfireStart",
  nodes: {
    foxfireStart: {
      id: "foxfireStart",
      text: "Blå lågor fladdrar mellan träden framför dig. De rör sig längre in i skogen, men stannar varje gång du tvekar. Ett dovt morrande hörs från mörkret bakom dem.",
      choices: [
        {
          text: "Följ lågorna.",
          nextNodeId: "foxfireWolf",
        },
        {
          text: "Vänd tillbaka.",
          effects: [{ type: "endAdventure" }],
        },
      ],
    },
    foxfireWolf: {
      id: "foxfireWolf",
      text: "Lågorna slocknar. En varg kliver fram ur snåren och spärrar vägen.",
      choices: [
        {
          text: "Försvara dig!",
          effects: [
            {
              type: "startCombat",
              enemyId: "wolf",
              extraLoot: [],
              winNodeId: "foxfireWon",
              loseNodeId: "foxfireLost",
            },
          ],
        },
      ],
    },
    foxfireWon: {
      id: "foxfireWon",
      text: "Vargen flyr in bland träden. De blå lågorna tänds igen en bit längre bort, men du låter dem försvinna ur sikte.",
      choices: [
        {
          text: "Återvänd till stigen.",
          effects: [{ type: "endAdventure" }],
        },
      ],
    },
    foxfireLost: {
      id: "foxfireLost",
      text: "Du lyckas ta dig undan vargen och hittar tillbaka till stigen.",
      choices: [
        {
          text: "Fortsätt tillbaka.",
          effects: [{ type: "endAdventure" }],
        },
      ],
    },
  },
};
