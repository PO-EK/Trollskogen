import type { AdventureNode } from "../adventureTypes";

export const vardshuset: Record<string, AdventureNode> = {
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
          { type: "unlockLocation", locationId: "mayors" },
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
        text: "Tillbaka.",
        nextNodeId: "start",
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
        ],
      },
    ],
  },
};
