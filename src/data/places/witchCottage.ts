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
  start: {
    id: "start",
    text: "Du kliver in i stugan. Värmen och doften av örter och rök slår emot dig. Melander står böjd över en stor kittel som puttrar och bubblar och rör i den med en lång träslev. Hon nickar åt dig utan att se upp. 'Så, vad vill du?'",
    choices: [
      {
        text: "Skuggan är besegrad.",
        nextNodeId: "witchShadowReturn1",
        condition: [
          { type: "storyFlag", flag: "mainstory.shadow.sealed", value: true },
          {
            type: "storyFlag",
            flag: "mainstory.shadow.reported",
            value: false,
          },
        ],
      },
      {
        text: "Fråga vad runorna säger.",
        nextNodeId: "witchRunesTold1",
        condition: [
          { type: "storyFlag", flag: "mainstory.runes.ready", value: true },
          {
            type: "storyFlag",
            flag: "mainstory.runes.deciphered",
            value: false,
          },
        ],
      },
      {
        text: "Angående rövarna...",
        nextNodeId: "witchBanditReminder",
        condition: [
          {
            type: "storyFlag",
            flag: "mainstory.runes.deciphered",
            value: true,
          },
          {
            type: "storyFlag",
            flag: "mainstory.banditChief.defeated",
            value: false,
          },
        ],
      },
      {
        text: "Jag har skrivit av runorna.",
        nextNodeId: "witchRunesGive1",
        condition: [
          { type: "storyFlag", flag: "mainstory.runes.copied", value: true },
          { type: "storyFlag", flag: "mainstory.runes.handedIn", value: false },
        ],
      },
      {
        text: "Hur går det med runorna?",
        nextNodeId: "witchRunesWait",
        condition: [
          { type: "storyFlag", flag: "mainstory.runes.handedIn", value: true },
          { type: "storyFlag", flag: "mainstory.runes.ready", value: false },
        ],
      },
      {
        text: "Fråga vad ni fick ut av älvorna.",
        nextNodeId: "witchLostKnowledge1",
        condition: [
          { type: "storyFlag", flag: "mainstory.elves.contacted", value: true },
          {
            type: "storyFlag",
            flag: "mainstory.witch.lostKnowledgeTold",
            value: false,
          },
        ],
      },
      {
        text: "Angående runorna...",
        nextNodeId: "witchRunesReminder",
        condition: [
          {
            type: "storyFlag",
            flag: "mainstory.witch.lostKnowledgeTold",
            value: true,
          },
          { type: "storyFlag", flag: "mainstory.runes.copied", value: false },
        ],
      },

      {
        text: "Fråga om Trollskogen.",
        nextNodeId: "witchMainQuest",
        condition: {
          type: "storyFlag",
          flag: "mainstory.witch.nackenStarted",
          value: false,
        },
        effects: [
          {
            type: "setStoryFlag",
            flag: "mainstory.witch.askedAboutForest",
            value: true,
          },
        ],
      },
      {
        text: "Angående Näcken...",
        nextNodeId: "witchNackenReminder",
        condition: [
          {
            type: "storyFlag",
            flag: "mainstory.witch.nackenStarted",
            value: true,
          },
          { type: "storyFlag", flag: "mainstory.nacken.talked", value: false },
        ],
      },
      {
        text: "Jag har talat med Näcken.",
        nextNodeId: "witchNackenReport",
        condition: [
          { type: "storyFlag", flag: "mainstory.nacken.talked", value: true },
          {
            type: "storyFlag",
            flag: "mainstory.witch.nackenReported",
            value: false,
          },
        ],
      },
      {
        text: "Angående älvorna...",
        nextNodeId: "witchElvesWait",
        condition: [
          {
            type: "storyFlag",
            flag: "mainstory.witch.nackenReported",
            value: true,
          },
          { type: "storyFlag", flag: "mainstory.elves.ready", value: false },
        ],
      },
      {
        text: "Fråga om älvorna.",
        nextNodeId: "witchElvesReady",
        condition: [
          {
            type: "storyFlag",
            flag: "mainstory.witch.nackenReported",
            value: true,
          },
          { type: "storyFlag", flag: "mainstory.elves.ready", value: true },
          {
            type: "storyFlag",
            flag: "mainstory.elves.contacted",
            value: false,
          },
        ],
      },

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
        text: "Har du jobb till mig?",
        nextNodeId: "witchSideQuests",
        condition: {
          type: "storyFlag",
          flag: "witch.job.active",
          value: false,
        },
      },
      {
        text: "Angående jobbet du gav mig...",
        nextNodeId: "witchJobActive",
        condition: {
          type: "storyFlag",
          flag: "witch.job.active",
          value: true,
        },
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
        text: "Marie skickade mig.",
        nextNodeId: "witchMarie",
        condition: {
          type: "storyFlag",
          flag: "mainstory.witch.started",
          value: true,
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
    text: "'Det här är inte en tjänst,' säger Melander. 'Det är ett jobb. Jag behöver något jag inte tänker hämta själv, och du ser ut att ha två fungerande ben.' Hon lutar sig fram. 'Klarar du det, så ska vi se vad du är för en.'",
    choices: [
      {
        text: "Vad är det du behöver?",
        nextNodeId: "witchJobMushroom",
      },
    ],
  },

  witchSideQuests: {
    id: "witchSideQuests",
    text: "Melander slutar röra i kitteln och mönstrar dig från topp till tå. 'Jobb? Jag har tre saker jag inte orkar gå ut efter själv. Den första är enkel, den andra är det inte, och den tredje får du allt tänka efter före.' Hon pekar med slevet. 'Jag väljer inte åt dig. Fråga om det du vill veta mer om.'",
    choices: [
      {
        text: "Vad är enklast?",
        nextNodeId: "witchJobMushroom",
      },
      {
        text: "Vad är inte så enkelt?",
        nextNodeId: "witchJobWater",
      },
      {
        text: "Vad är det farliga jobbet?",
        nextNodeId: "witchJobGlass",
      },
      {
        text: "Tillbaka.",
        nextNodeId: "start",
      },
    ],
  },
  witchJobMushroom: {
    id: "witchJobMushroom",
    text: "'Den blå svampen,' säger Melander. 'Den växer i en grotta en bit in i skogen, där det alltid är fuktigt och luktar blöt päls. Vargar har tagit grottan i besittning, så du kommer inte dit obemärkt. Hämta svampen hel, så betalar jag.' Hon höjer blicken. 'Det är det lättaste jag har. Det betyder inte att det är ofarligt.'",
    choices: [
      {
        text: "Jag tar jobbet.",
        effects: [
          {
            type: "setStoryFlag",
            flag: "mainstory.witch.introStarted",
            value: true,
          },
          { type: "setStoryFlag", flag: "witch.job.active", value: true },
          { type: "setStoryFlag", flag: "witch.job.mushroom", value: true },
          { type: "unlockLocation", locationId: "witchIntroQuest" },
          { type: "endAdventure" },
        ],
      },
      {
        text: "Tillbaka.",
        nextNodeId: "witchSideQuests",
        condition: {
          type: "storyFlag",
          flag: "mainstory.witch.introComplete",
          value: true,
        },
      },
    ],
  },
  witchJobWater: {
    id: "witchJobWater",
    text: "'Vatten.' Melander fnyser. 'Inte vilket vatten som helst. Långt inne i skogen finns ett vattenfall där vattnet har något i sig som ingen brunn kan ge mig. Jag har försökt hämta det själv, men min rygg orkar inte längre med den vägen.' Hon sänker rösten. 'Vättar bor där, och de gillar inte besök. Och mylingar, barnens själar som inte fick någon vila. Låt dem aldrig hoppa upp på ryggen på dig, de blir tyngre för varje steg.' Hon tittar på dig. 'Fyll något som går att försluta och kom tillbaka med det.'",
    choices: [
      {
        text: "Jag tar jobbet.",
        effects: [
          { type: "setStoryFlag", flag: "witch.job.active", value: true },
          { type: "setStoryFlag", flag: "witch.job.water", value: true },
          { type: "unlockLocation", locationId: "waterfall" },
          { type: "endAdventure" },
        ],
      },
      {
        text: "Tillbaka.",
        nextNodeId: "witchSideQuests",
      },
    ],
  },

  witchJobGlass: {
    id: "witchJobGlass",
    text: "'Glas.' Melander säger ordet som om det vore ett dyrbart ämne. 'Flaskor, burkar, ampuller, allt slipat eller blåst av människohänder. Jag kan göra det mesta själv, men inte det. Det ger inte skogen.' Hon lutar sig fram. 'Rövarna plockar åt sig allt de hittar på vägen. Glas går sönder och väger, och går inte att sälja utan att väcka frågor, så de lägger det i ett gömt lager tillsammans med annat de inte kan använda. Jag har sett dem bära lådor dit om nätterna.' Hon rätar på sig. 'Jag vet var det ligger. Men det är deras, och de vaktar det.'",
    choices: [
      {
        text: "Jag tar jobbet.",
        effects: [
          { type: "setStoryFlag", flag: "witch.job.active", value: true },
          { type: "setStoryFlag", flag: "witch.job.glass", value: true },
          { type: "unlockLocation", locationId: "banditStash" },
          { type: "endAdventure" },
        ],
      },
      {
        text: "Tillbaka.",
        nextNodeId: "witchSideQuests",
      },
    ],
  },

  witchJobActive: {
    id: "witchJobActive",
    text: "Melander tittar upp. 'Du har redan ett jobb åt mig. Är det klart, eller står du bara här och tar min tid?'",
    choices: [
      // Lämna in
      {
        text: "Jag har den blå svampen.",
        nextNodeId: "witchJobMushroomReturn",
        condition: [
          { type: "storyFlag", flag: "witch.job.mushroom", value: true },
          { type: "hasItem", itemId: "magicMushroom" },
        ],
        effects: [
          { type: "removeItem", itemId: "magicMushroom" },
          { type: "setStoryFlag", flag: "witch.job.mushroom", value: false },
          { type: "setStoryFlag", flag: "witch.job.active", value: false },
          { type: "addGold", amount: 25 },
          { type: "addExperience", amount: 20 },
        ],
      },
      {
        text: "Jag har vattnet från vattenfallet.",
        nextNodeId: "witchJobWaterReturn",
        condition: [
          { type: "storyFlag", flag: "witch.job.water", value: true },
          { type: "hasItem", itemId: "magicWater" },
        ],
        effects: [
          { type: "removeItem", itemId: "magicWater" },
          { type: "setStoryFlag", flag: "witch.job.water", value: false },
          { type: "setStoryFlag", flag: "witch.job.active", value: false },
          { type: "addGold", amount: 60 },
          { type: "addExperience", amount: 50 },
        ],
      },
      {
        text: "Jag har glaset från rövarnas lager.",
        nextNodeId: "witchJobGlassReturn",
        condition: [
          { type: "storyFlag", flag: "witch.job.glass", value: true },
          { type: "hasItem", itemId: "witchGlassSet" },
        ],
        effects: [
          { type: "removeItem", itemId: "witchGlassSet" },
          { type: "setStoryFlag", flag: "witch.job.glass", value: false },
          { type: "setStoryFlag", flag: "witch.job.active", value: false },
          { type: "addGold", amount: 120 },
          { type: "addExperience", amount: 100 },
        ],
      },
      // Påminnelser
      {
        text: "Var var det jag skulle leta efter?",
        nextNodeId: "witchJobMushroomReminder",
        condition: {
          type: "storyFlag",
          flag: "witch.job.mushroom",
          value: true,
        },
      },
      {
        text: "Var var det jag skulle leta efter?",
        nextNodeId: "witchJobWaterReminder",
        condition: { type: "storyFlag", flag: "witch.job.water", value: true },
      },
      {
        text: "Var var det jag skulle leta efter?",
        nextNodeId: "witchJobGlassReminder",
        condition: { type: "storyFlag", flag: "witch.job.glass", value: true },
      },
      // Avbryt
      {
        text: "Jag kan inte ta det här jobbet.",
        nextNodeId: "witchJobAbandoned",
        effects: [
          { type: "setStoryFlag", flag: "witch.job.active", value: false },
          { type: "setStoryFlag", flag: "witch.job.mushroom", value: false },
          { type: "setStoryFlag", flag: "witch.job.water", value: false },
          { type: "setStoryFlag", flag: "witch.job.glass", value: false },
        ],
      },
      {
        text: "Tillbaka.",
        nextNodeId: "start",
      },
    ],
  },

  witchJobMushroomReminder: {
    id: "witchJobMushroomReminder",
    text: "'Grottan med de blå svamparna, där vargarna håller till,' säger Melander utan att se upp från kitteln. 'Du hittar den där det luktar fukt och det är för tyst. Plocka försiktigt.'",
    choices: [{ text: "Tillbaka.", nextNodeId: "witchJobActive" }],
  },

  witchJobWaterReminder: {
    id: "witchJobWaterReminder",
    text: "'Vattenfallet, djupt inne i skogen,' säger Melander. 'Ljudet hörs långt före det syns. Vättarna och mylingarna också, om du lyssnar noga. Se till att kunna stänga flaskan ordentligt.'",
    choices: [{ text: "Tillbaka.", nextNodeId: "witchJobActive" }],
  },

  witchJobGlassReminder: {
    id: "witchJobGlassReminder",
    text: "'Rövarnas gömda lager,' säger Melander lågt. 'Jag har märkt ut platsen åt dig. Det de inte kan sälja ligger där. Jag vill ha glaset, inte deras gunst. Låt dem inte se dig.'",
    choices: [{ text: "Tillbaka.", nextNodeId: "witchJobActive" }],
  },

  witchJobAbandoned: {
    id: "witchJobAbandoned",
    text: "Melander ger dig en lång blick och rör sedan i kitteln igen. 'Då har du ändå sparat mig besväret att räkna med dig. Kom tillbaka när du bestämt dig.'",
    choices: [{ text: "Tillbaka.", nextNodeId: "start" }],
  },

  witchJobMushroomReturn: {
    id: "witchJobMushroomReturn",
    text: "Melander tar svampen och vänder den mellan fingrarna, luktar på den och nickar kort. 'Hel. Bra.' Hon rotar i en ficka och trycker några mynt i din hand utan att räkna dem. 'Kom tillbaka om du vill ha mer att göra.'",
    choices: [{ text: "Tack.", nextNodeId: "start" }],
  },

  witchJobWaterReturn: {
    id: "witchJobWaterReturn",
    text: "Melander tar flaskan och håller den mot ljuset. Vattnet skimrar svagt, och hennes ansikte mjuknar för ett ögonblick. 'Du har varit där, och du kom tillbaka med ryggen hel.' Hon sluter handen om flaskan. 'Det är mer än de flesta klarar.' Hon räcker över din betalning. 'Du har förtjänat den.'",
    choices: [{ text: "Tack.", nextNodeId: "start" }],
  },

  witchJobGlassReturn: {
    id: "witchJobGlassReturn",
    text: "Melander packar upp glaset försiktigt och granskar varje bit mot ljuset: flaskor, burkar, några små ampuller. Hon säger ingenting på en lång stund. 'Rövarna kommer märka att något saknas.' Ett litet leende kryper fram. 'Men det är deras problem. Du har gjort mig en stor tjänst.' Hon räcker över din betalning, mer än hon brukar.",
    choices: [{ text: "Tack.", nextNodeId: "start" }],
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
          { type: "setStoryFlag", flag: "witch.job.active", value: false },
          { type: "setStoryFlag", flag: "witch.job.mushroom", value: false },
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
    text: "Du frågar vad hon vet om skogen. Melander slutar röra i kitteln, och för en stund hörs bara det låga bubblandet. 'Vad som är fel vet jag inte,' säger hon till slut. 'Men jag kan nog gissa.' Hon ser mot fönstret, som om hon kunde se genom väggarna. 'Jag har gått i den här skogen längre än någon vill räkna. Jag har talat med träden och lyssnat på vinden, och i alla år fanns det en sorts harmoni. Allt hängde ihop, och allt visste sin plats.'",
    choices: [
      {
        text: "Och nu?",
        nextNodeId: "witchForestDarkness",
      },
      {
        text: "Tillbaka.",
        nextNodeId: "start",
      },
    ],
  },

  witchForestDarkness: {
    id: "witchForestDarkness",
    text: "'Nu är det annorlunda.' Rösten blir lägre. 'Ett mörker ligger över skogen. Även de vilda djuren är rädda, och jag har lärt mig läsa hur de beter sig. Det är en varelse, eller en skepnad, som utstrålar en sådan ondska att till och med trollen har lämnat sina grottor och flyr.' Hon skakar på huvudet. 'Trollen, som inte räds något. Jag vet inte vad det är, eller vem. Men jag vet hur man tar reda på det.' Hon sneglar på dig. 'Skogen har väsen som är lika gamla som skogen själv. De har alltid funnits här i harmoni med världen. Om inte en av dem är det som har blivit förvridet, så måste de veta vad som har gjort det.' Hon tystnar och tänker. Det går en lång stund. 'Näcken,' säger hon till slut. 'Du borde fråga Näcken.'",
    choices: [
      {
        text: "Berätta om Näcken.",
        nextNodeId: "witchNacken",
      },
      {
        text: "Tillbaka.",
        nextNodeId: "start",
      },
    ],
  },

  witchNacken: {
    id: "witchNacken",
    text: "'Ett övernaturligt vattenväsen, en man som spelar fiol.' Melander lyfter ett finger. 'Alla vet att om du hör någon spela fiol i skogen ska du INTE följa ljudet. Det leder till vatten eller myr, och där blir musiken så vacker att du kliver rakt ned och drunknar, med ett leende på läpparna.' Hon vänder sig mot hyllorna och börjar leta bland burkar och buntar, tills hon hittar vad hon söker. Hon håller upp en amulett: en rund träbit med runor inristade i rött, uppträdd på ett enkelt tvinnat snöre. 'Ha den på dig, och följ musiken i skogen. När du kommer till vatten och musiken blir högre, så stanna. Ropa ordet Nykr. Har du tur svarar han.'",
    choices: [
      {
        text: "Fortsätt.",
        nextNodeId: "witchNackenWarning",
      },
    ],
  },

  witchNackenWarning: {
    id: "witchNackenWarning",
    text: "'Men jag varnar dig,' säger Melander. 'Ta aldrig emot gåvor, och gör ingen överenskommelse. Det slutar inte väl.' Hon pausar och upprepar sina ord, långsamt, så att de ska fastna. 'Vad han än säger eller erbjuder är du bara där för information. Du svarar inte på hans frågor, och du tar inte emot hans gåvor. Blir han frustrerad kan han ljuga om dig, om mig eller om dem du känner. Reagera inte. Berömmer du hans musik och hans spelande tar han det väl, men tacka nej till varje erbjudande. När du är klar ber du om ursäkt för att du har saker att göra och lämnar platsen, fort, även om han försöker hindra dig. Ta dig bort från vattnet.' Hon tittar på dig. 'Även om du inte får veta något så kan vi åtminstone slå fast att han inte är det som har förvridits. Kom direkt tillbaka hit och berätta vad han sa.'",
    choices: [
      {
        text: "Jag gör det.",
        condition: {
          type: "storyFlag",
          flag: "mainstory.witch.nackenStarted",
          value: false,
        },
        effects: [
          {
            type: "setStoryFlag",
            flag: "mainstory.witch.nackenStarted",
            value: true,
          },
          {
            type: "setStoryFlag",
            flag: "mainstory.witch.complete",
            value: true,
          },
          {
            type: "setStoryFlag",
            flag: "mainstory.shadow.started",
            value: true,
          },
          { type: "unlockLocation", locationId: "nackenPond" },
          { type: "endAdventure" },
        ],
      },
      {
        text: "Jag vill tänka på saken.",
        nextNodeId: "start",
        condition: {
          type: "storyFlag",
          flag: "mainstory.witch.nackenStarted",
          value: false,
        },
      },
      {
        text: "Tillbaka.",
        nextNodeId: "witchNackenReminder",
        condition: {
          type: "storyFlag",
          flag: "mainstory.witch.nackenStarted",
          value: true,
        },
      },
    ],
  },

  witchNackenReminder: {
    id: "witchNackenReminder",
    text: "Melander tittar upp från kitteln. 'Har du talat med honom än? Följ fiolen, ropa Nykr vid vattnet, och kom direkt tillbaka.'",
    choices: [
      {
        text: "Kan du upprepa varningen?",
        nextNodeId: "witchNackenWarning",
      },
      {
        text: "Tillbaka.",
        nextNodeId: "start",
      },
    ],
  },

  witchNackenReport: {
    id: "witchNackenReport",
    text: "Melander lägger ned slevet redan när du kliver över tröskeln. 'Du kom tillbaka,' säger hon, med en ton som låter nästan förvånad. 'Berätta. Allt, i ordning.' Du berättar. Om Näckens ord, och om skuggan: ett väsen som gillade att skapa rädsla hos de dödliga, och som människorna som bodde här en gång bad älvorna om hjälp mot. Och hur älvorna lyckades fånga den och spärra in den. Melander lyssnar utan att avbryta, och när du är klar står hon tyst en lång stund. 'Skuggan,' säger hon till slut. 'Jag har aldrig hört talas om den.' Hon rynkar pannan. 'Och jag har hört talas om det mesta. Då måste det ha varit mycket länge sedan. Före mig, och före dem som lärde mig.'",
    choices: [
      {
        text: "Fortsätt.",
        nextNodeId: "witchNackenReport2",
      },
    ],
  },

  witchNackenReport2: {
    id: "witchNackenReport2",
    text: "Hon ser skarpt på dig. 'Erbjöd han dig något?' Du berättar att han bjöd på mer information mot en tjänst, och att du tackade nej. 'Bra.' Axlarna sjunker en aning. 'Det är sällan någon gör det.' Hon vänder sig mot kitteln, men rör inte i den. 'Älvorna,' säger hon långsamt. 'Näcken sa att de hjälpte folket som bodde här. Då kanske vi borde tala med dem också.' Hon snörper på munnen. 'Det är faktiskt rätt enkelt. Och betydligt mindre farligt än Näcken kan vara.'",
    choices: [
      {
        text: "Hur gör man?",
        nextNodeId: "witchNackenReport3",
      },
    ],
  },

  witchNackenReport3: {
    id: "witchNackenReport3",
    text: "'Man behöver instrument att spela, en trumma eller något liknande. Sedan går man upp tidigt på morgonen och letar upp en äng eller glänta där dimman ligger tjock.' Melander lyfter ett finger. 'Och man talar med dem där, i dimman. Det är mycket säkrare än att möta dem ansikte mot ansikte. En älva i vår värld är bara bekymmer.' Hon nickar mot hyllorna. 'Jag har redan allt som behövs. Kom tillbaka i morgon, så kontaktar vi dem.'",
    choices: [
      {
        text: "Jag kommer tillbaka i morgon.",
        nextNodeId: "start",
        effects: [
          {
            type: "setStoryFlag",
            flag: "mainstory.witch.nackenReported",
            value: true,
          },
          {
            type: "scheduleStoryFlag",
            flag: "mainstory.elves.ready",
            days: 1,
          },
        ],
      },
    ],
  },

  witchElvesWait: {
    id: "witchElvesWait",
    text: "Melander tittar knappt upp från kitteln. 'Älvorna? Det är inte morgon än. Dimman ligger inte tjock mitt på dagen, och jag tänker inte släpa dig dit när du inte är utvilad.' Hon gör en rörelse med handen. 'Kom tillbaka i morgon.'",
    choices: [{ text: "Tillbaka.", nextNodeId: "start" }],
  },
  witchElvesReady: {
    id: "witchElvesReady",
    text: "Melander går fram till fönstret och drar undan den smutsiga gardinen. Utanför ligger dimman tjock över gläntan, så tät att du knappt ser stenarna i cirkeln runt stugan. 'Titta på det där,' säger hon, med något som nästan liknar belåtenhet. 'Det är bra mycket dimma idag. Perfekt.' Hon vänder sig mot dig. 'Jag antar att du kommer för att fråga om älvorna.'",
    choices: [
      {
        text: "Har du allt vi behöver?",
        nextNodeId: "witchElvesReady2",
      },
      {
        text: "Tillbaka.",
        nextNodeId: "start",
      },
    ],
  },

  witchElvesReady2: {
    id: "witchElvesReady2",
    text: "'Jag sa ju det.' Melander rotar fram en liten handtrumma ur en av hyllorna. Skinnet är slitet och träramen mörk av gamla fingrar. Hon knyter en sjal om axlarna, tar sin käpp från hörnet och släpper in dagsljuset genom dörren. 'Kom nu, innan solen bränner bort dimman.'",
    choices: [
      {
        text: "Ge er av.",
        nextNodeId: "witchElvesWalk",
      },
    ],
  },

  witchElvesWalk: {
    id: "witchElvesWalk",
    text: "Ni lämnar stugan och går in bland träden. Melander är långsam, mycket långsammare än du hade trott. Hon går med käppen som stöd och stannar vid varje rot och sten för att hämta andan. Du måste ofta sakta ned dina steg för att inte lämna henne bakom dig. Ingen av er säger något. Dimman gör skogen tyst, och ljudet av era steg försvinner efter bara några meter. Du tillbringar tiden med att hålla uppsikt, med ena handen nära ditt vapen. Det kan gömma sig vad som helst i dimman: djur, banditer, eller något som kommit från det mörker som Melander talat om. Varje gren som knakar får dig att spänna dig. Men inget kommer.",
    choices: [
      {
        text: "Fortsätt.",
        nextNodeId: "witchElvesMeadow",
      },
    ],
  },

  witchElvesMeadow: {
    id: "witchElvesMeadow",
    text: "Till slut öppnar sig träden, och ni kommer ut på en äng. Dimman ligger så tät här att den känns som en vägg. Du ser knappt längre än några steg framför dig, och gräset runt dina stövlar är fuktigt och grått. Allt ljud är dämpat, som om världen höll andan. Melander stannar mitt på ängen och lutar sig tungt mot sin käpp. Hon andas djupt, och på hennes ansikte syns både ansträngning och något som liknar förväntan. 'Det här är platsen,' säger hon lågt. 'Här är det tunt mellan världarna.'",
    choices: [
      {
        text: "Fortsätt.",
        nextNodeId: "witchElvesRitual1",
      },
    ],
  },
  witchElvesRitual1: {
    id: "witchElvesRitual1",
    text: "Melander ställer sig framför dig och räcker över trumman. 'Lyssna nu,' säger hon, och slår en enkel rytm med knogarna mot sin egen handflata, i lågt tempo. Du upprepar den. Hon nickar och lutar sig bakåt. 'Bra. Håll den. Ändra den inte, och sluta inte förrän jag säger till.'\n\nDu sätter dig ned bekvämt vid skogskanten med trumman i knät och börjar spela. Rytmen är enkel och entonig, och i det låga tempot blir den nästan hypnotisk. Slag efter slag efter slag.",
    choices: [{ text: "Fortsätt.", nextNodeId: "witchElvesRitual2" }],
  },

  witchElvesRitual2: {
    id: "witchElvesRitual2",
    text: "Melander ställer sin käpp mot ett träd och går ut på ängen. Hon placerar sig mellan dig och dimman, med ryggen mot dig. Efter en stund börjar hon gnola på en sång som passar din rytm.\n\nDu känner inte igen orden, men precis som musiken är de enkla och entoniga, som en vers utan refräng som bara upprepar sig. Du fortsätter att spela.",
    choices: [{ text: "Fortsätt.", nextNodeId: "witchElvesRitual3" }],
  },

  witchElvesRitual3: {
    id: "witchElvesRitual3",
    text: "Plötsligt får du lust att dansa, vilket överraskar dig. Du upptäcker att du har börjat röra på huvudet i takt med rytmen utan att ha märkt det.\n\nMelander gnolar på och verkar gräva i sina fickor. Hon håller i något, men hon har ryggen mot dig, så du ser inte vad. Det du däremot börjar se är skepnader i dimman.",
    choices: [{ text: "Fortsätt.", nextNodeId: "witchElvesRitual4" }],
  },

  witchElvesRitual4: {
    id: "witchElvesRitual4",
    text: "Dimman låg först stilla, tung över gräset. Nu är det som om en vind har börjat blåsa, trots att det är helt vindstilla. Dimman svajar fram och tillbaka och tar nästan skepnad av armar och ben som rör sig i takt.\n\nBlinkar du till och fokuserar ser du ingenting, och allt är som vanligt. Men låter du dig tas av rytmen börjar du se dem i ögonvrån. Dimman formar sig till människor som dansar. De snurrar runt och rör sig, och viftar med armar och ben i en lugn takt.",
    choices: [{ text: "Fortsätt.", nextNodeId: "witchElvesRitual5" }],
  },

  witchElvesRitual5: {
    id: "witchElvesRitual5",
    text: "Sedan hör du en röst från dimman, mjuk och ljus men väldigt upprymd.\n\n'Åh, vilken fin musik. Man vill bara dansa!'\n\nFörst vet du inte vem som talade. Men plötsligt ser du en skepnad tydligare än någon av de andra: en kvinna i en vit klänning, med en krans i håret. Du har svårt att se var hennes kropp slutar och dimman börjar. Det verkar ändras för varje sekund.",
    choices: [{ text: "Fortsätt.", nextNodeId: "witchElvesRitual6" }],
  },

  witchElvesRitual6: {
    id: "witchElvesRitual6",
    text: "Melander tar till orda, och hennes röst är lugn och tydlig, trots rytmen i bakgrunden.\n\n'Det är jag, Melander. Minns ni mig?'\n\nDu fortsätter spela på trumman och väntar på svar.",
    choices: [{ text: "Fortsätt.", nextNodeId: "witchElvesTalk1" }],
  },
  witchElvesTalk1: {
    id: "witchElvesTalk1",
    text: "Dansen fortsätter, och skepnaden i dimman blir tydligare. Hon är nästan genomskinlig, men du kan se en kort och bred kvinna. Trots sin kraftiga gestalt rör hon sig som en ballerina, utan minsta ansträngning, och hon verkar njuta av varje rörelse. Du vet inte om det du ser är verkligt eller om ditt sinne bara försöker tolka dimman.\n\n'Åh, vår vän, vad har hänt? Du är krokig i ryggen, och ditt vackra röda hår har blivit vitt!'\n\nGenast hörs en annan röst från dimman. 'Röd som flammor, vacker som en blomma!' Det följs av fnissande. Du kan inte se dem, men det verkar vara en hel grupp älvor där ute i dimman, även om bara en av dem har en gestalt.",
    choices: [{ text: "Fortsätt.", nextNodeId: "witchElvesTalk2" }],
  },

  witchElvesTalk2: {
    id: "witchElvesTalk2",
    text: "En av rösterna föreslår: 'Ska vi göra henne ung och vacker igen?' Det är inte riktat till Melander. Det låter som en grupp barn som planerar sin nästa lek.\n\nMelander svarar inte direkt. Du undrar om hon tog illa upp, om hon funderar på sin egen ålder, eller om hon bara tänker ut nästa fråga. Du kan inte se hennes ansikte, så du har ingen aning om vad hon tänker eller känner. Men du litar på att hon vet bäst.",
    choices: [{ text: "Fortsätt.", nextNodeId: "witchElvesTalk3" }],
  },

  witchElvesTalk3: {
    id: "witchElvesTalk3",
    text: "'Jag är nöjd med det liv jag levt,' säger Melander till slut. 'Men nu ligger en skugga över vår skog. Vet ni något om den?'\n\nÄlvan dansar i takt med din trumma, och du ser fler skepnader som ansluter sig till dansen bakom henne.\n\n'Vad är en skugga?' fnissar en röst.\n\nMelander suckar. 'Innan vi träffades första gången, var det fler som ni talade med? Folk som behövde hjälp med en mörk skepnad?'",
    choices: [{ text: "Fortsätt.", nextNodeId: "witchElvesTalk4" }],
  },

  witchElvesTalk4: {
    id: "witchElvesTalk4",
    text: "Du hör ett mummel från dimman, som om älvorna talade med varandra. De fnissar och skrattar och dansar.\n\n'Jag minns!' ropar en av dem. 'De kom med gåvor och musik, när Myrkálfr lekte med dem!'\n\nÄlvorna skrattar, som om hela saken var ett roligt skämt.",
    choices: [{ text: "Fortsätt.", nextNodeId: "witchElvesTalk5" }],
  },

  witchElvesTalk5: {
    id: "witchElvesTalk5",
    text: "Dansen saktar ned, och det är inte din trumma som har bromsat. Du börjar faktiskt bli lite trött i armarna av att hålla igång rytmen. Skepnaderna i dimman börjar avta och återvänder till att vara dimma.\n\nMelander vänder sig tvärt mot dig. 'Öka tempot!' ropar hon.\n\nDu spelar hårdare och snabbare. Älvorna börjar ta form i dimman igen, och du kan nu se minst tre kvinnor som dansar, och fler skepnader bakom dem. Du hör deras glädje över musiken. De dansar snabbare, vildare, skrattande och hurrande.",
    choices: [{ text: "Fortsätt.", nextNodeId: "witchElvesTalk6" }],
  },

  witchElvesTalk6: {
    id: "witchElvesTalk6",
    text: "'Berätta om Myrkalfer!' ber Melander. Hon försöker låta lugn, men du hör hur ivrig och desperat hon är efter mer information.\n\nÄlvorna skrattar högt åt hennes uttal och dansar glatt vidare.\n\n'Myrkálfr älskar hyss,' svarar den första älvan till slut, 'och att busa med män allra mest.'\n\nEn annan röst lägger till: 'Jag tror det var en av oss som tappade bort sig?'\n\n'Jag minns!' säger en tredje. 'Den hamnade på fel sida och blev Myrkálfr i stället för sig själv.' Det följs av ännu ett glatt skratt.",
    choices: [{ text: "Fortsätt.", nextNodeId: "witchElvesTalk7" }],
  },

  witchElvesTalk7: {
    id: "witchElvesTalk7",
    text: "Du kämpar för att hålla takten och känner dig irriterad över hur lite de verkar ta saker på allvar. Allt de säger verkar vara det roligaste de någonsin hört, som om allt vore ett skämt, även när de beskriver människor i fara.\n\n'De människor ni hjälpte,' säger Melander, 'ville de döda denna Myrkálfr?'\n\nI stället för skratt blir det förvirring bland älvorna. De tystnar en kort stund. 'Vad betyder döda?' viskar de till varandra. 'Vad är det?'",
    choices: [{ text: "Fortsätt.", nextNodeId: "witchElvesTalk8" }],
  },

  witchElvesTalk8: {
    id: "witchElvesTalk8",
    text: "En av älvorna verkar förstå, och hon svarar med en ovanligt allvarlig röst. 'Nej. För att dö måste man först leva.'\n\nDe andra älvorna brister ut i skratt och fniss.\n\n'Människorna behövde fånga skuggan,' fortsätter den allvarliga rösten, 'så vi lärde dem.'\n\n'Hur fångar man en skugga?' frågar Melander genast, kanske lite för ivrigt.\n\n'Ja, det lärde vi er.'\n\nMelander blir tyst en stund.",
    choices: [{ text: "Fortsätt.", nextNodeId: "witchElvesTalk9" }],
  },

  witchElvesTalk9: {
    id: "witchElvesTalk9",
    text: "Morgonsolen har hunnit högt upp på himlen, och dimman börjar försvinna. Trots att du spelar hårt och i högt tempo är älvorna nästan borta.\n\n'Tack, mina vänner,' säger Melander. 'Jag hoppas vi ses igen.'\n\nÄlvornas röster är svaga och avlägsna nu, och du tror att de låter besvikna, nästan sorgsna.\n\nMelander vänder sig mot dig och nickar. Du förstår att det är över, så du saktar ned tempot och slutar till slut helt.",
    choices: [{ text: "Fortsätt.", nextNodeId: "witchElvesTalk10" }],
  },

  witchElvesTalk10: {
    id: "witchElvesTalk10",
    text: "Med trötta armar och en stel kropp reser du dig upp och frågar Melander om ni fick all information ni behövde.\n\nHon nickar igen och tar sin käpp. 'Låt oss återvända till stugan.'\n\nPå vägen in i skogen stannar hon och ger ängen en sista blick, med ett konstigt uttryck. Du vet inte om det är sorg eller något annat, men ni fortsätter hem.",
    choices: [
      {
        text: "Återvänd till stugan.",
        effects: [
          {
            type: "setStoryFlag",
            flag: "mainstory.elves.contacted",
            value: true,
          },
          {
            type: "setStoryFlag",
            flag: "mainstory.shadow.myrkalfrKnown",
            value: true,
          },
          { type: "addExperience", amount: 221 },
          { type: "endAdventure" },
        ],
      },
    ],
  },
  witchLostKnowledge1: {
    id: "witchLostKnowledge1",
    text: "Melander sitter vid bordet med en gammal bok framför sig. Du frågar vad ni fick ut av samtalet med älvorna, och vad nästa steg är.\n\n'Myrkálfr,' säger hon och slår ihop boken. Hon sneglar mot bokhyllan. 'Jag har lyckats hitta några spår i de gamla texterna.'\n\nHon pausar och pekar mot boken på bordet. 'En sak jag verkligen gillar med människor. De skriver ned saker, så att det inte försvinner när tiden går. Någon samlade ihop sagor och myter som folket i den här skogen har fört vidare till sina barn i flera generationer.'",
    choices: [{ text: "Fortsätt.", nextNodeId: "witchLostKnowledge2" }],
  },

  witchLostKnowledge2: {
    id: "witchLostKnowledge2",
    text: "Du frågar om de nämner Myrkálfr, och hon ler.\n\n'Vi har tur. Det finns en direkt länk mellan de människor som fångade skuggan och oss,' säger hon med lättnad.\n\nDu är lite förvirrad över vad hon menar. Hon inser det och skakar på huvudet. 'Jag borde nog börja från början i stället för att hoppa till svaret.'",
    choices: [{ text: "Fortsätt.", nextNodeId: "witchLostKnowledge3" }],
  },

  witchLostKnowledge3: {
    id: "witchLostKnowledge3",
    text: "'Vi fick veta namnet, och det är väldigt viktigt. För älvorna är namnet det som får en sak att existera. Något utan namn har inte börjat finnas än.'\n\nHon blir tystlåten och verkar försvinna iväg i tankarna. Med lägre röst säger hon: 'Även det som finns kan sluta finnas, om det inte längre har ett namn...'\n\nSedan skakar hon på huvudet och rycker upp sig. 'Minns du att jag frågade hur man fångar en skugga? Det är en trollformel, eller en ritual, där man måste använda det rätta namnet på det man försöker fånga.'",
    choices: [{ text: "Fortsätt.", nextNodeId: "witchLostKnowledge4" }],
  },

  witchLostKnowledge4: {
    id: "witchLostKnowledge4",
    text: "Du minns att älvorna sa att de hade lärt människorna hur man gör. Du frågar varför de svarade att de redan hade lärt oss, när du frågade hur man gör.\n\n'Älvorna ser inte världen som vi gör. De vet allt, men de vet ingenting. Ur deras perspektiv är den här trollformeln en gåva som de har gett oss, den mänskliga rasen, så att fråga igen är förvirrande, eftersom vi redan har kunskapen.'\n\n'Det är vad jag menar med att de vet allt. Hade de sagt att de lärde oss, men att vi glömde bort det, så kunde vi be om samma sak igen. Men de antydde att vi redan har den, så vi kan hitta informationen i vår värld.'",
    choices: [{ text: "Fortsätt.", nextNodeId: "witchLostKnowledge5" }],
  },

  witchLostKnowledge5: {
    id: "witchLostKnowledge5",
    text: "'Så frågan är då,' säger Melander, 'vad gjorde våra förfäder med den kunskapen, när de var klara med ritualen och hade vunnit över skuggan?'\n\nHon slår upp boken igen och bläddrar bland de gamla sidorna. 'En historia som de brukade berätta handlar om deras modiga hövding, som med hjälp av en shaman besegrade ett monster vid namn Myrkálfr. De nämner att de fängslade det i ett träd, djupt inne i skogen.'\n\nHon tittar upp. 'Tydligen är det därför vi kan hitta stenar med inristade runor här ute i skogen.'",
    choices: [{ text: "Fortsätt.", nextNodeId: "witchLostKnowledge6" }],
  },

  witchLostKnowledge6: {
    id: "witchLostKnowledge6",
    text: "'Nästa steg blir då att leta efter de stenarna och tyda runorna.'\n\nHon ser på sina händer, och sedan på käppen som lutar mot dörrposten. 'Jag kan översätta dem, men jag orkar inte springa runt i skogen. Skriv av runorna så noga du kan och kom tillbaka till mig.'",
    choices: [
      {
        text: "Jag tar tag i det.",
        nextNodeId: "start",
        effects: [
          {
            type: "setStoryFlag",
            flag: "mainstory.witch.lostKnowledgeTold",
            value: true,
          },
        ],
      },
    ],
  },

  witchRunesReminder: {
    id: "witchRunesReminder",
    text: "Melander tittar upp från boken. 'Du har sett den där stora stenen med runor ute i skogen. Det är den vi behöver. Skriv av runorna så exakt du kan, och kom tillbaka till mig.'",
    choices: [{ text: "Tillbaka.", nextNodeId: "start" }],
  },
  witchRunesGive1: {
    id: "witchRunesGive1",
    text: "Du lägger pappren på bordet framför Melander. Hon lägger ifrån sig sin bok och drar dem närmare, och hennes mörka ögon följer varje linje. Hon säger ingenting på en lång stund. Fingret rör sig över symbolerna, långsamt, som om hon kände igen dem på känsel.\n\n'Noggrant,' mumlar hon. 'Mycket noggrant. Du har inte tagit en enda genväg.'",
    choices: [{ text: "Fortsätt.", nextNodeId: "witchRunesGive2" }],
  },

  witchRunesGive2: {
    id: "witchRunesGive2",
    text: "Du berättar om rövaren som dök upp i gläntan, om hövdingens order att leta upp och förstöra varje runsten, och om att han attackerade dig. Melander lyssnar utan att avbryta, och rynkan i pannan blir djupare.\n\n'Förstöra dem.' Hon ser på pappren, sedan på dig. 'Då är det ännu viktigare att jag skyndar mig. Någon vill inte att det här ska hittas.'",
    choices: [{ text: "Fortsätt.", nextNodeId: "witchRunesGive3" }],
  },

  witchRunesGive3: {
    id: "witchRunesGive3",
    text: "Hon reser sig och går till bokhyllan, drar ut tre tjocka böcker och lägger dem på bordet bredvid pappren. 'Det här är ett gammalt språk,' säger hon. 'Inte något som någon talar nu. Några av tecknen känner jag igen, andra inte, och några ser ut som att de har ändrat betydelse med tiden. Gammal skrift är som en gammal vän. Den svarar när den vill.'\n\nHon slår sig ned igen och drar fram en penna. 'Det kommer ta tid. Gå hem och vila, du har gjort ditt. Kom tillbaka i morgon, så berättar jag vad jag har hittat.'",
    choices: [
      {
        text: "Jag kommer tillbaka i morgon.",
        nextNodeId: "start",
        effects: [
          {
            type: "setStoryFlag",
            flag: "mainstory.runes.handedIn",
            value: true,
          },
          {
            type: "scheduleStoryFlag",
            flag: "mainstory.runes.ready",
            days: 1,
          },
        ],
      },
    ],
  },

  witchRunesWait: {
    id: "witchRunesWait",
    text: "Melander sitter böjd över pappren, omgiven av öppna böcker, och hon tittar knappt upp. 'Inte klar än,' säger hon, med pennan i handen. 'Några tecken vill inte ge med sig. Kom tillbaka i morgon.'",
    choices: [{ text: "Tillbaka.", nextNodeId: "start" }],
  },

  witchRunesTold1: {
    id: "witchRunesTold1",
    text: "Melander sitter vid bordet när du kommer in. Ljuset bredvid henne har brunnit ned till en stump, och pappren runt henne är täckta av anteckningar i hennes smala handstil. Hon ser trött ut, men det glimmar i hennes ögon.\n\n'Du är tillbaka,' säger hon. 'Bra. Sätt dig.'\n\nHon lägger handen på de avskrivna runorna. 'Det du hittade beskriver ritualen. Steg för steg, och med det rätta namnet. Och det står hur de förseglade skuggan i ett träd, djupt inne i skogen.'",
    choices: [{ text: "Fortsätt.", nextNodeId: "witchRunesTold2" }],
  },

  witchRunesTold2: {
    id: "witchRunesTold2",
    text: "'Och nu tillbaka till rövarna.' Hon lutar sig fram. 'Varför skulle de leta igenom skogen efter runstenar, för att förstöra dem? Jag kan bara komma på en förklaring. De har redan hittat det de egentligen letade efter. Trädet.'\n\nHon knackar med fingret mot bordet. 'Jag tror att de högg ned det, utan att förstå vad det höll. Och nu försöker de utplåna allt som kan visa vad de gjorde.'",
    choices: [{ text: "Fortsätt.", nextNodeId: "witchRunesTold3" }],
  },

  witchRunesTold3: {
    id: "witchRunesTold3",
    text: "'Du borde leta upp deras läger,' säger Melander. 'Du vet redan att de håller till ute i skogen. Jag har ritat en ungefärlig plats åt dig.' Hon skjuter över ett sönderrivet papper med en kort skiss. 'Titta om det finns någon där som verkar onaturlig. Någon som har blivit övertagen.'\n\nDu frågar vad hon menar. 'En skugga som släpps fri har ingen kropp,' säger hon. 'Den behöver någon att bära den. Och den som bär den ser ut, tänker och beter sig inte som vanligt.'",
    choices: [{ text: "Fortsätt.", nextNodeId: "witchRunesTold4" }],
  },

  witchRunesTold4: {
    id: "witchRunesTold4",
    text: "Hon tar något ur fickan och lägger det i din hand. En enkel ring av mörkt silver, med runor inristade på insidan, så små att du knappt kan se dem.\n\n'Jag har gjort den under natten. Om du hittar skuggan kan du låsa in den i ringen. Men inte så länge den har en kropp att gömma sig i.' Hon ser på dig, allvarlig nu. 'Besegrar du den, kommer den att leta efter en ny kropp. Och den väljer nog dig.'\n\nDu ser på ringen. 'Det är en fälla,' fortsätter hon. 'När den försöker ta dig, blir den förseglad i stället. Men det betyder att du är betet. Jag ska inte ljuga för dig, det är en risk.'",
    choices: [{ text: "Fortsätt.", nextNodeId: "witchRunesTold5" }],
  },

  witchRunesTold5: {
    id: "witchRunesTold5",
    text: "Du trär ringen på fingret. Den sitter som om den var gjord för dig, och den är kall mot huden.\n\n'Bär den hela tiden,' säger Melander. 'Och kom tillbaka till mig när det är gjort. Sedan måste vi komma på var vi kan gömma den, så att ingen någonsin hittar den.'",
    choices: [
      {
        text: "Jag tar tag i det.",
        effects: [
          {
            type: "setStoryFlag",
            flag: "mainstory.runes.deciphered",
            value: true,
          },
          {
            type: "setStoryFlag",
            flag: "mainstory.shadow.vesselGiven",
            value: true,
          },
          {
            type: "setStoryFlag",
            flag: "mainstory.banditCamp.found",
            value: true,
          },
          { type: "unlockLocation", locationId: "banditCamp" },
          { type: "endAdventure" },
        ],
      },
    ],
  },

  witchBanditReminder: {
    id: "witchBanditReminder",
    text: "Melander tittar upp från sina anteckningar. 'Rövarnas läger. Leta efter någon som inte är sig själv, och besegra honom. Ringen ska du bära hela tiden. Sedan kommer du tillbaka hit.' Hon tystnar. 'Var försiktig.'",
    choices: [{ text: "Tillbaka.", nextNodeId: "start" }],
  },

  witchShadowReturn1: {
    id: "witchShadowReturn1",
    text: "Melander går fram och tillbaka över golvet, med händerna knutna framför sig, och hon verkar ha gjort det länge. \n\nHon ser inte lättad ut att se dig. I stället betraktar hon dig allvarligt, noggrant, från topp till tå.\n\n'Här, ta emot,' säger hon, och kastar något till dig.\n\nDu fångar det i luften och ser efter vad det är. Det är en gammal rostig spik.",
    choices: [{ text: "Fortsätt.", nextNodeId: "witchShadowReturn2" }],
  },

  witchShadowReturn2: {
    id: "witchShadowReturn2",
    text: "Du tittar förvirrat på henne och tackar för spiken.\n\nMelanders axlar sjunker, och för första gången sedan du kom in ser hon lättad ut. 'Gjutjärn,' säger hon. 'Älvor kan inte röra vid det utan att brännas. Du höll i den utan att dra undan handen.' Hon andas ut. 'Jag är glad att du inte blev övertagen av skuggan.'\n\nHon skyndar över golvet och hämtar en liten tygpåse, som verkar tom. 'Här. För ringen.'",
    choices: [{ text: "Fortsätt.", nextNodeId: "witchShadowReturn3" }],
  },

  witchShadowReturn3: {
    id: "witchShadowReturn3",
    text: "Du drar av dig ringen. Den är fortfarande kall mot huden, och den väger mer än den borde. Du lägger den i påsen, och Melander knyter igen den med ett hårt knyck. Hon lägger påsen i ett litet träskrin, som en liten kista, och vrider om nyckeln i låset.\n\n'Jag måste hålla uppsikt över det här,' mumlar hon, 'tills vi kan komma på ett mer permanent gömställe.'",
    choices: [{ text: "Fortsätt.", nextNodeId: "witchShadowReturn4" }],
  },

  witchShadowReturn4: {
    id: "witchShadowReturn4",
    text: "Hon ställer skrinet på hyllan bland burkarna och vänder sig mot dig. Något i hennes ansikte mjuknar, och den skarpa blicken blir nästan varm.\n\n'Du har gjort något som ingen annan hade vågat,' säger hon. 'Hjältedåd, det skulle de kalla det i byn. Jag kallar det modigt, och dumdristigt, och precis vad den här skogen behövde.'\n\nHon slår sig ned vid kitteln och tar sleven i handen igen. 'Om du behöver något, så finns jag här.'",
    choices: [
      {
        text: "Tack, Melander.",
        nextNodeId: "start",
        effects: [
          {
            type: "setStoryFlag",
            flag: "mainstory.shadow.reported",
            value: true,
          },
          {
            type: "setStoryFlag",
            flag: "mainstory.shadow.complete",
            value: true,
          },
        ],
      },
    ],
  },
};
