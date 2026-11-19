import type { AdventureNode } from "../adventureTypes";

export const waterfall: Record<string, AdventureNode> = {
  start: {
    id: "start",
    text: "Du följer en smal bäck som slingrar sig in mellan granarna. Vattnet är klart och kallt, och det porlar över stenar och rötter som om det hade bråttom hemifrån. Ju längre du går, desto tystare blir skogen runt dig. Inga fåglar, inget prassel. När träden till slut öppnar sig står du vid kanten av en myr. På andra sidan, bortom mossa och svart vatten, störtar ett vattenfall ned över en mörk klippvägg. Där kommer bäcken ifrån. Myren ligger som en mörk matta mellan dig och fallet, och du ser inga stigar över den.",
    choices: [
      {
        text: "Gå rakt genom myren.",
        nextNodeId: "bogWade",
      },
      {
        text: "Försök gå runt myren genom skogen.",
        nextNodeId: "bogAround",
        condition: { type: "hasActionPoints", amount: 1 },
        effects: [{ type: "removeActionPoints", amount: 1 }],
      },
      {
        text: "Vänd tillbaka.",
        effects: [
          { type: "hideLocation", locationId: "waterfall" },
          { type: "endAdventure" },
        ],
      },
    ],
  },

  bogWade: {
    id: "bogWade",
    text: "Du kliver ut i myren. Redan efter några steg är det svårt att ta sig fram. Mossan ger vika under dina fötter, och det svarta vattnet kryper uppför dina ben, kallt och tungt. Det känns som om både mossan och vattnet försöker dra ned dig, varje steg tar mer kraft än det förra. Då griper något tag om din vrist. En hand, grön och slemmig, har kommit upp ur vattnet. Den släpper inte. Vattnet bubblar, och en gestalt reser sig, uppsvälld och blågrå, med ögon som inte blinkar.",
    choices: [
      {
        text: "Slåss emot!",
        effects: [
          {
            type: "startCombat",
            enemyId: "drownling",
            winNodeId: "bogWin",
            loseNodeId: "waterfallLose",
          },
        ],
      },
    ],
  },

  bogWin: {
    id: "bogWin",
    text: "Gestalten sjunker tillbaka ned i det svarta vattnet och försvinner. Handen på din vrist slappnar av och släpper. Du drar dig loss och tar dig vidare med darrande ben. Myren ger dig inte upp utan motstånd, men till slut känner du fast mark under fötterna. Du kliver upp ur dyn, genomblöt och frusen, och går in bland träden på andra sidan.",
    choices: [
      {
        text: "Fortsätt mot vattenfallet.",
        nextNodeId: "waterfallMadcaps",
      },
    ],
  },

  bogAround: {
    id: "bogAround",
    text: "Du väljer skogen och en lång omväg runt myren. Marken är ojämn och full av rötter, och du måste klättra över nedfallna stammar och trassla dig igenom snår. Det tar tid och kraft, men du har fast mark under fötterna hela vägen. Du är nästan runt när du hör något som bryter grenar bakom dig. En varg kommer fram ur dunklet med uppdragna läppar, mager och hungrig, och den ser inte ut att vara rädd för dig.",
    choices: [
      {
        text: "Försvara dig!",
        effects: [
          {
            type: "startCombat",
            enemyId: "wolf",
            winNodeId: "aroundWin",
            loseNodeId: "waterfallLose",
          },
        ],
      },
    ],
  },

  aroundWin: {
    id: "aroundWin",
    text: "Vargen faller ihop bland löven. Du tar ett par djupa andetag och lyssnar, men skogen är tyst igen. Du fortsätter runt myrens kant, och till slut tunnas träden ut framför dig.",
    choices: [
      {
        text: "Fortsätt mot vattenfallet.",
        nextNodeId: "waterfallMadcaps",
      },
    ],
  },

  waterfallMadcaps: {
    id: "waterfallMadcaps",
    text: "Du går ut ur skogsbrynet, och där är det: vattenfallet. Det störtar ned från klippkanten i en slö, tung ström, och luften runt det skimrar svagt. Vid foten ligger en klar, djup bassäng omgiven av mossbeklädda stenar. Du går fram mot vattnet, men något rör sig i kanterna av ögonvrån. Små gestalter kommer fram bakom stenarna, knappt knähöga, med huvuden som svampar: röda hattar med ljusa prickar och stora, tomma ögon under dem. De piper och väsnas och viftar med små knutna händer. De vill inte att du ska vara här.",
    choices: [
      {
        text: "Slåss!",
        effects: [
          {
            type: "startCombat",
            enemyId: "madcap",
            winNodeId: "waterfallCollect",
            loseNodeId: "waterfallLose",
          },
        ],
      },
    ],
  },

  waterfallCollect: {
    id: "waterfallCollect",
    text: "De sista tomtarna tumlar bort bland stenarna och försvinner in under mossan, och plötsligt hörs bara vattenfallet. Du kliver fram till bassängen. Vattnet är så klart att du ser ända ned till botten, och när du doppar handen i det känns det som om det vibrerar, svagt och stilla.",

    choices: [
      {
        text: "Samla vattnet",
        effects: [{ type: "spawnLoot", itemId: "magicWater" }],
        nextNodeId: "waterfallCollected",
      },
    ],
  },
  waterfallCollected: {
    id: "waterfallCollected",
    text: "Du tar fram vatten behållaren och fyller den, långsamt, tills det är fullt och tungt. Du stänger det ordentligt, hänger det över axeln och vänder tillbaka mot skogen.",
    choices: [
      {
        text: "Lämna området",
        effects: [
          { type: "hideLocation", locationId: "waterfall" },
          { type: "endAdventure" },
        ],
      },
    ],
  },

  waterfallLose: {
    id: "waterfallLose",
    text: "Allt blir svart, och sedan vaknar du, tillbaka vid skogens kant.",
    choices: [
      {
        text: "Fortsätt.",
        effects: [
          { type: "hideLocation", locationId: "waterfall" },
          { type: "endAdventure" },
        ],
      },
    ],
  },
};
