import type { AdventureNode } from "../adventureTypes";

export const smeden: Record<string, AdventureNode> = {
  start: {
    id: "start",
    text: "Smedjan beksrivning och välkommen",
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
          value: false,
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
        text: "Vad hände med mina föräldrar?",
        nextNodeId: "smedenParents",
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

  smedenParents: {
    id: "smedenParents",
    text: "Jag hörde att de blev dödade, haha. Skill Issue. Git Gud noobs.",
    choices: [
      {
        text: "De hittade aldrig Dodge knappen.",
        effects: [
          {
            type: "endAdventure",
          },
        ],
      },
      {
        text: "Dom skulle ha köpt Premium Battle Pass.",
        effects: [
          {
            type: "endAdventure",
          },
        ],
      },
      {
        text: "Du är den mänskliga versionen av en huvudvärk.",
        effects: [
          {
            type: "endAdventure",
          },
        ],
      },
      {
        text: "Tillbaka.",
        nextNodeId: "smedenAsk",
      },
    ],
  },
};
