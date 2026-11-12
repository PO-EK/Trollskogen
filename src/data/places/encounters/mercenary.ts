import type { AdventureEncounter } from "../../adventureTypes";

export const mercenary: AdventureEncounter = {
  startNodeId: "mercenaryStart",
  nodes: {
    mercenaryStart: {
      id: "mercenaryStart",
      text: "Under en gran glöder en liten eld. Bredvid den sitter en man i välskött rustning och slipar ett vapen med långa, jämna drag. Han ser inte upp när du närmar dig.",
      choices: [
        {
          text: "Gå fram.",
          nextNodeId: "mercenaryChallenge",
        },
        {
          text: "Vänd tillbaka.",
          effects: [{ type: "endAdventure" }],
        },
      ],
    },
    mercenaryChallenge: {
      id: "mercenaryChallenge",
      text: "Legoknekten reser sig med en lugn, väl inövad rörelse. 'Ingen hamnar här av en slump. Jag är betald för att stoppa folk som du.'",
      choices: [
        {
          text: "Försvara dig!",
          effects: [
            {
              type: "startCombat",
              enemyId: "mercenary",
              extraLoot: [],
              winNodeId: "mercenaryWon",
              loseNodeId: "mercenaryLost",
            },
          ],
        },
      ],
    },
    mercenaryWon: {
      id: "mercenaryWon",
      text: "Legoknekten sjunker ned på knä och faller framåt. Elden knastrar kvar.",
      choices: [
        {
          text: "Återvänd till stigen.",
          effects: [{ type: "endAdventure" }],
        },
      ],
    },
    mercenaryLost: {
      id: "mercenaryLost",
      text: "Du tar ett hårt slag och backar bort mellan grenarna. Legoknekten följer dig med blicken men tar inte ett steg efter dig.",
      choices: [
        {
          text: "Fortsätt tillbaka.",
          effects: [{ type: "endAdventure" }],
        },
      ],
    },
  },
};
