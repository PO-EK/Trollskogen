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
    text: "Smeden suckar djupt när du frågar om han har tid att svara på dina frågor. Han verkar dock inte vara motståndig eftersom han lägger ned sitt verktyg och vänder sig mot dig. 'Vad vill du veta?'",
    choices: [
      {
        text: "Minns du mig?",
        nextNodeId: "smedenRemember",
      },
      {
        text: "Berätta om dig själv.",
        nextNodeId: "smedenBackstory",
      },
      {
        text: "Fråga om byn.",
        nextNodeId: "smedenVillage",
      },
      {
        text: "Har du jobb åt mig?",
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
  smedenRemember: {
    id: "smedenRemember",
    text: "Smeden stannar upp och ser på dig, längre än vad som är artigt. 'Om jag minns dig? Du var ett litet kryp som hängde över disken och frågade varför järn blir mjukt i elden. Jag hade aldrig tålamod, men du slutade aldrig fråga.' Mungipan rycker till. 'Du har samma envisa min som din far. Fem år, va? Jag trodde du var död, som så många andra som drog iväg till kriget. Men här står du.' Hans blick mörknar något. 'Jag är ledsen för det som hände på gården.'",
    choices: [
      {
        text: "Berätta om mina föräldrar.",
        nextNodeId: "smedenParents",
      },
      {
        text: "Tillbaka.",
        nextNodeId: "smedenAsk",
      },
    ],
  },

  smedenParents: {
    id: "smedenParents",
    text: "'Din far kom hit första vintern efter att taket brunnit av smedjan. Ingen hade bett honom. Han dök bara upp med yxa och en vagn timmer från skogskanten och sa att en by utan smed inte klarar sig.' Smeden skakar långsamt på huvudet. 'Som tack smidde jag hans lie och spadar utan att ta betalt, och sedan blev det en vana. Din mor kom med ost och bröd varje månad, och hon sa aldrig något om att vi var skyldiga varandra.' Han tystnar och stirrar på sina händer. 'Natten det hände hade jag just blivit skadad och låg i sjuksäng. Jag såg röken från fönstret, men benet bar mig inte. Och ingen annan gick. Inte en enda av dem.' Rösten sprack lite. 'Det är därför jag blev så bitter. Jag borde ha varit där.'",
    choices: [
      {
        text: "Det var inte ditt fel.",
        nextNodeId: "smedenAsk",
      },
      {
        text: "Jag behöver en stund.",
        nextNodeId: "smedenAsk",
      },
    ],
  },

  smedenBackstory: {
    id: "smedenBackstory",
    text: "Smeden lägger ned hammaren och torkar händerna på förklädet. 'Min far var smed före mig, och hans far före honom. Jag stod vid det här städet innan jag ens kunde lyfta hammaren ordentligt. Fick slå på kalla järnbitar tills jag lärt mig rytmen.' Han ler snett. 'Far sa alltid att ett svärd inte bryr sig om vem som håller det, men att smeden gör det. Därför sålde han aldrig till någon han inte litade på. Det gjorde oss inte rika.' Han skrattar kort, men blicken blir allvarlig. 'Under de här åren har jag slitit hårt för att hålla smedjan öppen, trots nätterna då vi hör vrål från skogen. Sedan kom skadan, och ingen frågade hur det stod till. Det är konstigt hur fort folk glömmer vad man gjort för dem.' Han skakar på huvudet. 'Men nog om det. Du fick upp mig på benen igen, och det glömmer jag inte.'",
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
    text: "Smeden går fram till dörröppningen och ser ut över byn med armarna i kors. 'Den var inte alltid så här, vet du. Förr hade vi marknad varje lördag, och det luktade nybakat från hus efter hus. Nu stänger folk sina dörrar vid skymning och hoppas att monstren väljer grannens hus istället. Gårdarna närmast Trollskogen var de första som föll.' Han gnuggar sig i nacken. 'Jag var förbannad på byborna länge. Tyckte att de fick skylla sig själva, att de lät de yttersta gårdarna brinna utan att lyfta ett finger. Men rädsla gör folk dumma, och jag satt själv i en stol och tyckte synd om mig.' Han tystnar en stund. 'Sedan du kom tillbaka har några börjat titta fram igen. Kanske finns det hopp för dem. Men säg inte till någon att jag sa det.' Han blinkar åt dig, men det går inte att avgöra om han skämtar.",
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
  smedenwork: {
    id: "smedenwork",
    text: "Du spenderar några timmar med att hjälpa smeden med olika sysslor. Din närvaro drar till sig nyfikna bybor och smeden lyckas boka nya jobb.",
    choices: [
      {
        text: "Du tjänar: 45 Kroner",
        effects: [
          {
            type: "addGold",
            amount: 45,
          },
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
