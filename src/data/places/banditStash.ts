import type { AdventureNode } from "../adventureTypes";

export const banditStash: Record<string, AdventureNode> = {
  start: {
    id: "start",
    text: "Du följer häxans beskrivning och går längre och längre in i skogen, bort från alla stigar. Träden står tätare här, och marken är full av rötter och nedfallna grenar. Du ser spår av människor: nedtrampat gräs, ett brutet snår, en bit trasigt rep. Rövarna har varit här många gånger. Du är nästan framme när en man kliver fram bakom en gran, en båge hängande över axeln och en kniv i handen.",
    choices: [
      {
        text: "Fortsätt.",
        nextNodeId: "scout",
      },
    ],
  },

  scout: {
    id: "scout",
    text: "'Stopp.' Mannen mönstrar dig och blir stående mitt på stigen. 'Det här är ingen väg för vanligt folk. Vart är du på väg?'",
    choices: [
      {
        text: "Ert förråd av stulna saker, det är här någonstans?",
        nextNodeId: "scoutAnswerStorage",
      },
      {
        text: "Jag tar bara en promenad i skogen.",
        nextNodeId: "scoutAnswerWalk",
      },
      {
        text: "Ingenstans. Ursäkta, men jag måste gå nu.",
        nextNodeId: "scoutAnswerLeave",
      },
    ],
  },

  scoutAnswerStorage: {
    id: "scoutAnswerStorage",
    text: "Spejaren blir stel, och ögonen vidgas för ett ögonblick. Sedan försvinner överraskningen ur hans ansikte och blir hård. 'Det borde du inte veta.' Han drar kniven. 'Och inte säga högt.'",
    choices: [
      {
        text: "Försvara dig!",
        effects: [
          {
            type: "startCombat",
            enemyId: "ambusher",
            winNodeId: "stashCamp",
            loseNodeId: "stashLose",
          },
        ],
      },
    ],
  },

  scoutAnswerWalk: {
    id: "scoutAnswerWalk",
    text: "Spejaren skrattar, kort och utan glädje. 'En promenad. Mitt ute här.' Han tar ett steg fram och höjer kniven. 'Då har du gått vilse, främling. Och det blir dyrt.'",
    choices: [
      {
        text: "Försvara dig!",
        effects: [
          {
            type: "startCombat",
            enemyId: "ambusher",
            winNodeId: "stashCamp",
            loseNodeId: "stashLose",
          },
        ],
      },
    ],
  },

  scoutAnswerLeave: {
    id: "scoutAnswerLeave",
    text: "Spejaren rör sig åt sidan och blockerar din väg. Ett ovänligt leende sprider sig. 'Inte så fort. Folk som har ingenstans att vara kommer sällan med tomma fickor. Lämna vad du har, så får du gå.' Du ser på hans blick att han inte menar det.",
    choices: [
      {
        text: "Försvara dig!",
        effects: [
          {
            type: "startCombat",
            enemyId: "ambusher",
            winNodeId: "stashCamp",
            loseNodeId: "stashLose",
          },
        ],
      },
    ],
  },

  stashCamp: {
    id: "stashCamp",
    text: "Spejaren ligger stilla på marken. Du torkar av dig, hämtar andan och går vidare, försiktigare nu. Det dröjer inte länge förrän du ser det: ett övervuxet skjul, nästan helt täckt av grenar och murgröna, så välgömt att du skulle gått förbi om du inte visste vad du sökte. Framför det brinner en liten lägereld. Vid den sitter en legoknekt i sliten rustning och pysslar med sitt vapen, med ryggen halvt mot dig. Han har inte sett dig än. Du stannar bakom en stam och tar en minut för att samla dig.",
    choices: [
      {
        text: "Attackera.",
        nextNodeId: "stashFight",
      },
      {
        text: "Överge uppdraget och smyg iväg.",
        effects: [
          { type: "hideLocation", locationId: "banditStash" },
          { type: "endAdventure" },
        ],
      },
    ],
  },

  stashFight: {
    id: "stashFight",
    text: "Du hoppar fram ur skuggan. Legoknekten slutar pyssla med sitt vapen och reser sig upp, långsamt, utan ett ord. Han vrider på huvudet och ser på dig, och så börjar han gå mot dig med tunga, jämna steg.",
    choices: [
      {
        text: "Kämpa!",
        effects: [
          {
            type: "startCombat",
            enemyId: "mercenary",
            winNodeId: "stashKey",
            loseNodeId: "stashLose",
          },
        ],
      },
    ],
  },

  stashKey: {
    id: "stashKey",
    text: "Legoknekten sjunker ihop vid lägerelden och blir liggande. Du ser en nyckel hänga i hans bälte, och du tar den utan att tveka. Den passar i låset på skjulets dörr, som öppnas med ett knarrande. Inne är det mörkt och kallt, och det luktar mögel och damm. Du letar igenom lådor och kistor, ett skåp och några säckar. Det mesta är onödigt: trasiga verktyg, vigselringar utan sten, skrot som ingen kan sälja. Men det ligger lösa mynt här och där, och när du samlat ihop dem alla har du nästan hundra och tjugo. Längst in står en stor, tung kista.",
    choices: [
      {
        text: "Gå fram till kistan.",
        nextNodeId: "stashChest",
        effects: [{ type: "addGold", amount: 120 }],
      },
    ],
  },

  stashChest: {
    id: "stashChest",
    text: "Kistan är av mörkt, fuktigt trä med järnbeslag, och den är inte låst. Du lyfter på locket.",
    choices: [
      {
        text: "Titta i kistan.",
        nextNodeId: "stashGlass",
        effects: [{ type: "openChest", chestId: "witchBanditStorageChest" }],
      },
    ],
  },

  stashGlass: {
    id: "stashGlass",
    text: "Bakom kistan står en hylla som är full av glas. Du går fram och ser flaskor i alla former, burkar, små ampuller och slipade glaskärl. Allt är rent och orört. Det här är det Melander ville ha.",
    choices: [
      {
        text: "Samla ihop glaset åt Melander.",
        nextNodeId: "stashCollected",
        effects: [
          { type: "spawnLoot", itemId: "witchGlassSet" },
          { type: "hideLocation", locationId: "banditStash" },
        ],
      },
      {
        text: "Kolla kistan igen.",
        nextNodeId: "stashGlass",
        effects: [{ type: "openChest", chestId: "witchBanditStorageChest" }],
      },
    ],
  },

  stashCollected: {
    id: "stashCollected",
    text: "Du packar ned glaset försiktigt, bit för bit, tills du har allt som Melander kan behöva. Inget går sönder. Du slår ihop väskan och ser dig omkring en sista gång. Det är bara att gå härifrån.",
    choices: [
      {
        text: "Kolla kistan igen.",
        nextNodeId: "stashCollected",
        effects: [{ type: "openChest", chestId: "witchBanditStorageChest" }],
      },
      {
        text: "Lämna förådet.",
        effects: [
          { type: "hideLocation", locationId: "banditStash" },
          { type: "endAdventure" },
        ],
      },
    ],
  },

  stashLose: {
    id: "stashLose",
    text: "Allt blir svart, och sedan vaknar du, tillbaka vid skogens kant.",
    choices: [
      {
        text: "Fortsätt.",
        effects: [
          { type: "hideLocation", locationId: "banditStash" },
          { type: "endAdventure" },
        ],
      },
    ],
  },
};
