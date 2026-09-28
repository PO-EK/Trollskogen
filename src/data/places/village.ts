import type { AdventureNode } from "../adventureTypes";

export const village: Record<string, AdventureNode> = {
  start: {
    id: "start",

    text: "Du står på det torget och ser över den lilla byn och dess invånare. De som går förbi hälsar och folk vinkar, de verkar vara väldigt glad att du är här.",

    choices: [
      {
        text: "Utforska byn",
        nextNodeId: "utforska",
      },
      {
        text: "Besök smeden",
        nextNodeId: "smeden",
      },
      {
        text: "Lämna torget",
        effects: [
          {
            type: "endAdventure",
          },
        ],
      },
    ],
  },

  utforska: {
    id: "utforska",
    text: "Du vandrar omkring och ser att någon har tappat en påse på vägen. Du plockar upp den och märker att den är fylld med pengar. Du funderar om du ska behålla den eller donerar du pengarna till byborna.",
    choices: [
      {
        text: "+ 63 Öre",
        nextNodeId: "start",
        effects: [
          {
            type: "addGold",
            amount: 63,
          },
        ],
      },
      {
        text: "Ge den till borgmästaren.",
        nextNodeId: "returncoins",
      },
    ],
  },

  returncoins: {
    id: "returncoins",
    text: "Du letar upp byns så kallad borgmästare och berättar var du hittade pengarna. Han blir upprymd och förklarar att det är hans pengar som han tappade härom natten när han flydde från trollet! Han är väldigt tacksam och ger dig 20 Öre som belöning.",
    choices: [
      {
        text: "+ 20 Öre",
        nextNodeId: "start",
        effects: [
          {
            type: "addGold",
            amount: 20,
          },
        ],
      },
    ],
  },

  smeden: {
    id: "smeden",
    text: "Smedjan beksrivning och välkommen",
    choices: [
      {
        text: "Köp och sälj",
        nextNodeId: "start",
      },
      {
        text: "Sök arbete",
        nextNodeId: "smedenwork",
      },
    ],
  },

  smedenwork: {
    id: "smedenwork",
    text: "Du spenderar några timmar med att hjälpa smeden med olika sysslor. Din närvaro drar till sig nyfikna bybor och smeden lyckas boka nya jobb.",
    choices: [
      {
        text: "Du tjänar: 15 öre",
        effects: [
          {
            type: "addGold",
            amount: 15,
          },
          {
            type: "endAdventure",
          },
        ],
      },
    ],
  },
};
