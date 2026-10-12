import type { AdventureNode } from "../adventureTypes";

export const smeden: Record<string, AdventureNode> = {
  start: {
    id: "start",
    text: "Smedjan är i full gång, men rök ut skorsten och ljud av hammare mot metal. Du finns smeden framför sitt städ. 'Jag mår mycket bättre nu, lite stel kanske. Vad behöver du idag?'",
    choices: [
      {
        text: "Köp och sälj",
        nextNodeId: "start",
        effects: [
          {
            type: "openTrader",
            traderId: "blacksmith",
          },
        ],
      },
      {
        text: "Jobba för smeden.",
        nextNodeId: "smedenwork",
        condition: {
          type: "storyFlag",
          flag: "smeden.employed",
          value: true,
        },
      },
      {
        text: "Ställ frågor",
        nextNodeId: "smedenAsk",
      },
      {
        text: "Ursäkta, men jag måste gå vidare.",
        effects: [
          {
            type: "endAdventure",
          },
        ],
      },
    ],
  },

  smedenAsk: {
    id: "smedenAsk",
    text: "Smeden suckar djupt när du frågar om han har tid att svara på dina frågor. Han verkar dock inte vara motståndig eftersom han lägger ned sitt verktyg vänder sig mot dig. 'Vad vill du veta?'",
    choices: [
      {
        text: "Berätta om dig själv.",
        nextNodeId: "smedenBackstory",
      },
      {
        text: "Fråga om byn.",
        nextNodeId: "smedenVillage",
      },
      {
        text: "Kan jag hjälpa dig?",
        nextNodeId: "smedenaskforwork",
      },
      {
        text: "Ursäkta, men jag måste gå vidare.",
        effects: [
          {
            type: "endAdventure",
          },
        ],
      },
    ],
  },

  smedenwork: {
    id: "smedenwork",
    text: "Du spenderar några timmar med att hjälpa smeden med olika sysslor. Din närvaro drar till sig nyfikna bybor och smeden lyckas boka nya jobb.",
    choices: [
      {
        text: "Du tjänar: 15 Kroner",
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

  smedenBackstory: {
    id: "smedenBackstory",
    text: "",
    choices: [
      {
        text: "Tillbaka.",
        nextNodeId: "smedenAsk",
      },
      {
        text: "Ursäkta, men jag måste gå vidare.",
        effects: [
          {
            type: "endAdventure",
          },
        ],
      },
    ],
  },

  smedenVillage: {
    id: "smedenVillage",
    text: "",
    choices: [
      {
        text: "Tillbaka.",
        nextNodeId: "smedenAsk",
      },
      {
        text: "Ursäkta, men jag måste gå vidare.",
        effects: [
          {
            type: "endAdventure",
          },
        ],
      },
    ],
  },

  smedenaskforwork: {
    id: "smedenaskforwork",
    text: "Ja, jag kan behöva lite hjälp. Dock kan jag inte betala så mycket.",
    choices: [
      {
        text: "Okej, det låter bra.",
        nextNodeId: "smedenwork",
        effects: [
          {
            type: "setStoryFlag",
            flag: "smeden.employed",
            value: true,
          },
        ],
      },
      {
        text: "Jag har viktigare uppgifter just nu.",
        nextNodeId: "start",
      },
    ],
  },
};
