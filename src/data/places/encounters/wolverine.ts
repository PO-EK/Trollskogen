import type { AdventureEncounter } from "../../adventureTypes";

export const wolverine: AdventureEncounter = {
  startNodeId: "wolverineStart",
  nodes: {
    wolverineStart: {
      id: "wolverineStart",
      text: "Något rör sig i lövhögen vid roten av en fallen stam. Du hör ett skrapande ljud, följt av ett lågt, ilsket fräsande.",
      choices: [
        {
          text: "Gå närmare.",
          nextNodeId: "wolverineAttack",
        },
        {
          text: "Vänd tillbaka.",
          effects: [{ type: "endAdventure" }],
        },
      ],
    },
    wolverineAttack: {
      id: "wolverineAttack",
      text: "Löven yr åt alla håll när en järv rusar fram med klorna först.",
      choices: [
        {
          text: "Försvara dig!",
          effects: [
            {
              type: "startCombat",
              enemyId: "wolverine",
              extraLoot: [],
              winNodeId: "wolverineWon",
              loseNodeId: "wolverineLost",
            },
          ],
        },
      ],
    },
    wolverineWon: {
      id: "wolverineWon",
      text: "Järven faller ihop i lövhögen och blir liggande. Skogen blir tyst igen.",
      choices: [
        {
          text: "Återvänd till stigen.",
          effects: [{ type: "endAdventure" }],
        },
      ],
    },
    wolverineLost: {
      id: "wolverineLost",
      text: "Du slår dig fri och backar bort tills fräsandet försvinner bakom dig.",
      choices: [
        {
          text: "Fortsätt tillbaka.",
          effects: [{ type: "endAdventure" }],
        },
      ],
    },
  },
};
