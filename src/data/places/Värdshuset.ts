import type { AdventureNode } from "../adventureTypes";

export const vardshuset: Record<string, AdventureNode> = {
  intro: {
    id: "intro",
    text: "På det lilla torget i byns centrum står den gamla brunnen, och bredvid den reser sig byns största byggnad: Värdshuset. Fönstren är igenspikade och porten förstärkt, det ser mer ut som ett fort än ett värdshus. Framför de stora dubbeldörrarna står en vakt med spjut. Du känner igen honom. Det är Lars, Ulfs son, några år yngre än du. Du minns honom från gruppen av barn som lekte tillsammans, även om ni aldrig var nära vänner.",
    choices: [
      {
        text: "Gå fram till Lars.",
        nextNodeId: "villageLars",
        effects: [
          { type: "setStoryFlag", flag: "vardshuset.IntroSeen", value: true },
        ],
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
      { text: "Vad är det här för ställe nu?", nextNodeId: "villageLarsInn" },
      { text: "Jag vill hjälpa byn.", nextNodeId: "villageLarsFather" },
      {
        text: "Jag vill ha hämnd för mina föräldrar.",
        nextNodeId: "villageLarsFather",
      },
    ],
  },
  villageLarsVillage: {
    id: "villageLarsVillage",
    text: "Lars blir allvarlig. 'Det har blivit värre för varje natt sedan borgmästaren dödades förra veckan. Ingen leder oss nu. Hans fru Britt har stängt in sig i deras hus och släpper inte in någon. Alla tänker bara på sitt eget, och folk ser på varandra som om grannen vore nästa hot.' Han ser ned på sitt spjut. 'Jag vet inte hur länge vi håller så här.'",
    choices: [{ text: "Tillbaka.", nextNodeId: "villageLars" }],
  },
  villageLarsInn: {
    id: "villageLarsInn",
    text: "'Värdshuset är sjukhus och skyddsrum nu,' säger Lars och nickar mot dörren bakom sig. 'De som blivit utan hus bor här, och de skadade ligger inne i matsalen. Vi har barrikerat så gott vi kan. Det är det enda stället i byn som känns någorlunda tryggt.'",
    choices: [{ text: "Tillbaka.", nextNodeId: "villageLars" }],
  },
  villageLarsFather: {
    id: "villageLarsFather",
    text: "Lars tänker en stund och rynkar pannan. 'Om du menar allvar, så borde du prata med min far. Han känner alla här och vet mer än han låter på.' Han tvekar. 'Pappa har alltid varit för snäll och givmild för sitt eget bästa. Folk ber honom om saker, och han säger aldrig nej. Jag är rädd att de tar för sig av honom tills inget är kvar.' Han vänder sig om, lyfter tillbaka slåen och öppnar dörren. 'Gå in. Och tack för att du är här.'",
    choices: [{ text: "Gå in i Värdshuset.", nextNodeId: "villageInside" }],
  },
  villageInside: {
    id: "villageInside",
    text: "Inne är det varmt och luktar av örtsalvor och rök. Borden och stolarna har flyttats undan eller byggts om till sjuksängar. Längs väggarna ligger skadade bybor med bandage, och deras nära och kära sitter vid deras sida med fuktiga trasor. Någon stönar, någon viskar. En äldre kvinna med grått hår uppsatt i en knut får syn på dig och kommer fram. 'Behöver du hjälp? Är du skadad?'",
    choices: [{ text: "Jag letar efter Ulf.", nextNodeId: "villageMarie" }],
  },
  villageMarie: {
    id: "villageMarie",
    text: "'Ulf? Min man står bakom baren och räknar tunnor som om det skulle få dem att räcka längre.' Hon ler trött. 'Jag är Marie, förresten. Säg till om du behöver något.' Hon återvänder snabbt till de skadade och hungriga.",
    choices: [{ text: "Gå fram till baren.", nextNodeId: "villageUlf" }],
  },
  villageUlf: {
    id: "villageUlf",
    text: "Bakom baren står en gammal man med vitt skägg och går igenom rader av tunnor och säckar, en penna bakom örat. Han ser upp när du närmar dig och lägger ned pennan. \n\nDu presenterar dig, och Ulf ler brett. 'Jag vet vem du är. Du är från gården vid skogsbrynet. Jag hörde att det första du gjorde när du kom hem från kriget var att skrämma bort ett stort troll som var på väg att äta upp byns boskap.' Han skakar din hand med båda sina. 'Gudarna vare tack att du är här. Vi behöver hjälp, och det är ingen skam att erkänna det.'",
    choices: [{ text: "Hur ser läget ut?", nextNodeId: "villageUlfSituation" }],
  },
  villageUlfSituation: {
    id: "villageUlfSituation",
    text: "'Värre än du kan se.' Ulf lutar sig mot baren och sänker rösten. 'Monstren kommer från Trollskogen nästan varje natt nu. De tar boskap, bränner ladugårdar och dödar den som står i vägen. Borgmästaren försökte organisera en vakt och blev dödad för en vecka sedan. Sedan dess har ingen vågat ta ledningen.' Han suckar. 'Vi har fyllt värdshuset med skadade och hemlösa, men maten tar slut, och medicinerna med.' Han tvekar. 'En sak till. Utanför byn bor en häxa. Trollen och monstren vågar sig aldrig nära hennes lilla stuga, så hon klarar sig nog.'",
    choices: [{ text: "En häxa?", nextNodeId: "villageUlfWitch" }],
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
          { type: "endAdventure" },
          { type: "addExperience", amount: 42 },
        ],
      },
    ],
  },

  start: {
    id: "start",
    text: "Värdshuset är fyllt av värme och doften av örtsalvor och rök. Sjuksängar står där borden brukade vara, men bakom baren och bland sängarna hittar du ansikten du känner.",
    choices: [
      {
        text: "Prata med Ulf.",
        nextNodeId: "ulfStart",
      },

      {
        text: "Prata med Marie.",
        nextNodeId: "marieStart",
      },
      {
        text: "Prata med Lars.",
        nextNodeId: "larsStart",
      },
      {
        text: "Lämna Värdshuset.",
        effects: [
          {
            type: "endAdventure",
          },
        ],
      },
    ],
  },

  ulfStart: {
    id: "ulfStart",
    text: "Ulf ser upp från sina listor och lägger ifrån sig pennan. 'Där är du ju. Vad kan jag göra för dig?'",
    choices: [
      {
        text: "Jag behöver köpa provianter",
        nextNodeId: "ulfStart",
        effects: [
          {
            type: "openTrader",
            traderId: "innkeeper",
          },
        ],
      },
      {
        text: "Byn behöver en ledare.",
        nextNodeId: "ulfLeader",
        condition: {
          type: "storyFlag",
          flag: "newleader.started",
          value: false,
        },
      },
      {
        text: "Jag har pratat med Britt.",
        nextNodeId: "ulfLeaderDone",
        condition: [
          {
            type: "storyFlag",
            flag: "newleader.convinced",
            value: true,
          },
          {
            type: "storyFlag",
            flag: "newleader.complete",
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
  ulfLeaderDone: {
    id: "ulfLeaderDone",
    text: "Ulf blir alldeles stilla. 'Du fick henne att komma ut?' Han tar av sig pennan från örat, stoppar tillbaka den och tar av sig den igen. 'Hon kommer hit?' Du nickar och berättar att hon hälsar på Värdshuset snart. Ulf slår ihop händerna och ögonen blir blanka. 'Jag trodde aldrig att jag skulle få se det här. Tack. Byn har äntligen något att hoppas på.' Han skrattar tyst åt sig själv och klappar dig på axeln. 'Och jag slipper vara ledare. Det är det bästa jag hört på veckor.'",
    choices: [
      {
        text: "Det var det minsta jag kunde göra.",
        nextNodeId: "ulfStart",
        effects: [
          { type: "setStoryFlag", flag: "newleader.complete", value: true },
        ],
      },
    ],
  },
  ulfLeader: {
    id: "ulfLeader",
    text: "Ulf suckar och gnuggar sig i skägget. 'Det har jag tänkt på varje kväll sedan borgmästaren dog. Folk springer åt alla håll och ingen vet vem man ska lyssna på. Det går inte i längden.'",
    choices: [
      {
        text: "Folk kommer redan till dig för hjälp. Du borde leda dem.",
        nextNodeId: "ulfLeader2",
      },
    ],
  },

  ulfLeader2: {
    id: "ulfLeader2",
    text: "Ulf skrattar till, men det låter mer nervöst än road. 'Jag? Nej, nej. Jag är ingen ledare.' Han tittar ned på sina händer. 'Jag är bra på att räkna tunnor, se till att folk får mat och tak över huvudet och hålla ordning på småsakerna. Det är bakom kulisserna jag gör nytta. Att stå framför alla och säga vad som ska göras...' Han skakar på huvudet. 'Det är inte jag. Och jag skulle bara svika dem.'",
    choices: [
      {
        text: "Har du någon annan i tankarna?",
        nextNodeId: "ulfBritt",
      },
    ],
  },

  ulfBritt: {
    id: "ulfBritt",
    text: "Ulf tänker en stund och nickar sedan långsamt. 'Britt. Borgmästarens fru.' Han lutar sig fram. 'Borgmästaren var alltid en byråkrat. Han skötte papper och beslut, och han var inte dålig på det. Men det var Britt som var den sociala. Hon ordnade möten så att alla fick komma till tals, hon kände varenda själ i byn, och alla tyckte om henne. Det var hon som startade stickgrupperna, sybönerna, bokklubbarna och allt det där. Kan vi få henne att komma hit och leda oss, så lyssnar byns kvinnor på henne direkt. Det är mer än halva byn.'",
    choices: [
      {
        text: "Varför gör hon inte redan det?",
        nextNodeId: "ulfBritt2",
      },
    ],
  },

  ulfBritt2: {
    id: "ulfBritt2",
    text: "Ulfs blick mörknar. 'Hon har stängt in sig i sorg sedan borgmästaren dog. De flesta av oss har varit där och knackat på, hon säger att hon vill vara ensam. Kanske har du mer tur.' Han går bort till ett skafferi bakom baren och packar en korg med bröd, ost, torkat kött och en flaska dryck. 'Ta med dig den här. Hon måste börja få slut på mat i det stora huset, och det är svårare att säga nej till någon som kommer med något.' Han räcker dig korgen. 'Snälla, försök. Byn behöver henne.'",
    choices: [
      {
        text: "Jag ska försöka prata med henne.",
        nextNodeId: "start",
        effects: [
          { type: "setStoryFlag", flag: "newleader.started", value: true },
        ],
      },
    ],
  },

  larsStart: {
    id: "larsStart",
    text: "Lars står kvar vid dörren, med ögonen på de igenspikade fönstren. 'Allt lugnt så länge solen är uppe,' säger han utan att vända sig om. 'Det är nätterna man oroar sig för.'",
    choices: [
      {
        text: "Hur kan vi stärka byns försvar?",
        nextNodeId: "larsWatch",
        condition: {
          type: "storyFlag",
          flag: "nattvakten.started",
          value: false,
        },
      },
      {
        text: "Nattvakten: Spjuten är klara. Smeden har dem.",
        nextNodeId: "larsSpears",
        condition: {
          type: "storyFlag",
          flag: "nattvakten.reportLars",
          value: true,
        },
      },
      {
        text: "Tillbaka.",
        nextNodeId: "start",
      },
    ],
  },
  larsSpears: {
    id: "larsSpears",
    text: "Lars stirrar på dig, och sedan sprider sig ett brett leende över hans ansikte. 'Redan? Tio spjut? Av gjutjärn?' Han skrattar förtjust och slår ihop händerna. 'Du anar inte vad det här betyder. Jag kan äntligen lova folk riktiga vapen! Det blir mycket lättare att få byborna att ställa upp när de vet att de inte går ut med tomma händer.' Han skakar på huvudet. 'Jag visste inte att det skulle gå så fort. Du är otrolig.'",
    choices: [
      {
        text: "Och du blir kapten över nattvakten.",
        nextNodeId: "larsCaptain",
        effects: [
          {
            type: "setStoryFlag",
            flag: "nattvakten.spearsDelivered",
            value: true,
          },
          { type: "addGold", amount: 100 },
          { type: "addExperience", amount: 100 },
          { type: "spawnLoot", itemId: "lars_steel_spear" },
        ],
      },
    ],
  },

  larsCaptain: {
    id: "larsCaptain",
    text: "Lars stannar mitt i en rörelse. 'Kapten?' Han blinkar och kan inte hålla tillbaka ett leende. 'Kapten Lars.' Han kliar sig i nacken och försöker se oberörd ut, men ögonen glittrar, och han måste rätta till sin hållning två gånger. 'Jag har aldrig... tack. Verkligen. Det betyder mer än du tror.' Han rotar i fickan och trycker en tung påse i din hand. 'Här, 100 Kroner. Det är allt jag har sparat. Och ta det här.' Han räcker dig sitt gamla spjut. 'Jag behöver det inte längre. Jag ska ha ett nytt, ett av de riktiga.'",
    choices: [
      {
        text: "Tack, Kapten Lars.",
        nextNodeId: "larsLeaves",
      },
    ],
  },

  larsLeaves: {
    id: "larsLeaves",
    text: "Lars rätar på sig och nickar allvarligt, som en riktig kapten. Sedan börjar han gå mot dörren, med rak rygg och huvudet högt, på väg mot smedjan för att ta en titt på sina nya spjut. Mitt på vägen tappar han fattningen och ler åt sig själv, och för ett ögonblick ser han ut som den pojke du minns från leken på torget.",
    choices: [
      {
        text: "Uppdrag klart.",
        nextNodeId: "start",
        effects: [
          { type: "setStoryFlag", flag: "nattvakten.complete", value: true },
          { type: "setStoryFlag", flag: "nattvakten.reportLars", value: false },
        ],
      },
    ],
  },

  larsWatch: {
    id: "larsWatch",
    text: "Lars vänder sig om och hans ansikte lyser upp. 'Jag har tänkt på just det! Vi behöver en riktig nattvakt, så att inte alla sitter och darrar bakom sina barrikader.' Han gestikulerar hoppfullt. 'Tänk dig svärd och tung rustning till varje vakt! Smeden skulle kunna smida dem på någon vecka.'",
    choices: [
      {
        text: "Det är brist på material. Det blir nog omöjligt.",
        nextNodeId: "larsWatch2",
      },
    ],
  },

  larsWatch2: {
    id: "larsWatch2",
    text: "Axlarna sjunker på Lars. 'Du har rätt, förstås. Metallen går åt till reparationer, och det finns knappt något kvar.' Han tänker efter. 'Okej, då något enklare. Yxor och högafflar? Folk har sådana hemma, men de behöver vässas och förstärkas.'",
    choices: [
      {
        text: "Vad sägs om spjut?",
        nextNodeId: "larsWatch3",
      },
    ],
  },

  larsWatch3: {
    id: "larsWatch3",
    text: "Lars öppnar munnen för att svara, men stannar. Han tittar ned på spjutet i sin hand och sedan på dig. 'Spjut...' Han skakar på huvudet och skrattar. 'Jag står här med ett i handen hela dagarna och kom inte på det själv. Vilken dumbom jag är.' Han blir ivrig. 'Det är perfekt! Smeden behöver bara smida spjutspetsar, kanske tio stycken, och sedan behöver vi trästavar till dem. Spjut är billigt, enkelt och man håller sig på avstånd från monstren. Jag kan lära byborna att använda dem. Jag är faktiskt ganska bra på det.' Han ser hoppfullt på dig. 'Kan du fråga smeden åt mig? Han lyssnar nog mer på dig än på mig.'",
    choices: [
      {
        text: "Jag pratar med smeden.",
        nextNodeId: "start",
        effects: [
          { type: "setStoryFlag", flag: "nattvakten.started", value: true },
          { type: "setStoryFlag", flag: "nattvakten.askSmith", value: true },
        ],
      },
    ],
  },

  marieStart: {
    id: "marieStart",
    text: "Marie sitter vid en sjukbädd och byter en blodig bandagering. Hon nickar åt dig utan att släppa den skadades hand. 'Behöver du något?'",
    choices: [
      {
        text: "Kan jag hjälpa dig på något sätt?",
        nextNodeId: "marieHelp",
        condition: {
          type: "storyFlag",
          flag: "mainstory.witch.started",
          value: false,
        },
      },
      {
        text: "Tillbaka.",
        nextNodeId: "start",
      },
    ],
  },

  marieHelp: {
    id: "marieHelp",
    text: "Marie suckar och torkar pannan med handryggen. 'Vi behöver allt. Rent tyg till bandage blir mer och mer ont om, och örter till medicin likaså. Utan dem kan vi inte göra mycket mer än att hålla folk varma.'",
    choices: [
      {
        text: "Jag kan samla tyg och örter åt dig.",
        nextNodeId: "marieHelp2",
      },
    ],
  },

  marieHelp2: {
    id: "marieHelp2",
    text: "Marie nickar, men tystnar sedan och ser ut över rummet fullt av sjuka. 'Det skulle hjälpa en stund. Men egentligen lappar vi bara ihop symptomen. Ju längre monstren kommer, desto fler skadas.' Hon skakar långsamt på huvudet. 'Vi måste hitta ett sätt att stoppa det som hänt skogen, inte bara bota dess offer.' Hon suckar djupt. 'Vi behöver Melanders hjälp.'",
    choices: [
      {
        text: "Vem är Melander?",
        nextNodeId: "marieMelander",
      },
    ],
  },

  marieMelander: {
    id: "marieMelander",
    text: "Marie ser sig runt och tar dig försiktigt i armen. 'Kom med mig. Det här är inget man pratar om högt.' Hon leder dig till ett tyst hörn bakom baren där ingen kan höra er. 'När jag var ung studerade jag växter och läkekonst tillsammans med en kvinna som heter Melander. Det är hennes riktiga namn. Byborna kallar henne bara för Häxan.' Hon tittar ned. 'Det var därför hon kom och hjälpte mig när jag blev sjuk. Med hennes hjälp kan vi läka folk här inne och stoppa att fler dör. Men det är bara början.' Hennes röst blir stadigare. 'Melander är gammal och vet allt om naturen och det övernaturliga. Jag är helt säker på att hon har ett gott hjärta, men hon är självisk och har levt för sig själv i många år. Om någon vet vad som är fel med skogen, så är det hon.' Hon ser allvarligt på dig. 'Besök henne och säg att Marie skickade dig. Men be inte om hjälp utan att erbjuda något tillbaka. Erbjud din hjälp först. Hon ger ingenting gratis.'",
    choices: [
      {
        text: "Jag tala med henne",
        nextNodeId: "start",
        effects: [
          {
            type: "setStoryFlag",
            flag: "mainstory.witch.started",
            value: true,
          },
          { type: "addExperience", amount: 10 },
        ],
      },
    ],
  },
};
