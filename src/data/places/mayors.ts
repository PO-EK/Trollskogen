import type { AdventureNode } from "../adventureTypes";

export const mayors: Record<string, AdventureNode> = {
  intro: {
    id: "intro",
    text: "Borgmästarens hus är ett elegant tvåvåningshus. Det är inte jättestort, men betydligt mer välbyggt än de flesta andra husen i byn, med snidade detaljer kring dörren och en liten veranda. Här finns inga barrikader eller kringstaplade möbler, men fönsterluckorna är stängda och ingenting rör sig utanför. Det enda tecknet på liv är röken som stiger ur skorstenen. Någon verkar vara hemma.",
    choices: [
      {
        text: "Ok",
        nextNodeId: "start",
        effects: [
          { type: "setStoryFlag", flag: "mayors.IntroSeen", value: true },
          { type: "addExperience", amount: 10 },
        ],
      },
    ],
  },

  start: {
    id: "start",
    text: "Du står framför ytterdörren till borgmästarens eleganta hus.",
    choices: [
      {
        text: "Knacka på.",
        nextNodeId: "mayorsKnock",
      },
      {
        text: "Återvänd till byn.",
        effects: [
          {
            type: "endAdventure",
          },
        ],
      },
    ],
  },

  mayorsKnock: {
    id: "mayorsKnock",
    text: "Det är tyst en lång stund. Du knackar en gång till, lite hårdare, och hör hur någon rör sig där inne. Ett golv knarrar, och sedan hörs en dämpad kvinnoröst genom dörren. 'Vad vill du?'",
    choices: [
      {
        text: "Vad har hänt med byn?",
        nextNodeId: "mayorsVillage",
      },
      {
        text: "Behöver du hjälp med något?",
        nextNodeId: "mayorsHelp",
      },
      {
        text: "Ulf skickade mig för att se om du är okej. Jag har med mig mat, får jag komma in?",
        nextNodeId: "mayorsInside",
        condition: {
          type: "storyFlag",
          flag: "newleader.started",
          value: true,
        },
      },
      {
        text: "Återvänd till byn.",
        effects: [
          {
            type: "endAdventure",
          },
        ],
      },
    ],
  },

  mayorsVillage: {
    id: "mayorsVillage",
    text: "'Gå till värdshuset,' säger rösten tonlöst. 'Där kan de berätta allt du vill veta. Lämna mig ifred.' Sedan hörs steg som avlägsnar sig från dörren.",
    choices: [
      {
        text: "Fortsätt.",
        nextNodeId: "mayorsLeave",
      },
    ],
  },

  mayorsHelp: {
    id: "mayorsHelp",
    text: "'Jag klarar mig,' svarar rösten efter en paus. Den låter trött. 'Fråga någon annan. Det finns många som behöver det mer än jag.' Sedan hörs steg som avlägsnar sig från dörren.",
    choices: [
      {
        text: "Fortsätt.",
        nextNodeId: "mayorsLeave",
      },
    ],
  },

  mayorsLeave: {
    id: "mayorsLeave",
    text: "Du står kvar framför dörren en stund. Ingenting mer hörs inifrån huset. Hon verkar vilja vara ensam, och det låter inte som att hon behöver något.",
    choices: [
      {
        text: "Återvänd till byn.",
        effects: [
          {
            type: "endAdventure",
          },
        ],
      },
    ],
  },

  mayorsInside: {
    id: "mayorsInside",
    text: "Det blir tyst på andra sidan dörren. Sedan hörs ett nyckelhasplande, och dörren öppnas på glänt. En kvinna i svart klänning tittar ut. Hennes ögon är rödkantade och håret ostyrigt, men hon står rak i ryggen. Blicken fastnar på korgen i din hand. 'Ulf...' mumlar hon. 'Den gamle ängeln. Kom in, innan någon ser dig stå där.'",
    choices: [
      {
        text: "Tack.",
        nextNodeId: "mayorsFika",
      },
    ],
  },

  mayorsFika: {
    id: "mayorsFika",
    text: "Innanför dörren är huset tyst och mörkt, med fönsterluckor som stängts för länge sedan. Det ligger damm på mattorna, och borgmästarens kappa hänger fortfarande på kroken i hallen, som om han bara gått ut en stund. Britt för dig in i köket, ställer korgen på bordet och sätter på kaffe. 'Jag har kanelbullar. Jag bakade i förrgår, tror jag. Eller var det i förra veckan?' Hon dukar fram två koppar, sätter sig och stirrar ned i bordsskivan. 'Förlåt. Jag vet inte vad jag ska säga. Folk har slutat prata med mig, eller så säger de bara att de är ledsna.'",
    choices: [
      {
        text: "Jag är ledsen för din förlust.",
        nextNodeId: "mayorsCondolence",
      },
      {
        text: "Berätta om honom.",
        nextNodeId: "mayorsStory",
      },
    ],
  },

  mayorsCondolence: {
    id: "mayorsCondolence",
    text: "'Tack,' säger Britt tyst. 'Det säger alla. Jag tackar, och sedan blir det tyst.' Hon rör om i sin kopp utan att dricka. Klockan på väggen tickar högt i tystnaden.",
    choices: [
      {
        text: "Berätta om honom.",
        nextNodeId: "mayorsStory",
      },
    ],
  },

  mayorsStory: {
    id: "mayorsStory",
    text: "Britt tittar upp, och för första gången syns det något annat än sorg i hennes ansikte. 'Honom? Ingen har frågat det.' Hon lutar sig tillbaka. 'Vi träffades på midsommarfesten när jag var sjutton. Han var en blyg skrivare, och han kom fram med en bukett tistlar för att han inte hittat några blommor. Jag skrattade åt honom i en hel minut, och sedan dansade vi hela kvällen.' Hon ler och torkar en tår. 'Han skrev små lappar och gömde i mina fickor, långt efter att vi gift oss. Jag hittade en så sent som förra månaden. Han var ingen hjälte. Han var rädd för höjder och åskväder. Men när monstren kom ställde han sig i vägen ändå, för att någon måste.' Rösten bryts. 'Jag älskade honom mer än jag kan säga. Och nu är huset så tyst.' Hon tar ett djupt andetag. 'Förlåt, jag pratar bara om mig själv. Du har ju varit borta i fem år. Hur är det med din gård?'",
    choices: [
      {
        text: "Mina föräldrar är döda. Jag fick veta det igår. Sorgen driver mig att hjälpa folk.",
        nextNodeId: "mayorsHero",
        effects: [{ type: "setStoryFlag", flag: "path.hero", value: true }],
      },
      {
        text: "Det var ingen olycka. En varelse dödade dem, och den ska betala dyrt.",
        nextNodeId: "mayorsAvenger",
        effects: [{ type: "setStoryFlag", flag: "path.avenger", value: true }],
      },
    ],
  },

  mayorsHero: {
    id: "mayorsHero",
    text: "Britt lägger sin hand över din. 'Jag minns dina föräldrar. Din mor kom med hemgjord sylt varje höst, och din far höll alltid upp dörren för mig på marknaden.' Hon skakar på huvudet. 'Att komma hem efter alla år och möta det... Och ändå är det du som sitter här och tänker på andra. Jag skäms nästan.'",
    choices: [
      {
        text: "Fortsätt.",
        nextNodeId: "mayorsDecide",
      },
    ],
  },

  mayorsAvenger: {
    id: "mayorsAvenger",
    text: "Britt ser länge på dig. 'Jag känner igen den blicken. Jag har haft den i en vecka, fast jag har inget att rikta den mot.' Hon knyter handen på bordet. 'Din mor och far var goda människor. De borde ha fått bli gamla.' Hon andas ut tungt. 'Jag har tänkt mörka tankar om vad jag skulle vilja göra med de där varelserna.'",
    choices: [
      {
        text: "Fortsätt.",
        nextNodeId: "mayorsDecide",
      },
    ],
  },

  mayorsDecide: {
    id: "mayorsDecide",
    text: "Britt reser sig och går fram till fönstret, men öppnar inte luckan. 'Jag vet vad ni vill, du och Ulf. Att jag ska komma ut och leda.' Hon vänder sig om. 'Men jag vet inte om jag kan. Jag orkar knappt klä på mig på morgnarna.' Hon tystnar. 'Vad skulle jag ens kunna göra?'",
    choices: [
      {
        text: "Folk är rädda. De behöver dig, så att inte fler förlorar sina älskade.",
        nextNodeId: "mayorsConvincedHope",
      },
      {
        text: "Rycka upp dig. Gör något åt det som tog honom ifrån dig.",
        nextNodeId: "mayorsConvincedAnger",
      },
    ],
  },

  mayorsConvincedHope: {
    id: "mayorsConvincedHope",
    text: "Britt blir stilla. 'Fler som förlorar sina älskade...' upprepar hon sakta. Hon tänker på kvinnorna från sybönen, på barnen, på Ulf och Marie. 'Jag har suttit här och sörjt en man, medan hela byn sitter och gör detsamma utan någon som håller dem samman.' Hon torkar ansiktet och rätar på sig. 'Du har rätt. Han skulle ha skämts över mig.' Hon ler svagt. 'Jag kommer.'",
    choices: [
      {
        text: "Fortsätt.",
        nextNodeId: "mayorsFarewell",
      },
    ],
  },

  mayorsConvincedAnger: {
    id: "mayorsConvincedAnger",
    text: "Britt stirrar på dig, och för en stund ser det ut som att hon ska kasta ut dig. Sedan flammar hennes ögon till. 'Jag är arg,' säger hon lågt. 'Jag är så arg på de där monstren och på allt våld och på att jag sitter här i ett mörkt hus och låter det äta upp mig.' Hon slår handflatan i bordet, hårdare än hon tänkt. 'Du har rätt. Jag kan inte sitta här. Jag ska göra något åt det.'",
    choices: [
      {
        text: "Fortsätt.",
        nextNodeId: "mayorsFarewell",
      },
    ],
  },

  mayorsFarewell: {
    id: "mayorsFarewell",
    text: "Britt följer dig till dörren och stannar i hallen. Hon tittar på kappan på kroken, rör vid den ett ögonblick och tar sedan ett steg bort. 'Säg till Ulf att jag kommer förbi värdshuset snart. Jag måste bara tvätta ansiktet först.' Hon räcker fram korgen, tom nu, och försöker le. 'Tack för att du kom.'",
    choices: [
      {
        text: "Lämna huset.",
        effects: [
          { type: "setStoryFlag", flag: "newleader.convinced", value: true },
          { type: "lockLocation", locationId: "mayors" },
          { type: "endAdventure" },
        ],
      },
    ],
  },
};
