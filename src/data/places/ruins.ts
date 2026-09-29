import type { AdventureNode } from "../adventureTypes";

export const ruins: Record<string, AdventureNode> = {
  start: {
    id: "start",

    text: "Du följer den gammla bekanta vägen hemåt, tills du står framför det som finns kvar av gården. Ditt huvud är fullt av barndomsminnen från denna plats, av lyckligare tider. Nu är det endast aska och kolsvarta stockar.",

    choices: [
      {
        text: "Besök gravarna under ekträdet.",
        nextNodeId: "graves",

        condition: {
          type: "storyFlag",
          flag: "ruins.foundGraves",
          value: true,
        },
      },
      {
        text: "Ta en närmare titt på huset.",
        nextNodeId: "inside",

        condition: {
          type: "storyFlag",
          flag: "ruins.searchedInside",
          value: false,
        },
      },

      {
        text: "Sök runt på utsidan.",
        nextNodeId: "outside",

        condition: {
          type: "storyFlag",
          flag: "ruins.searchedOutside",
          value: false,
        },
      },

      {
        text: "Återvänd till byn.",
        effects: [
          {
            type: "endAdventure",
          },
        ],
      },
    ],
  },

  inside: {
    id: "inside",

    text: "Denna eld startade ej i köket, vars väggar fortfarande står även om de är svarta och brända. Övervåningen har fallit ned så det är svårt att utforska insidan och varje steg du tar så riskerar du ras. Du kan dock se var elden började, vilket var vid ytterdörren. Hela mitten av huset är mer bränt än resten, som om ett enormt eld spjut flög rakt genom ytterdörren och ut genom bakväggen. Blev dina föräldrar attackerade av något?",

    choices: [
      {
        text: "Sök efter något användbart.",
        nextNodeId: "inside2",
        effects: [
          {
            type: "addItem",
            itemId: "health_potion",
          },
          {
            type: "setStoryFlag",
            flag: "ruins.searchedInside",
            value: true,
          },
        ],
      },
      {
        text: "Återvänd",
        nextNodeId: "start",
      },
    ],
  },
  inside2: {
    id: "inside2",

    text: "Du lyfter undan brädor och hoppar över hinder tills du hittar din mors gamla kista.",

    choices: [
      {
        text: "Lämna huset.",
        nextNodeId: "start",
      },
    ],
  },

  outside: {
    id: "outside",

    text: "Du följer utsidan av huset runt på baksidan. Bakväggen av huset ser ut som att det har exploderat, träbitar ligger utspridda flera meter ut från huset och gräset ser bränt ut hela vägen bort till vedboden. Längre bort ser du den gammla eken där byborna sa att de hade begravt dina föräldrar.",

    choices: [
      {
        text: "Kolla vedboden",
        nextNodeId: "vedboden",

        effects: [
          {
            type: "addItem",
            itemId: "old_axe",
          },
          {
            type: "setStoryFlag",
            flag: "ruins.searchedOutside",
            value: true,
          },
          {
            type: "setStoryFlag",
            flag: "ruins.foundGraves",
            value: true,
          },
        ],
      },

      {
        text: "Gå tillbaka",
        nextNodeId: "start",
        effects: [
          {
            type: "setStoryFlag",
            flag: "ruins.foundGraves",
            value: true,
          },
        ],
      },
    ],
  },

  vedboden: {
    id: "vedboden",
    text: "Din fars yxa sitter fasthuggen i huggkubben. Samma yxa du använde som ung när du hjälpte far att hugga ved inför vintern. Själva vedboden är ganska tom, endast några få vedträd kvar.",
    choices: [
      {
        text: "Återvänd till huset",
        nextNodeId: "start",
      },
    ],
  },

  graves: {
    id: "graves",
    text: "Under den stora och ståtliga eken är två enkla trä kors nedsatta i marken, här ligger din mor och far. Byborna har försökt gjort det så fint de kan med blomkranser och buketter. Du faller ned på knä och sörjer.",
    choices: [
      {
        text: "Gör ett löfte att beskydda folket i byn ifrån mörkret i skogen, så inga fler familjer blir förstörda.",
        nextNodeId: "leaving",
      },
      {
        text: "Svär hämnd mot dem som orsakade detta, människa eller monster spelar ingen roll.",
        nextNodeId: "leaving",
      },
    ],
  },

  leaving: {
    id: "leaving",
    text: "Efter en lång stund reser du på dig och börjar gå tillbaka till byn. Du blickar tillbaka på ditt barndoms hem och dina föräldrar, och säger farväl för sista gången.",
    choices: [
      {
        text: "Återvänd till byn.",
        effects: [
          {
            type: "setStoryFlag",
            flag: "ruins.foundGraves",
            value: false,
          },
          {
            type: "endAdventure",
          },
        ],
      },
    ],
  },
};
