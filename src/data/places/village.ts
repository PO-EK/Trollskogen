import type { AdventureNode } from "../adventureTypes";

export const village: Record<string, AdventureNode> = {
  start: {
    id: "start",

    text: "Byn är i spillror. Flera hus är rasade eller övergivna, och de som står kvar är barrikerade med bräder, fat och uppstaplade möbler som blockerar stigarna mellan dem. Folk hastar förbi med hammare och spik, upptagna med att laga eller skydda sitt eget, och de ser misstänkt på dig och på varandra.",

    choices: [
      {
        text: "Gå till Borgmästarens hus",
        nextNodeId: "mayorIntro",
        condition: [
          {
            type: "storyFlag",
            flag: "newleader.started",
            value: false,
          },
          {
            type: "storyFlag",
            flag: "mayorFound",
            value: false,
          },
        ],
      },
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
        nextNodeId: "villageIntro",
        condition: {
          type: "storyFlag",
          flag: "village.introDone",
          value: false,
        },
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

  mayorIntro: {
    id: "mayorIntro",
    text: "Du hittar borgmästarens hus, det ser inte ut som någon är hemma.",
    choices: [
      {
        text: "Gå vidare",
        nextNodeId: "start",
        effects: [
          { type: "setStoryFlag", flag: "mayorFound", value: true },
          { type: "unlockLocation", locationId: "mayors" },
        ],
      },
    ],
  },
  villageIntro: {
    id: "villageIntro",
    text: "På det lilla torget i byns centrum står den gamla brunnen, och bredvid den reser sig byns största byggnad: Värdshuset. Fönstren är igenspikade och porten förstärkt, det ser mer ut som ett fort än ett värdshus. Framför de stora dubbeldörrarna står en vakt med spjut. Du känner igen honom. Det är Lars, Ulfs son, några år yngre än du. Du minns honom från gruppen av barn som lekte tillsammans, även om ni aldrig var nära vänner.",
    choices: [
      {
        text: "Gå fram till Lars.",
        nextNodeId: "villageLars",
      },
    ],
  },

  villageLars: {
    id: "villageLars",
    text: "Lars rätar på sig när du närmar dig, och hans ansikte lyser upp. 'Det är du! Jag såg dig i går natt, hur du fick trollet att vända innan det nådde boskapen. Jag stod bara där med mitt spjut och skakade.' Han skrattar nervöst. 'Du är en hjälte, vet du det? Det är gott att ha dig hemma igen.'",
    choices: [
      {
        text: "Vad är det som händer i byn?",
        nextNodeId: "villageLarsVillage",
      },
      {
        text: "Vad är det här för ställe nu?",
        nextNodeId: "villageLarsInn",
      },
      {
        text: "Jag vill hjälpa byn.",
        nextNodeId: "villageLarsFather",
      },
      {
        text: "Jag vill ha hämnd för mina föräldrar.",
        nextNodeId: "villageLarsFather",
      },
    ],
  },

  villageLarsVillage: {
    id: "villageLarsVillage",
    text: "Lars blir allvarlig. 'Det har blivit värre för varje natt sedan borgmästaren dödades förra veckan. Ingen leder oss nu. Hans fru Britt har stängt in sig i deras hus och släpper inte in någon. Alla tänker bara på sitt eget, och folk ser på varandra som om grannen vore nästa hot.' Han ser ned på sitt spjut. 'Jag vet inte hur länge vi håller så här.'",
    choices: [
      {
        text: "Tillbaka.",
        nextNodeId: "villageLars",
      },
    ],
  },

  villageLarsInn: {
    id: "villageLarsInn",
    text: "'Värdshuset är sjukhus och skyddsrum nu,' säger Lars och nickar mot dörren bakom sig. 'De som blivit utan hus bor här, och de skadade ligger inne i matsalen. Vi har barrikerat så gott vi kan. Det är det enda stället i byn som känns någorlunda tryggt.'",
    choices: [
      {
        text: "Tillbaka.",
        nextNodeId: "villageLars",
      },
    ],
  },

  villageLarsFather: {
    id: "villageLarsFather",
    text: "Lars tänker en stund och rynkar pannan. 'Om du menar allvar, så borde du prata med min far. Han känner alla här och vet mer än han låter på.' Han tvekar. 'Pappa har alltid varit för snäll och givmild för sitt eget bästa. Folk ber honom om saker, och han säger aldrig nej. Jag är rädd att de tar för sig av honom tills inget är kvar.' Han vänder sig om, lyfter tillbaka slåen och öppnar dörren. 'Gå in. Och tack för att du är här.'",
    choices: [
      {
        text: "Gå in i Värdshuset.",
        nextNodeId: "villageInside",
      },
    ],
  },

  villageInside: {
    id: "villageInside",
    text: "Inne är det varmt och luktar av örtsalvor och rök. Borden och stolarna har flyttats undan eller byggts om till sjuksängar. Längs väggarna ligger skadade bybor med bandage, och deras nära och kära sitter vid deras sida med fuktiga trasor. Någon stönar, någon viskar. En äldre kvinna med grått hår uppsatt i en knut får syn på dig och kommer fram. 'Behöver du hjälp, käraste? Är du skadad?'",
    choices: [
      {
        text: "Jag letar efter Ulf.",
        nextNodeId: "villageMarie",
      },
    ],
  },

  villageMarie: {
    id: "villageMarie",
    text: "'Ulf? Min man står bakom baren och räknar tunnor som om det skulle få dem att räcka längre.' Hon ler trött. 'Jag är Marie, förresten. Säg till om du behöver något.'",
    choices: [
      {
        text: "Gå fram till baren.",
        nextNodeId: "villageUlf",
      },
    ],
  },

  villageUlf: {
    id: "villageUlf",
    text: "Bakom baren står en gammal man med vitt skägg och går igenom rader av tunnor och säckar, en penna bakom örat. Han ser upp när du närmar dig och lägger ned pennan. Du presenterar dig, och Ulf ler brett. 'Jag vet vem du är. Du är från gården vid skogsbrynet. Jag hörde att det första du gjorde när du kom hem från kriget var att skrämma bort ett stort troll som var på väg att äta upp byns boskap.' Han skakar din hand med båda sina. 'Gudarna vare tack att du är här. Vi behöver hjälp, och det är ingen skam att erkänna det.'",
    choices: [
      {
        text: "Hur ser läget ut?",
        nextNodeId: "villageUlfSituation",
      },
    ],
  },

  villageUlfSituation: {
    id: "villageUlfSituation",
    text: "'Värre än du kan se.' Ulf lutar sig mot baren och sänker rösten. 'Monstren kommer från Trollskogen nästan varje natt nu. De tar boskap, bränner ladugårdar och dödar den som står i vägen. Borgmästaren försökte organisera en vakt och blev dödad för en vecka sedan. Sedan dess har ingen vågat ta ledningen.' Han suckar. 'Vi har fyllt värdshuset med skadade och hemlösa, men maten tar slut, och medicinerna med.' Han tvekar. 'En sak till. Utanför byn bor en häxa. Trollen och monstren vågar sig aldrig nära hennes lilla stuga, så hon klarar sig nog.'",
    choices: [
      {
        text: "En häxa?",
        nextNodeId: "villageUlfWitch",
      },
    ],
  },

  villageUlfWitch: {
    id: "villageUlfWitch",
    text: "'Många här tror att hon ligger bakom allt det här,' säger Ulf och skakar på huvudet. 'Men jag vet bättre. När Marie blev sjuk för många år sedan, så sjuk att ingen trodde hon skulle klara sig, var det häxan som kom med örter och botade henne. Hon tog knappt betalt.' Hans blick mjuknar. 'Folk är rädda och behöver någon att skylla på. Jag säger inte att du ska lita på henne. Bara att jag har skäl att inte döma henne.'",
    choices: [
      {
        text: "Jag ska hålla det i minnet.",
        nextNodeId: "villageIntroEnd",
        effects: [
          { type: "setStoryFlag", flag: "village.heardOfWitch", value: true },
        ],
      },
    ],
  },

  villageIntroEnd: {
    id: "villageIntroEnd",
    text: "Ulf klappar dig på axeln. 'Värdshuset står öppet för dig, när du än behöver det. Vi har inte mycket, men det du behöver ska du få så långt det räcker.'",
    choices: [
      {
        text: "Tack, Ulf.",
        effects: [
          { type: "setStoryFlag", flag: "village.introDone", value: true },
          { type: "unlockLocation", locationId: "vardshuset" },
          { type: "endAdventure" },
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
          {
            type: "addExperience",
            amount: 31,
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
