import type { AdventureNode } from "../adventureTypes";

export const banditCamp: Record<string, AdventureNode> = Object.assign({
  start: {
    id: "start",
    text: "Ett läger fullt av banditer.",
    choices: [
      {
        text: "Utmana hövdingen.",
        nextNodeId: "banditChallenge1",
        condition: [
          {
            type: "storyFlag",
            flag: "mainstory.shadow.vesselGiven",
            value: true,
          },
          {
            type: "storyFlag",
            flag: "mainstory.banditChief.defeated",
            value: false,
          },
        ],
      },
      {
        text: "Smyg runt och attackera enskilda rövare.",
        effects: [
          {
            type: "startCombat",
            enemyId: "bandit",
            extraLoot: [],
            winNodeId: "fightWon",
            loseNodeId: "fightLost",
          },
        ],
      },
      {
        text: "Attackera deras spejare.",
        effects: [
          {
            type: "startCombat",
            enemyId: "ambusher",
            extraLoot: [],
            winNodeId: "fightWon",
            loseNodeId: "fightLost",
          },
        ],
      },
      {
        text: "Utmana den starkaste till strid.",
        effects: [
          {
            type: "startCombat",
            enemyId: "mercenary",
            extraLoot: [],
            winNodeId: "fightWon",
            loseNodeId: "fightLost",
          },
        ],
      },
      {
        text: "Lämna lägret.",
        effects: [{ type: "endAdventure" }],
      },
    ],
  },
  fightWon: {
    id: "fightWon",
    text: "Dina fiende ligger besegrad, du har vunnit.",
    choices: [
      { text: "Fortsätt slåss", nextNodeId: "start" },
      {
        text: "Fly ut i skogen.",
        effects: [
          {
            type: "endAdventure",
          },
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
  banditChallenge1: {
    id: "banditChallenge1",
    text: "Du går rakt fram till lägret, utan att smyga eller gömma dig, och stannar mitt på den trampade marken mellan tälten och lägerelden. Rövarna tittar upp. De hann inte ens plocka fram sina vapen innan du ropar din utmaning, högt nog att eka mellan träden.\n\nDe samlas runt dig, ett par stycken först, sedan fler. 'Jag vill utmana hövdingen till strid,' säger du.\n\nEn av dem fnyser och kliver fram. 'Du? Du ser inte särskilt stark ut.' Han drar sitt vapen. 'Jag ska testa dig först.'",
    choices: [
      {
        text: "Försvara dig!",
        effects: [
          {
            type: "startCombat",
            enemyId: "bandit",
            winNodeId: "banditChallenge2",
            loseNodeId: "banditCampLose",
          },
        ],
      },
    ],
  },

  banditChallenge2: {
    id: "banditChallenge2",
    text: "Rövaren faller på marken. Du står kvar och upprepar din utmaning, och den här gången tar rövarna dig på större allvar. De tittar på varandra och mumlar. 'Ska vi hämta hövdingen?' frågar en av dem.\n\nMen innan någon hinner röra sig kliver en legoknekt fram ur mängden, med tunga steg och en blick som inte avslöjar något. 'Jag blev hyrd för att hålla utmanare borta från ledaren,' säger han. 'Och det tänker jag göra.'",
    choices: [
      {
        text: "Kämpa!",
        effects: [
          {
            type: "startCombat",
            enemyId: "mercenary",
            winNodeId: "banditChallenge3",
            loseNodeId: "banditCampLose",
          },
        ],
      },
    ],
  },

  banditChallenge3: {
    id: "banditChallenge3",
    text: "Legoknekten sjunker ned på knä och faller framåt. Du rätar på dig och ser på rövarna runt dig. 'Jag är här för hövdingen!' ropar du. 'Och om han inte har modet att komma fram själv, varför följer ni honom?'\n\nRövarna viskar sinsemellan. Du hör fragment: att hövdingen har betett sig konstigt länge nu, att de inte har tjänat något på att följa honom djupt in i skogen, att ingen vet längre vad han vill.\n\nDå hörs ett skratt.",
    choices: [{ text: "Fortsätt.", nextNodeId: "banditChallenge4" }],
  },

  banditChallenge4: {
    id: "banditChallenge4",
    text: "Rövarna skiljer sig åt, och hövdingen kliver fram. Han är en enorm man, i tung metallrustning, med en stor krigsyxa i händerna. Han stannar framför dig och ser ned på dig.\n\n'Jag är den som bestämmer över den här skogen!' ropar han. 'Och det är självmord att utmana mig!'\n\nMen något är fel. När han talar måste han hålla sig för skratt, och rösten är full av skadeglädje, som om hela detta var ett skämt som bara han förstod. Du misstänker att det är skuggan som styr honom. Du tar ett fast grepp om ditt vapen, och striden börjar.",
    choices: [
      {
        text: "Strid!",
        effects: [
          {
            type: "startCombat",
            enemyId: "banditChief",
            winNodeId: "banditChiefWin",
            loseNodeId: "banditCampLose",
          },
        ],
      },
    ],
  },

  banditChiefWin: {
    id: "banditChiefWin",
    text: "Med ett sista slag faller hövdingen ned på marken, och yxan glider ur hans hand. Hans kropp ligger stilla.\n\nRövarna står kvar, och ingen säger något på en stund. Sedan börjar de viska. 'Vad ska vi göra nu?' Några av dem tittar på dig, och du hör hur en av dem frågar om du kanske är deras nya ledare.",
    choices: [{ text: "Fortsätt.", nextNodeId: "banditChiefWin2" }],
  },

  banditChiefWin2: {
    id: "banditChiefWin2",
    text: "'Fly!' ropar du. 'Lämna skogen, fort! Det finns gamla och mörka väsen här som bara vill er illa!'\n\nDå börjar hövdingens kropp skaka. Den lyfter från marken och svävar, och en mörk dimma verkar omsluta den, tjockare för varje ögonblick. Rövarna ser det, och skriker. Alla utom du flyr lägret så snabbt de kan.\n\nDu är ensam kvar. Du gör dig redo och hoppas att Melanders ring fungerar. Sedan går du fram och gör en sista attack mot det svävande liket.",
    choices: [{ text: "Fortsätt.", nextNodeId: "banditChiefWin3" }],
  },

  banditChiefWin3: {
    id: "banditChiefWin3",
    text: "Liket brister och förvandlas till svart dimma. Dimman samlas och tar form: en skepnad som bara påminner om en människa, men som inte är helt rätt. Den är för smal, och armarna är för långa.\n\nDen kastar sig över dig, och allt blir svart.",
    choices: [{ text: "Fortsätt.", nextNodeId: "banditChiefWin4" }],
  },

  banditChiefWin4: {
    id: "banditChiefWin4",
    text: "Du fylls av hopplöshet, het och kvävande, och av en fruktan som du aldrig har känt förut. Du kan inte röra dig. Du kan inte tänka.\n\nSå börjar ringen på ditt finger lysa, med ett varmt, gyllene sken. Ljuset växer, och all den svarta dimman som omger dig blir uppslukad av det. Till slut försvinner både den svarta dimman och det gyllene ljuset in i ringen.\n\nDu står i ett tomt läger, med ringen kall mot fingret, och tänker på dina föräldrar.",
    choices: [
      {
        text: "Nu är byn säker.",
        nextNodeId: "banditChiefLeave",
        effects: [
          {
            type: "setStoryFlag",
            flag: "mainstory.shadow.reflectionVillage",
            value: true,
          },
        ],
      },
      {
        text: "Jag har hämnats min familj.",
        nextNodeId: "banditChiefLeave",
        effects: [
          {
            type: "setStoryFlag",
            flag: "mainstory.shadow.reflectionRevenge",
            value: true,
          },
        ],
      },
    ],
  },

  banditChiefLeave: {
    id: "banditChiefLeave",
    text: "Du ser dig omkring en sista gång: de övergivna tälten, den slocknande lägerelden, hövdingens yxa som ligger kvar i gräset. Sedan vänder du dig om och lämnar lägret, och går tillbaka mot häxans stuga.",
    choices: [
      {
        text: "Lämna lägret.",
        effects: [
          {
            type: "setStoryFlag",
            flag: "mainstory.banditChief.defeated",
            value: true,
          },
          {
            type: "setStoryFlag",
            flag: "mainstory.shadow.sealed",
            value: true,
          },
          { type: "hideLocation", locationId: "banditCamp" },
          { type: "endAdventure" },
        ],
      },
    ],
  },

  banditCampLose: {
    id: "banditCampLose",
    text: " Allt blir svart, och sedan vaknar du, tillbaka vid skogens kant.",
    choices: [
      {
        text: "Fortsätt.",
        effects: [{ type: "endAdventure" }],
      },
    ],
  },
});
