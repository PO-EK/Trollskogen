import type { AdventureEncounter, AdventureNode } from "../adventureTypes";
import { foxfire } from "./encounters/foxfire";
import { quietClearing } from "./encounters/quietClearing";
import { bear } from "./encounters/bear";
import { boar } from "./encounters/boar";
import { wolverine } from "./encounters/wolverine";
import { ambusher } from "./encounters/ambusher";
import { bandit } from "./encounters/bandit";
import { mercenary } from "./encounters/mercenary";
import { ambush } from "./encounters/ambush";

const encounters: [AdventureEncounter, ...AdventureEncounter[]] = [
  quietClearing,
  foxfire,
  wolverine,
  boar,
  bear,
  bandit,
  ambusher,
  mercenary,
  ambush,
];
export const exploreForrestStartNodeIds = encounters.map(
  (encounter) => encounter.startNodeId,
);

export const exploreForrest: Record<string, AdventureNode> = Object.assign(
  {
    start: {
      id: "start",
      text: "Stigen smalnar av och leder dig bort från de vältrampade stigarna, in bland Trollskogens djupare delar. Helt plötsligt öppnar träden och du snubblar in i en glänta med en stor sten i mitten.",
      choices: [
        {
          text: "Utforska skogen.",
          effects: [
            {
              type: "startRandomEncounter",
              adventureId: "exploreForrest",
            },
          ],
        },
        {
          text: "Titta närmare på stenen.",
          nextNodeId: "runeStone",
        },
        {
          text: "Vänd tillbaka.",
          effects: [{ type: "endAdventure" }],
        },
      ],
    },

    runeStone: {
      id: "runeStone",
      text: "Du går fram till stenen. Den är nästan lika hög som du, av grå granit täckt av lav och mossa, och den står stadigt trots att den måste ha stått här i åratal. Hela ytan är full av runor som slingrar sig i täta band uppåt längs sidorna. De är ristade så djupt att de syns tydligt än i dag. Du har hört berättelser om sådana stenar. Det måste vara vikingarna som rest den, för hundratals år sedan. Du kan inte läsa ett enda tecken, men vissa symboler återkommer om och om igen, som om de var viktiga. Du lägger handen mot stenen. Den är kall, trots solen.",
      choices: [
        {
          text: "Kopiera runorna åt Melander.",
          nextNodeId: "runeStoneCopy1",
          condition: [
            {
              type: "storyFlag",
              flag: "mainstory.witch.lostKnowledgeTold",
              value: true,
            },
            {
              type: "storyFlag",
              flag: "mainstory.runes.copied",
              value: false,
            },
          ],
        },
        {
          text: "Tillbaka.",
          nextNodeId: "start",
        },
      ],
    },
    runeStoneCopy1: {
      id: "runeStoneCopy1",
      text: "Du bestämmer dig för att skriva av varje tecken, exakt som de står, och det kräver förberedelser. Först måste du ta bort allt som har vuxit in i skårorna genom åren. Du skrapar bort mossa och lav med kniven och borstar bort jord och barr med händerna, försiktigt, för att inte skada något. Bit för bit träder runorna fram, skarpa och djupa.\n\nDet tar lång tid. Sedan börjar själva avskriften. Du ritar av varje symbol, tittar på stenen, tittar på det du ritat och jämför. En enda felaktig linje kan betyda något helt annat, och Melander kan inte kontrollera mot stenen själv. Varje gång något inte stämmer börjar du om.\n\nSolen vandrar över himlen medan du arbetar, och din rygg värker av att ha stått böjd så länge.",
      choices: [{ text: "Fortsätt.", nextNodeId: "runeStoneCopy2" }],
    },

    runeStoneCopy2: {
      id: "runeStoneCopy2",
      text: "Till slut är du klar. Du går igenom alla tecken en sista gång och jämför med stenen, rad för rad, och de stämmer. Du andas ut och börjar packa ihop.\n\nDå hör du steg. Grenar knakar, och en man kliver ut i gläntan, i slitna kläder med ett vapen vid sidan. Han stannar när han ser stenen, och ett brett leende sprider sig över hans ansikte. 'Äntligen,' säger han. 'Där är den ju.'\n\nHan har inte sett dig än, eller så bryr han sig inte.",
      choices: [
        {
          text: "Fråga varför han letar efter stenen.",
          nextNodeId: "runeStoneCopy3",
        },
      ],
    },

    runeStoneCopy3: {
      id: "runeStoneCopy3",
      text: "Mannen ser på dig, överraskad, och sedan på pappren i din hand. 'Varför?' Han rycker på axlarna. 'Hövdingen beordrade oss att leta igenom skogen efter stenar med runor på. Alla ska förstöras. Jag vet inte varför, och jag frågar inte.'\n\nHans leende försvinner, och han lägger handen på sitt vapen. 'Men jag har också order om att ta död på alla som står i vägen.'",
      choices: [
        {
          text: "Försvara dig!",
          effects: [
            {
              type: "startCombat",
              enemyId: "bandit",
              winNodeId: "runeStoneWin",
              loseNodeId: "runeStoneLose",
            },
          ],
        },
      ],
    },

    runeStoneWin: {
      id: "runeStoneWin",
      text: "Rövaren faller ihop vid stenens fot. Du drar hans kropp in bland träden och täcker den med grenar och löv, så att ingen hittar den i första taget.\n\nDu ser tillbaka på stenen och på pappret i din hand. Varför vill rövarna förstöra den här informationen? Vad står det på stenen som någon inte vill att andra ska läsa?\n\nDu kontrollerar att pappret är oskadat och går tillbaka mot Melanders stuga.",
      choices: [
        {
          text: "Återvänd till häxan.",
          effects: [
            {
              type: "setStoryFlag",
              flag: "mainstory.runes.copied",
              value: true,
            },
            { type: "endAdventure" },
          ],
        },
      ],
    },

    runeStoneLose: {
      id: "runeStoneLose",
      text: "[PLATSHÅLLARE: förlorad strid.] Allt blir svart, och sedan vaknar du, tillbaka vid skogens kant.",
      choices: [
        {
          text: "Fortsätt.",
          effects: [{ type: "endAdventure" }],
        },
      ],
    },
  },
  ...encounters.map((encounter) => encounter.nodes),
);
