import type { AdventureEncounter } from "../../adventureTypes";

export const ambush: AdventureEncounter = {
  startNodeId: "ambushStart",
  nodes: {
    ambushStart: {
      id: "ambushStart",
      text: "Du vandrar rakt in i ett bakhåll. Två spejare och en rövare hoppar fram ur buskarna och omringar dig, med vapnen sänkta men redo. Ingen av dem attackerar. 'Pengarna,' säger rövaren. 'Alla. Så får ni gå härifrån.'",
      choices: [
        {
          text: "Attackera.",
          effects: [
            {
              type: "startCombat",
              enemyId: "ambusher",
              extraLoot: [],
              winNodeId: "ambushScoutOneDown",
              loseNodeId: "ambushLost",
            },
          ],
        },
        {
          text: "Ge dem alla dina pengar.",
          nextNodeId: "ambushGiveGold",
          effects: [
            { type: "removeAllGold" },
            { type: "addExperience", amount: 30 },
          ],
        },
        {
          text: "Vad gör ni här mitt i skogen?",
          nextNodeId: "ambushAsk1",
        },
      ],
    },

    ambushScoutOneDown: {
      id: "ambushScoutOneDown",
      text: "Den första spejaren faller ihop med ett kvävt ljud. Den andra tvekar inte en sekund utan hoppar fram med kniven redan framför sig.",
      choices: [
        {
          text: "Försvara dig!",
          effects: [
            {
              type: "startCombat",
              enemyId: "ambusher",
              extraLoot: [],
              winNodeId: "ambushScoutTwoDown",
              loseNodeId: "ambushLost",
            },
          ],
        },
      ],
    },

    ambushScoutTwoDown: {
      id: "ambushScoutTwoDown",
      text: "Den andra spejaren sjunker ned i ormbunkarna. Rövaren står ensam kvar, och blicken flackar mellan sina kamrater och dig. Han lyfter sitt vapen med ett ryck. 'Då får det bli så här.'",
      choices: [
        {
          text: "Försvara dig!",
          effects: [
            {
              type: "startCombat",
              enemyId: "bandit",
              extraLoot: [],
              winNodeId: "ambushWon",
              loseNodeId: "ambushLost",
            },
          ],
        },
      ],
    },

    ambushWon: {
      id: "ambushWon",
      text: "Den sista rövaren faller baklänges mot en trädstam och blir liggande. Det blir tyst, och bara ditt eget andetag hörs mellan träden.",
      choices: [
        {
          text: "Återvänd till stigen.",
          effects: [{ type: "endAdventure" }],
        },
      ],
    },

    ambushLost: {
      id: "ambushLost",
      text: "Du tar ett hårt slag och lyckas slita dig loss mellan två av dem. Du springer tills ropen bakom dig tystnat och hittar tillbaka till stigen.",
      choices: [
        {
          text: "Fortsätt tillbaka.",
          effects: [{ type: "endAdventure" }],
        },
      ],
    },

    ambushGiveGold: {
      id: "ambushGiveGold",
      text: "Du sträcker fram din börs utan ett ord. De tre stirrar på den, och sedan på varandra. 'Vad... bara så där?' mumlar en av spejarna. Rövaren rycker åt sig börsen och backar bort, osäker på om det är en fälla. Utan att tacka vänder de och försvinner ut i skogen.",
      choices: [
        {
          text: "Återvänd till stigen.",
          effects: [{ type: "endAdventure" }],
        },
      ],
    },

    ambushAsk1: {
      id: "ambushAsk1",
      text: "Rövaren fnyser. 'Vad tror du? Vi rånar folk.' Spejarna skiftar nervöst på vikten och håller kvar blickarna på dig.",
      choices: [
        {
          text: "Det är lättare att råna folk utanför den tjocka skogen.",
          nextNodeId: "ambushAsk2",
        },
      ],
    },

    ambushAsk2: {
      id: "ambushAsk2",
      text: "Det blir tyst. Spejarna tittar på varandra, och sedan på rövaren. Den ena sänker kniven en bit. 'Det är sant,' säger han tyst. 'Vi vill inte vara här. Vi är trötta på skogen och på alla monster. Vi vill bara härifrån.'",
      choices: [
        {
          text: "Varför stannade ni?",
          nextNodeId: "ambushWhy",
        },
        {
          text: "Varför kom ni hit från första början?",
          nextNodeId: "ambushWhy",
        },
      ],
    },

    ambushWhy: {
      id: "ambushWhy",
      text: "Rövaren ser bort. 'Det är på grund av hövdingen, Rövarhövdingen. Han är besatt av skogen. Vi kom hit för honom, och vi stannade för att ingen kan säga emot.' En av spejarna sväljer. 'En kille frågade varför vi inte drog till stan istället. Hövdingen dödade honom direkt, mitt framför alla.' Han skakar på huvudet. 'Så vi smög iväg i natt, alla tre. Vi ska ta oss till stan, men vi har inga pengar.'",
      choices: [
        {
          text: "Fortsätt.",
          nextNodeId: "ambushDemand",
        },
      ],
    },

    ambushDemand: {
      id: "ambushDemand",
      text: "Rövaren skakar sig och lyfter vapnet igen. 'Nog pratat. Ge oss allt du har!' Spejarna tar ett steg närmare.",
      choices: [
        {
          text: "Attackera.",
          effects: [
            {
              type: "startCombat",
              enemyId: "ambusher",
              extraLoot: [],
              winNodeId: "ambushScoutOneDown",
              loseNodeId: "ambushLost",
            },
          ],
        },
        {
          text: "Ge dem alla dina pengar.",
          nextNodeId: "ambushGiveGold",
          effects: [
            { type: "removeAllGold" },
            { type: "addExperience", amount: 30 },
          ],
        },
        {
          text: "Berätta var lägret är, jag betalar.",
          condition: {
            type: "storyFlag",
            flag: "banditCamp.mapBought",
            value: false,
          },
          effects: [
            {
              type: "checkGold",
              amount: 100,
              hasGoldNodeId: "ambushCanBuyMap",
              insufficientGoldNodeId: "ambushCannotBuyMap",
            },
          ],
        },
      ],
    },

    ambushCanBuyMap: {
      id: "ambushCanBuyMap",
      text: "Rövaren granskar dig medan han överväger. 'Hundra kronor, så får du kartan och vi slipper slåss.' Erbjuder han tillslut.",
      choices: [
        {
          text: "Betala för kartan.",
          nextNodeId: "ambushDeal",
          effects: [
            { type: "removeGold", amount: 100 },
            { type: "setStoryFlag", flag: "banditCamp.mapBought", value: true },
            { type: "unlockLocation", locationId: "banditCamp" },
          ],
        },
        {
          text: "Det är för dyrt.",
          nextNodeId: "ambushDemand",
        },
      ],
    },

    ambushCannotBuyMap: {
      id: "ambushCannotBuyMap",
      text: "Rövaren granskar dig medan han överväger. 'Hundra kronor, så får du kartan och vi slipper slåss.' Erbjuder han tillslut.",
      choices: [
        {
          text: "Jag har inte tillräckligt med pengar.",
          nextNodeId: "ambushDemand",
        },
      ],
    },

    ambushDeal: {
      id: "ambushDeal",
      text: "De tre ser på varandra och sedan på pengarna i din hand. Det är tydligt att ingen av dem vill slåss, inte här, inte mot dig. De har trots allt redan flytt en gång. Rövaren nickar kort. 'Okej.' Han rotar i fickan och räcker dig en hoprullad tygkarta. Du viker upp den. Den visar skogen med landmärken, några som du känner igen, och en tunn linje som leder rakt till lägret. Du lägger över en påse med 100 Kroner, och de springer iväg ut i skogen utan ett ord till.",
      choices: [
        {
          text: "Återvänd till stigen.",
          effects: [{ type: "endAdventure" }],
        },
      ],
    },
  },
};
