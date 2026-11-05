import type { AdventureNode } from "../adventureTypes";
import { drop } from "../enemy";

export const woodcuttersHut: Record<string, AdventureNode> = {
  start: {
    id: "start",
    text: "Vägen leder genom ett kallhygge, ett stort sår i skogen med högar av avverkade stockar och vassa stubbar. Längre fram skymtar ett avdankat sågverk med fallfärdiga skjul, och intill ligger en liten stuga där skogshuggarna en gång bodde. Det är tyst, men ur stugans skorsten stiger ett tunt rökpuff.",
    choices: [
      {
        text: "Gå in i stugan.",
        nextNodeId: "hutInside",
      },
      {
        text: "Vänd tillbaka till byn.",
        effects: [
          {
            type: "endAdventure",
          },
        ],
      },
    ],
  },

  hutInside: {
    id: "hutInside",
    text: "Du öppnar dörren försiktigt och kliver in. Vid ett skrangligt bord sitter en mager man i slitna bykläder. Hans blick flackar när han ser dig, men han låtsas som ingenting och rör i en gryta. På bordet framför honom ligger smedens gjutformar, degeln och tängerna. Det måste vara den rädda och desperata mannen som smeden beskrev.",
    choices: [
      {
        text: "Jag vet att du tog verktygen. Jag har ett vittne.",
        nextNodeId: "hutFlees",
      },
    ],
  },

  hutFlees: {
    id: "hutFlees",
    text: "Mannens ansikte blir askgrått. I ett enda ryck sliter han åt sig verktygen, välter bordet mellan er och kastar sig mot fönstret. Glaset krossas när han tar sig ut.",
    choices: [
      {
        text: "Spring efter honom.",
        nextNodeId: "hutChase",
        effects: [
          { type: "setStoryFlag", flag: "nattvakten.FoundThief", value: true },
        ],
      },
    ],
  },

  hutChase: {
    id: "hutChase",
    text: "Du hoppar ut genom fönstret och ser honom försvinna in bland träden. Du springer efter, slingrar mellan trädstammar och snår, men skogen blir tätare och mörkare för varje steg. Till slut har du tappat bort honom. Du stannar och lyssnar, och letar efter brutna kvistar och fotavtryck i mossan. Då hör du det: ett skrik, högt och panikslaget, någonstans längre in.",
    choices: [
      {
        text: "Följ ljudet.",
        nextNodeId: "banditAmbush",
        effects: [
          {
            type: "setStoryFlag",
            flag: "nattvakten.FoundThiefKilled",
            value: true,
          },
        ],
      },
    ],
  },

  banditAmbush: {
    id: "banditAmbush",
    text: "Skriket tystnar tvärt. När du kommer fram till en liten glänta hör du röster som skrattar. Tjuven ligger livlös på marken. Två rövare klädda i läder och bälten står över honom, och en av dem håller smedens verktyg i famnen och gör sig lustig över den döde. 'Så snällt av honom att leverera själv!' skrattar han. De ser dig och tystnar. 'Ser man på, vi har tur idag,' säger den ene, och lyfter sin yxa. Han rusar mot dig.",
    choices: [
      {
        text: "Försvara dig!",
        effects: [
          {
            type: "startCombat",
            enemyId: "bandit",
            extraLoot: [],
            winNodeId: "banditOneDown",
            loseNodeId: "fightLost",
          },
        ],
      },
    ],
  },

  banditOneDown: {
    id: "banditOneDown",
    text: "Rövaren faller ihop med ett grymtande och blir liggande på marken. Hans kamrat slutar skratta och stirrar på honom. 'Du dödade honom!' skriker han, och ansiktet vrids av ilska. Han tappar verktygen i gräset, drar sitt vapen och rusar mot dig för att hämnas.",
    choices: [
      {
        text: "Försvara dig!",
        effects: [
          {
            type: "startCombat",
            enemyId: "ambusher",
            extraLoot: [drop("smedenTools")],
            winNodeId: "banditTwoDown",
            loseNodeId: "fightLost",
          },
        ],
      },
    ],
  },

  banditTwoDown: {
    id: "banditTwoDown",
    text: "Den andre rövaren sjunker ihop vid sidan av sin kamrat, och gläntan blir tyst igen. Du plockar upp smedens verktyg och kollar att inget saknas. Sedan går du fram till tjuven och ser över honom. Han ligger orörlig, och du är säker på att han inte lever längre. Det finns inget mer du kan göra för honom här. Du tar verktygen och går tillbaka genom skogen mot byn.",
    choices: [
      {
        text: "Återvänd till byn.",
        effects: [
          {
            type: "setStoryFlag",
            flag: "nattvakten.BanditDefeated",
            value: true,
          },
          { type: "setStoryFlag", flag: "nattvakten.returnTools", value: true },
          { type: "hideLocation", locationId: "woodcuttersHut" },
          { type: "endAdventure" },
        ],
      },
    ],
  },

  fightLost: {
    id: "fightLost",
    text: "Du använder din sista kraft för att fly!",
    choices: [
      {
        text: "Du kommer undan.",
        effects: [
          {
            type: "endAdventure",
          },
        ],
      },
    ],
  },
};
