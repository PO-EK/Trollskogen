import type { AdventureNode } from "../adventureTypes";

export const witchIntroQuest: Record<string, AdventureNode> = {
  start: {
    id: "start",
    text: "Efter en lång vandring genom tät skog hittar du en liten grotta i en kulle, halvt dold av ormbunkar och hängande rötter. Marken runt öppningen är full av svampar i alla storlekar. Några lyser svagt i ett blekt, silvrigt sken trots dagsljuset. Det är tyst, och luften luktar fukt och jord.",
    choices: [
      {
        text: "Gå in i grottan.",
        nextNodeId: "caveInside",
      },
      {
        text: "Gå tillbaka.",
        effects: [
          {
            type: "endAdventure",
          },
        ],
      },
    ],
  },

  caveInside: {
    id: "caveInside",
    text: "Du kryper in genom öppningen och reser dig i ett litet, rundat rum. Svampar växer överallt längs väggarna och i sprickorna i taket, och de skimrar i ljusblått och silver. I mitten, på en liten upphöjning av mossa, växer en svamp som är större och blekare än de andra. Det måste vara den Melander vill ha. Då hör du det: ett lågt morrande bakom dig. En stor grå varg har glidit in genom öppningen och blockerar utgången. Den visar tänderna och tar ett steg framåt.",
    choices: [
      {
        text: "Försvara dig!",
        effects: [
          {
            type: "startCombat",
            enemyId: "wolf",
            extraLoot: [],
            winNodeId: "wolfDefeated",
            loseNodeId: "fightLost",
          },
        ],
      },
    ],
  },

  wolfDefeated: {
    id: "wolfDefeated",
    text: "Vargen faller ihop och blir liggande vid grottans mynning. Det är tyst igen, förutom ditt eget andetag. Du torkar svetten ur pannan och går fram till upphöjningen i mitten av rummet. Den bleka svampen skimrar svagt, som om den andades.",
    choices: [
      {
        text: "Samla svamp.",
        nextNodeId: "mushroomTaken",
        effects: [{ type: "spawnLoot", itemId: "magicMushroom" }],
      },
    ],
  },

  mushroomTaken: {
    id: "mushroomTaken",
    text: "Du lirkar försiktigt loss svampen med hela foten intakt, och lägger den i din väska. Grottan verkar plötsligt mörkare utan dess sken. Du hittar inget mer.",
    choices: [
      {
        text: "Lämna grottan.",
        effects: [
          { type: "hideLocation", locationId: "witchIntroQuest" },
          { type: "addExperience", amount: 21 },
          { type: "endAdventure" },
        ],
      },
    ],
  },

  fightLost: {
    id: "fightLost",
    text: "Allt blir svart...",
    choices: [
      {
        text: "Någon räddar dig...",
        effects: [
          {
            type: "endAdventure",
          },
        ],
      },
    ],
  },
};
