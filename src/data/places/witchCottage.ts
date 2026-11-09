import type { AdventureNode } from "../adventureTypes";

export const witchCottage: Record<string, AdventureNode> = {
  intro: {
    id: "intro",
    text: "Du följer en smal stig längre och längre bort från byn, tills träden öppnar sig i en liten glänta. Där ligger häxans stuga, och du stannar och beundrar den. Det ser ut som att hon bor i en enorm svamp. Eller så är det en gammal timmerstuga med en jättelik svamp som vuxit upp på taket, för väggarna är så täckta av rankor, mossa och blommor att det är svårt att se vad som är byggt av människohand. Ingen stängsel omger tomten, men gräset i en cirkel runt stugan har en annan färg, djupare och mer glänsande än gräset utanför. I cirkeln står stenar med jämna mellanrum, och på varje sten finns en symbol ritad i något rött. Färgen är mörk och intorkad. Är det blod? Ur skorstenen stiger en tunn rök.",
    choices: [
      {
        text: "Undersök stenarna.",
        nextNodeId: "witchStones",
      },
      {
        text: "Gå fram och knacka på dörren.",
        nextNodeId: "witchDoor",
        condition: {
          type: "storyFlag",
          flag: "mainstory.witch.introStarted",
          value: false,
        },
        effects: [
          { type: "setStoryFlag", flag: "mainstory.witch.found", value: true },
        ],
      },
      {
        text: "Gå fram och knacka på dörren.",
        nextNodeId: "witchMushroomCheck",
        condition: {
          type: "storyFlag",
          flag: "mainstory.witch.introStarted",
          value: true,
        },
      },
      {
        text: "Gå tillbaka till byn.",
        effects: [
          {
            type: "endAdventure",
          },
        ],
      },
    ],
  },
  witchMushroomCheck: {
    id: "witchMushroomCheck",
    text: "Du knackar på dörren. Innan knackningen har ebbat ut ropar Melander inifrån, utan att öppna: 'Har du hittat svampen?'",
    choices: [
      {
        text: "Ja, jag har den.",
        nextNodeId: "witchMushroomReturn",
        effects: [{ type: "spawnLoot", itemId: "health_potion" }],
        condition: {
          type: "hasItem",
          itemId: "magicMushroom",
        },
      },
      {
        text: "Nej, inte än.",
        nextNodeId: "witchMushroomNo",
      },
    ],
  },

  witchMushroomNo: {
    id: "witchMushroomNo",
    text: "'Då har du inget här att göra,' skriker Melander genom dörren. 'Kom tillbaka när du har den!' Det klirrar i en burk där inne, och sedan hörs inget mer.",
    choices: [
      {
        text: "Lämna stugan.",
        effects: [
          {
            type: "endAdventure",
          },
        ],
      },
    ],
  },

  witchStones: {
    id: "witchStones",
    text: "Du böjer dig ned över en av stenarna. Symbolen är en spiral med korslagda streck, ritad med en säker hand. Färgen luktar järn och torkade örter. När du håller handen över stenen känner du en svag värme som inte borde finnas i höstkylan. Runt cirkeln finns inga spår efter monster, inte ens ett avtryck, som om skogens varelser medvetet håller sig på avstånd. Det här är ett skydd. Du vet inte hur du vet det, men du är säker på det.",
    choices: [
      {
        text: "Tillbaka.",
        nextNodeId: "intro",
      },
    ],
  },

  witchDoor: {
    id: "witchDoor",
    text: "Du går över gräset och känner hur luften förändras när du kliver in i cirkeln, som att gå in i ett varmare rum. Du knackar. Tystnad. Du knackar igen, och då hörs steg där inne, följda av en gnällig röst. 'Vem står där? Jag har inte beställt något, och jag köper ingenting.' Dörren förblir stängd.",
    choices: [
      {
        text: "Marie skickade mig.",
        nextNodeId: "witchMarie",
        condition: {
          type: "storyFlag",
          flag: "mainstory.witch.started",
          value: true,
        },
        effects: [
          {
            type: "setStoryFlag",
            flag: "mainstory.witch.sentByMarie",
            value: true,
          },
        ],
      },
      {
        text: "Förlåt att jag stör. Får jag säga några ord?",
        nextNodeId: "witchPolite",
      },
      {
        text: "Öppna dörren och kliv in.",
        nextNodeId: "witchIntrude",
      },
      {
        text: "Gå tillbaka till byn.",
        effects: [
          {
            type: "endAdventure",
          },
        ],
      },
    ],
  },

  witchPolite: {
    id: "witchPolite",
    text: "Det blir tyst en stund. 'Artig,' mumlar rösten tillslut. 'Det var nytt.' Låset klickar och dörren öppnas på glänt. En mycket gammal kvinna med vitt hår och skarpa, mörka ögon kikar ut genom springan. Hon granskar dig från topp till tå, som om hon läste en bok. 'Folk från byn brukar antingen slita i dörren eller lämna en liten offerhög på trappan och springa. Jag brukar inte öppna för främlingar.' Hon snörpar på munnen. 'Men jag är nyfiken. Tala, och fatta dig kort.'",
    choices: [
      {
        text: "Fortsätt.",
        nextNodeId: "witchTalk",
      },
    ],
  },

  witchIntrude: {
    id: "witchIntrude",
    text: "Du trycker ned handtaget och öppnar dörren utan att vänta. Innanför är det varmt och mörkt, med torkade örter som hänger från takbjälkarna och hyllor fulla av burkar. Vid bordet sitter en mycket gammal kvinna med vitt hår och skarpa, mörka ögon, och hon ser inte det minsta förvånad ut. 'Jag hörde dig vid stenarna,' säger hon tyst. 'Och ändå trampar du in i mitt hem. Dörrar är till för att knackas på.' Det blir plötsligt kallt i rummet, och ljuset i fönstren dunkar till. 'Du har tur att jag är nyfiken. Annars hade du legat kvar på gräset.' Hon lutar sig tillbaka. 'Nå. Vad vill du?'",
    choices: [
      {
        text: "Fortsätt.",
        nextNodeId: "witchTalk",
      },
    ],
  },

  witchMarie: {
    id: "witchMarie",
    text: "Det blir tyst bakom dörren, och sedan hörs ett nyckelklickande. Dörren öppnas, och en mycket gammal kvinna med vitt hår och skarpa, mörka ögon tittar ut. 'Marie?' Hon rynkar pannan. 'Vilken Marie... Åh.' Något mjuknar i hennes ansikte. 'Den lilla bokmalen med jord under naglarna, som aldrig kunde hålla sig borta från mina örter. Lever hon fortfarande?' Hon snörper på munnen. 'Och har hon skickat dig hit för att be mig om något? Sådant brukar kosta.' Hon öppnar dörren helt och går åt sidan. 'Kom in, då. Men torka fötterna.'",
    choices: [
      {
        text: "Fortsätt.",
        nextNodeId: "start",
        effects: [
          {
            type: "setStoryFlag",
            flag: "mainstory.witch.sentByMarie",
            value: true,
          },
          {
            type: "setStoryFlag",
            flag: "mainstory.witch.introComplete",
            value: true,
          },
        ],
      },
    ],
  },

  witchTalk: {
    id: "witchTalk",
    text: "Melander betraktar dig tyst. Stugan bakom henne är full av burkar, torkade växter och gamla böcker. 'Nå?' säger hon otåligt. 'Jag har inte hela dagen.'",
    choices: [
      {
        text: "Presentera dig.",
        nextNodeId: "witchIntroduce",
      },
      {
        text: "Behöver du hjälp med något?",
        nextNodeId: "witchOffer",
        effects: [
          {
            type: "setStoryFlag",
            flag: "mainstory.witch.offeredHelp",
            value: true,
          },
        ],
      },
      {
        text: "Jag behöver din hjälp.",
        nextNodeId: "witchAskHelp",
      },
      {
        text: "Lämna stugan.",
        effects: [
          {
            type: "endAdventure",
          },
        ],
      },
    ],
  },

  witchIntroduce: {
    id: "witchIntroduce",
    text: "Du presenterar dig: den som växte upp på gården vid skogsbrynet och just återvänt hem från kriget. Melander lyssnar utan att avbryta, och blicken hennes skärps. 'Ingen av byns små skrämda ansikten, alltså,' mumlar hon. 'En soldat. Du har sett saker. Det syns.' Hon knäpper långsamt fingrarna mot bordsskivan. 'Det är ovanligt att någon kommer hit utan att peka med fingret eller be om något.'",
    choices: [
      {
        text: "Tillbaka.",
        nextNodeId: "witchTalk",
      },
    ],
  },

  witchOffer: {
    id: "witchOffer",
    text: "Melander höjer ett ögonbryn. 'Hjälp? Jag?' Det går en stund. 'Folk kommer aldrig hit för att erbjuda något. De kommer för att be.' Hon sneglar på dig, och mungipan rycker. 'Det var ovanligt artigt.' Hon vänder sig om och gnolar för sig själv. 'Jag behöver inte hjälp med något jag inte klarar själv. Men jag har ett jobb, och du tycks inte vara av det vanliga slaget.'",
    choices: [
      {
        text: "Fortsätt.",
        nextNodeId: "witchJob",
      },
    ],
  },

  witchAskHelp: {
    id: "witchAskHelp",
    text: "'Min hjälp?' Melander fnyser. 'Byn är inte mitt problem. Det är inte du heller.' Hon gör en avvisande gest med handen. 'Alla kommer hit och vill ha något, och ingen frågar vad jag själv behöver.' Hon sänker blicken och stannar mitt i en rörelse. 'Men, nu när du säger det...'",
    choices: [
      {
        text: "Fortsätt.",
        nextNodeId: "witchJob",
      },
    ],
  },

  witchJob: {
    id: "witchJob",
    text: "'Det här är inte en tjänst,' säger Melander. 'Det är ett jobb. Jag behöver en särskild svamp för en av mina brygder. Den växer bara djupt inne i skogen, men något har slagit sig ned precis där jag brukar plocka den, och jag tänker inte gå dit själv.' Hon lutar sig fram. 'Hitta svampen. Kom tillbaka med den hel. Då ska vi se vad du är för en.'",
    choices: [
      {
        text: "Jag tar tag i det.",
        effects: [
          {
            type: "setStoryFlag",
            flag: "mainstory.witch.introStarted",
            value: true,
          },
          { type: "unlockLocation", locationId: "witchIntroQuest" },
          { type: "endAdventure" },
        ],
      },
    ],
  },

  start: {
    id: "start",
    text: "Du kliver in i stugan. Värmen och doften av örter och rök slår emot dig. Melander står böjd över en stor kittel som puttrar och bubblar och rör i den med en lång träslev. Hon nickar åt dig utan att se upp. 'Så, vad vill du?'",
    choices: [
      {
        text: "Köp och sälj.",
        nextNodeId: "start",
        effects: [
          {
            type: "openTrader",
            traderId: "witch",
          },
        ],
      },
      {
        text: "Fråga om Trollskogen.",
        nextNodeId: "witchMainQuest",
      },
      {
        text: "Har du jobb till mig?",
        nextNodeId: "witchSideQuests",
      },
      {
        text: "Kan du berätta om min framtid?",
        nextNodeId: "witchFortune",
      },
      {
        text: "Jag har frågor om dig.",
        nextNodeId: "witchPrivate",
      },
      {
        text: "Lämna stugan.",
        effects: [
          {
            type: "endAdventure",
          },
        ],
      },
    ],
  },

  witchSideQuests: {
    id: "witchSideQuests",
    text: "Melander rör i kitteln och tiger.",
    choices: [{ text: "Tillbaka.", nextNodeId: "start" }],
  },

  witchMushroomReturn: {
    id: "witchMushroomReturn",
    text: "Dörren öppnas, och Melander sträcker ut handen utan ett ord. Du lägger svampen i den. Hon vänder den mellan fingrarna och luktar på den. 'Hm. Den här duger.' Hon erbjuder en läkande dryck i utbyte. 'Du kan vara till användning, kom in.'",
    choices: [
      {
        text: "Okej...",
        nextNodeId: "start",
        effects: [
          { type: "removeItem", itemId: "magicMushroom" },
          {
            type: "setStoryFlag",
            flag: "mainstory.witch.introComplete",
            value: true,
          },
        ],
      },
    ],
  },

  witchFortune: {
    id: "witchFortune",
    text: "Melander lägger ned slevet och tar din hand i sin. Hennes grepp är torrt som pergament men förvånansvärt starkt. Hon blundar och tittar sedan in i kitteln. 'Jag ser inga händelser, inga dagar eller namn. Så fungerar det inte.' Hon rynkar pannan och trycker fingrarna hårdare mot din handflata. 'Men jag känner det. Du har ett öde, ett viktigt syfte. Det är sällsynt.' Hon öppnar ögonen och tittar rakt på dig. 'Säg mig, är du en hjälte, eller en förstörare?'",
    choices: [
      {
        text: "Jag är en hjälte.",
        nextNodeId: "witchFortuneHero",
        effects: [
          { type: "setStoryFlag", flag: "path.hero", value: true },
          { type: "setStoryFlag", flag: "path.avenger", value: false },
        ],
      },
      {
        text: "Jag är en hämnare.",
        nextNodeId: "witchFortuneAvenger",
        effects: [
          { type: "setStoryFlag", flag: "path.avenger", value: true },
          { type: "setStoryFlag", flag: "path.hero", value: false },
        ],
      },
    ],
  },

  witchFortuneHero: {
    id: "witchFortuneHero",
    text: "Melander nickar långsamt. 'Hjälte. Det är ett vackert ord.' Hon släpper din hand. 'Jag dömer dig inte, vilket svar du än hade gett. Men lyssna på en gammal kvinna.' Hennes blick blir allvarlig. 'Var försiktig. Inte för din egen skull, utan för dem du har omkring dig. Det är de som får betala när ett öde går fel.' Hon vänder sig tillbaka mot kitteln. 'Det var allt.'",
    choices: [
      {
        text: "Tack.",
        nextNodeId: "start",
      },
    ],
  },

  witchFortuneAvenger: {
    id: "witchFortuneAvenger",
    text: "Melander nickar långsamt, utan att se förvånad ut. 'Hämnare. Jag trodde det.' Hon släpper din hand. 'Jag dömer dig inte, vilket svar du än hade gett. Men lyssna på en gammal kvinna.' Hennes blick blir allvarlig. 'Var försiktig. Inte för din egen skull, utan för dem du har omkring dig. Eld sprider sig, och det är sällan den som tänder den som bränns först.' Hon vänder sig tillbaka mot kitteln. 'Det var allt.'",
    choices: [
      {
        text: "Tack.",
        nextNodeId: "start",
      },
    ],
  },

  witchPrivate: {
    id: "witchPrivate",
    text: "Melander slutar röra i kitteln och ger dig en lång blick. 'Privata frågor? Det är ovanligt. Fråga, men jag lovar inga svar.'",
    choices: [
      {
        text: "Vad kommer namnet Melander ifrån?",
        nextNodeId: "witchPrivateName",
      },
      {
        text: "Hur känner du Marie?",
        nextNodeId: "witchPrivateMarie",
      },
      {
        text: "Vad tycker du om byborna?",
        nextNodeId: "witchPrivateVillagers",
      },
      {
        text: "Tillbaka.",
        nextNodeId: "start",
      },
    ],
  },

  witchPrivateName: {
    id: "witchPrivateName",
    text: "'Melander var min mans efternamn.' Hon ler snett. 'Jag gifte mig med honom för länge sedan. Våra familjer bestämde det, och det fanns ingen kärlek i det, men han var en trevlig man. Jag minns knappt hans ansikte nu.' Hon tystnar och ser in i kitteln. 'Mitt eget förnamn gav jag bort till en älva, i utbyte mot kunskap som jag aldrig ångrat.' Hon ser upp. 'Så nu har jag inget namn kvar, förutom hans.'",
    choices: [
      {
        text: "Tillbaka.",
        nextNodeId: "witchPrivate",
      },
    ],
  },

  witchPrivateMarie: {
    id: "witchPrivateMarie",
    text: "Melanders ansikte mjuknar något. 'Marie? Hon var bara ett barn när jag först träffade henne. Hennes far var bagare, och hennes mor brukade ta med fika och sitta i mitt kök och prata i timmar.' Hon skakar på huvudet. 'Det var närmast en vän jag haft på flera hundra år. Och Marie hängde vid mina burkar och frågade om allt.' Du funderar på att fråga hur gammal hon egentligen är, men du kommer på dig själv med att tänka på grodor, och låter bli.",
    choices: [
      {
        text: "Tillbaka.",
        nextNodeId: "witchPrivate",
      },
    ],
  },

  witchPrivateVillagers: {
    id: "witchPrivateVillagers",
    text: "Melander fnyser. 'Byborna? Vissa av dem är trevliga nog, och jag vill inte leva helt ensam ute i vildmarken. Det har jag prövat, länge.' Hon pekar med slevet mot fönstret. 'Men jag tycker inte om hur rädsla och panik gör dem till djur. Så fort de möter något de inte förstår blir de arga och farliga.' Hon skakar på huvudet. 'Jag ser det okända på raka motsatta sättet. Jag vill förstå det, inte slå sönder det.'",
    choices: [
      {
        text: "Tillbaka.",
        nextNodeId: "witchPrivate",
      },
    ],
  },

  witchMainQuest: {
    id: "witchMainQuest",
    text: "Melander rör i kitteln och tiger.",
    choices: [{ text: "Tillbaka.", nextNodeId: "start" }],
  },
};
