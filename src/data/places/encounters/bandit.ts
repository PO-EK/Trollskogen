import type { AdventureEncounter } from "../../adventureTypes";

export const bandit: AdventureEncounter = {
  startNodeId: "banditStart",
  nodes: {
    banditStart: {
      id: "banditStart",
      text: "Stigen delar sig runt ett fallet träd. Bakom stammen hörs ett skrapande ljud, som när någon slipar metall mot sten.",
      choices: [
        {
          text: "Gå förbi trädet.",
          nextNodeId: "banditStep",
        },
        {
          text: "Vänd tillbaka.",
          effects: [{ type: "endAdventure" }],
        },
      ],
    },
    banditStep: {
      id: "banditStep",
      text: "En rövare hoppar fram och blockerar vägen med sitt vapen lyft. 'Lämna det du har, så får du kanske leva.'",
      choices: [
        {
          text: "Försvara dig!",
          effects: [
            {
              type: "startCombat",
              enemyId: "bandit",
              extraLoot: [],
              winNodeId: "banditWon",
              loseNodeId: "banditLost",
            },
          ],
        },
      ],
    },
    banditWon: {
      id: "banditWon",
      text: "Rövaren faller ihop i leran. Du står kvar en stund och lyssnar efter fler, men skogen är tyst.",
      choices: [
        {
          text: "Återvänd till stigen.",
          effects: [{ type: "endAdventure" }],
        },
      ],
    },
    banditLost: {
      id: "banditLost",
      text: "Du tar ett hugg i sidan men lyckas ta dig undan genom snåren innan rövaren hinner ikapp.",
      choices: [
        {
          text: "Fortsätt tillbaka.",
          effects: [{ type: "endAdventure" }],
        },
      ],
    },
  },
};
