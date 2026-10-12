import type { AdventureNode } from "../adventureTypes";

export const village: Record<string, AdventureNode> = {
  start: {
    id: "start",

    text: "Du står på det torget och ser över den lilla byn och dess invånare. De som går förbi hälsar och folk vinkar, de verkar vara väldigt glad att du är här.",

    choices: [
      {
        text: "Leta upp smeden",
        nextNodeId: "smedenStart",
        condition: {
          type: "storyFlag",
          flag: "healTheSmith.Complete",
          value: false,
        },
      },

      {
        text: "Gå in på Värdshuset",
        nextNodeId: "start",
      },
      {
        text: "Gå till snickaren",
        nextNodeId: "start",
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

  smedenStart: {
    id: "smedenStart",
    text: "Smedjan är i dåligt skick. Ingen verksamhet pågår här och på en stol sitter en skadad man med sitt förbundna ben upplagt på en pall. När du hälsar så rycker han till, som från sömnen, och tittar dig upp och ned. 'Är det inte den stora hjälten, jag ser? Vad vill du?' Han låter bitter och varje ord dryper av sarkasm.",

    choices: [
      {
        text: "Jag försöker skydda byn, kan du hjälpa?",
        nextNodeId: "smedenHelp",
        condition: {
          type: "storyFlag",
          flag: "healTheSmith.Started",
          value: false,
        },
      },
      {
        text: "Är du skadad?",
        nextNodeId: "smedenHurt",
        condition: {
          type: "storyFlag",
          flag: "healTheSmith.Started",
          value: false,
        },
      },
      {
        text: "Behöver du en läkande dryck för dina skador?",
        nextNodeId: "smedenHeal",
        condition: {
          type: "storyFlag",
          flag: "healTheSmith.Started",
          value: true,
        },
        effects: [
          {
            type: "openQuestContainer",
            questId: "healTheSmith",
            acceptedItemId: "health_potion",
          },
        ],
      },
      {
        text: "Jag ville bara hälsa. Hej då.",
        nextNodeId: "start",
      },
    ],
  },
  smedenHurt: {
    id: "smedenHurt",
    text: "'Nä, jag har bara på mig dessa bandage för att det var så kallt ute.' säger han sarkastiskt. Han verkar ha dåligt tålamod för dumma frågor.",
    choices: [
      {
        text: "Okej?",
        nextNodeId: "smedenStart",
      },
    ],
  },

  smedenHelp: {
    id: "smedenHelp",
    text: "Smeden skrattar till, men börjar snart hosta och håller sig om sidan. Smeden ser allvarligt på dig och säger 'Du kan inte hjälpa dem som inte vill hjälpa sig själv. När dessa problem började så gjorde varje man och kvinna i denna by ett val, och de valde att endast bry sig om sig själv och det som är deras.' Han verkar ganska bitter mot de andra i byn.",
    choices: [
      {
        text: "De är endast vanligt folk, de vet inte bättre. Vi måste hjälpa dem.",
        nextNodeId: "smedenHelp2",
      },
      {
        text: "Folkmassor är panikslagna djur, de behöver en stark hand som kan leda dem rätt.",
        nextNodeId: "smedenHelp2",
      },
      {
        text: "Så du vill lägga dig ned och dö istället för att kämpa?",
        nextNodeId: "smedenHelp2",
      },
    ],
  },

  smedenHelp2: {
    id: "smedenHelp2",
    text: "Smeden öppnar sin mun men inga ord kommer ut. Han stirrar på dig en stund och sedan ser ut över den förstörda byn. Han förblir tyst en stund tills han säger 'Min far brukade säga att de som har styrka nog att slåss för det rätta, borde göra det.''",
    choices: [
      {
        text: "Visar vi byborna att vi vill hjälpa dem, så kommer de hjälpa oss.",
        nextNodeId: "smedenHelp3",
      },
      {
        text: "Jag ska samla de starka och skapa en plan. Byborna har inget val än att följa.",
        nextNodeId: "smedenHelp3",
      },
      {
        text: "Denna by kommer inte klara sig länge utan sin smed.",
        nextNodeId: "smedenHelp3",
      },
    ],
  },

  smedenHelp3: {
    id: "smedenHelp3",
    text: "Efter en stund av djupt tänkande så sträcker smeden på sig och utbriser 'Jag börjar bli trött på att bara sitta, det är nog dags att köra igång smedja igen.' Han rycker till av smärta och håller sig om sidan. 'Kanske du kan hjälpa mig först?'",
    choices: [
      {
        text: "Jag återkommer när jag har något.",
        nextNodeId: "smedenStart",
        effects: [
          { type: "setStoryFlag", flag: "healTheSmith.Started", value: true },
        ],
      },
    ],
  },

  smedenHeal: {
    id: "smedenHeal",
    text: "'Jag kan inte göra mitt jobb i smedjan om jag knappt kan lyfta armarna.'",
    choices: [
      {
        text: "Ta denna och krya på dig.",
        nextNodeId: "start",
        condition: {
          type: "storyFlag",
          flag: "healTheSmith.Delivered",
          value: true,
        },
        effects: [
          {
            type: "setStoryFlag",
            flag: "healTheSmith.Complete",
            value: true,
          },
          {
            type: "unlockLocation",
            locationId: "blacksmith",
          },
        ],
      },
      {
        text: "Jag återvänder när jag har en Läkande Dryck.",
        nextNodeId: "start",
        condition: {
          type: "storyFlag",
          flag: "healTheSmith.Delivered",
          value: false,
        },
      },
    ],
  },
};
