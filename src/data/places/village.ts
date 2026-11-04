import type { AdventureNode } from "../adventureTypes";

export const village: Record<string, AdventureNode> = {
  start: {
    id: "start",

    text: "Byn är i spillror. Flera hus är rasade eller övergivna, och de som står kvar är barrikerade med bräder, fat och uppstaplade möbler som blockerar stigarna mellan dem. Folk hastar förbi med hammare och spik, upptagna med att laga eller skydda sitt eget, och de ser misstänkt på dig och på varandra.",

    choices: [
      {
        text: "Nattvakten: Fråga runt om tjuven",
        nextNodeId: "villageAskAround",
        condition: {
          type: "storyFlag",
          flag: "nattvakten.askAround",
          value: true,
        },
        effects: [
          { type: "setStoryFlag", flag: "nattvakten.findTools", value: true },
        ],
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

  villageAskAround: {
    id: "villageAskAround",
    text: "Du går runt bland husen och barrikaderna och försöker fråga efter tjuven, men folk undviker din blick och skyndar in bakom sina dörrar när de ser dig komma. Du går fram till ett par som lagar en veranda och frågar om de sett någon springa från smedjan med armarna fulla. 'Nej,' säger mannen snabbt. 'Vi såg inget.' Kvinnan mumlar en ursäkt, och sedan skyndar de iväg. Du ser dig omkring och får syn på en äldre man som sitter i en gungstol utanför ett litet hus vid torget. Därifrån har han full uppsikt över smedjan på andra sidan. Det är värt ett försök.",
    choices: [
      {
        text: "Gå fram till den gamle mannen.",
        nextNodeId: "villageOldMan",
      },
    ],
  },

  villageOldMan: {
    id: "villageOldMan",
    text: "Gubben slutar gunga och ser misstänksamt på dig när du hälsar. 'Jaså, du är hjälten från skogsbrynet,' fräser han. Du frågar om han sett något vid smedjan. Han fnyser kaxigt. 'Jag ser allt härifrån. Jodå, jag såg någon springa därifrån med armarna fulla av saker.' Du frågar vart han tog vägen. Gubben tvekar och knackar sig på tinningen. 'Mitt minne är inte vad det varit. Kanske skulle det piggna på om jag fick något att minnas med.' Han gnuggar tummen mot fingrarna.",
    choices: [
      {
        text: "Betala honom 10 Kroner.",
        nextNodeId: "villageOldManPaid",
        effects: [{ type: "removeGold", amount: 10 }],
      },
      {
        text: "Hjälte: Smeden behöver verktygen för att skapa en byvakt som skyddar alla, även dig.",
        nextNodeId: "villageHeroLaugh",
      },
      {
        text: "Hämnare: Det finns ingen byvakt. Säg var han tog vägen, annars...",
        nextNodeId: "villageAvengerLaugh",
      },
    ],
  },

  villageHeroLaugh: {
    id: "villageHeroLaugh",
    text: "Gubben skrattar torrt. 'En byvakt? Jag har klarat mig utan en i sextio år, och nu ska du komma och prata om trygghet.' Han skakar på huvudet och börjar gunga igen. 'Folk har pratat om att göra något i veckor. Det blir aldrig något.'",
    choices: [
      {
        text: "Monstren kommer varje natt. Ingen är trygg, inte ens du.",
        nextNodeId: "villageHeroHesitate",
      },
    ],
  },

  villageHeroHesitate: {
    id: "villageHeroHesitate",
    text: "Skrattet tynar bort. Gubben tittar mot skogen och blir tyst. 'Jag hör dem på nätterna, vet du,' säger han till sist, mycket lägre. 'Klor mot husväggen. Jag har inte sovit en hel natt på länge.' Han drar händerna över armstöden och tvekar. 'Och om det blev en vakt? Skulle de vakta mitt hus också? Eller bara de rika husen vid torget?'",
    choices: [
      {
        text: "Försäkra honom om att nattvakten skyddar varje hus, även hans.",
        nextNodeId: "villageOldManTold",
      },
    ],
  },

  villageAvengerLaugh: {
    id: "villageAvengerLaugh",
    text: "Gubben stelnar till, men sedan hostar han fram ett skratt. 'Hotar du en gammal man i en gungstol? Jag har sett värre än du, kom ihåg det.' Han lutar sig tillbaka och gungar långsamt, men blicken har blivit vaksam.",
    choices: [
      {
        text: "Ingen skyddar dig. Det finns ingen vakt, och det är just den verktygen ska skapa.",
        nextNodeId: "villageAvengerHesitate",
      },
    ],
  },

  villageAvengerHesitate: {
    id: "villageAvengerHesitate",
    text: "Gungstolen står stilla. Gubben sväljer och tittar åt dörren, men ingen kommer ut ur huset. 'Du menar allvar,' säger han tyst. 'Det finns ingen här som skulle komma om jag ropade.' Han slickar sig om läpparna. 'Kan vi inte bara ta det lugnt?'",
    choices: [
      {
        text: "Luta dig fram och stoppa stolen med foten. 'Sista chansen.'",
        nextNodeId: "villageOldManTold",
      },
    ],
  },

  villageOldManTold: {
    id: "villageOldManTold",
    text: "Gubben suckar djupt och ger upp. 'Okej, okej! Du behöver inte stirra så.' Han pekar mot skogen med en skakig hand. 'Han sprang mot skogen med verktygen i famnen. Jag tippar på att han gömmer sig i den gamla skogshuggarstugan vid skogens gräns. Den har stått övergiven sedan i höstas.' Han kisar åt dig. 'Och nu får du lämna mig i fred.'",
    choices: [
      {
        text: "Tack. Jag letar vid skogshuggarstugan.",
        effects: [
          {
            type: "setStoryFlag",
            flag: "nattvakten.SawThiefHeadingToForest",
            value: true,
          },
          { type: "setStoryFlag", flag: "nattvakten.askAround", value: false },
          { type: "unlockLocation", locationId: "woodcuttersHut" },
          { type: "endAdventure" },
        ],
      },
    ],
  },

  villageOldManPaid: {
    id: "villageOldManPaid",
    text: "Gubben nappar åt sig mynten och stoppar ned dem i fickan med ett nöjt leende. 'Se där, nu minns jag lite bättre.' Han pekar mot skogen. 'Han sprang mot skogen med verktygen i famnen. Antagligen gömmer han sig i den gamla skogshuggarstugan vid skogens gräns. Den har stått övergiven sedan i höstas.' Han lutar sig tillbaka och börjar gunga. 'Trevligt att göra affärer.'",
    choices: [
      {
        text: "Tack. Jag letar vid skogshuggarstugan.",
        effects: [
          {
            type: "setStoryFlag",
            flag: "nattvakten.SawThiefHeadingToForest",
            value: true,
          },
          { type: "setStoryFlag", flag: "nattvakten.askAround", value: false },
          { type: "unlockLocation", locationId: "woodcuttersHut" },
          { type: "endAdventure" },
        ],
      },
    ],
  },
};
