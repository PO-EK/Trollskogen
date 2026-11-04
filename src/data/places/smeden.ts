import type { AdventureNode } from "../adventureTypes";

export const smeden: Record<string, AdventureNode> = {
  intro: {
    id: "intro",
    text: "Smedjan ligger tyst och verkar förfallen. En skadad man sitter ensam på en stol med benet omlindat. Du känner igen honom som byns smed.",
    choices: [
      {
        text: "Gå fram och hälsa.",
        nextNodeId: "smedenStart",
        effects: [
          {
            type: "setStoryFlag",
            flag: "smeden.IntroSeen",
            value: true,
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
        text: "Jag har en läkande dryck till dig.",
        nextNodeId: "smedenHeal",
        condition: [
          {
            type: "storyFlag",
            flag: "healTheSmith.Started",
            value: true,
          },
          { type: "hasItem", itemId: "health_potion" },
        ],
        effects: [
          { type: "removeItem", itemId: "health_potion" },
          {
            type: "setStoryFlag",
            flag: "healTheSmith.Delivered",
            value: true,
          },
        ],
      },
      {
        text: "Jag ville bara hälsa. Hej då.",
        effects: [{ type: "endAdventure" }],
      },
    ],
  },

  smedenHurt: {
    id: "smedenHurt",
    text: "'Nä, jag har bara på mig dessa bandage för att det var så kallt ute.' säger han sarkastiskt. Han verkar ha dåligt tålamod för dumma frågor.",
    choices: [{ text: "Okej?", nextNodeId: "smedenStart" }],
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
            type: "addExperience",
            amount: 31,
          },
        ],
      },
      {
        text: "Jag återvänder när jag har en Läkande Dryck.",
        nextNodeId: "smedenStart",
        condition: {
          type: "storyFlag",
          flag: "healTheSmith.Delivered",
          value: false,
        },
      },
    ],
  },

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
        text: "Nattvakten: Kan du smida 10 spjut?",
        nextNodeId: "nattvaktenStart",
        condition: {
          type: "storyFlag",
          flag: "nattvakten.askSmith",
          value: true,
        },
      },
      {
        text: "Nattvakten: Jag har fått tillbaka dina verktyg.",
        nextNodeId: "nattvaktenToolsReturn",
        condition: {
          type: "hasItem",
          itemId: "smedenTools",
        },
        effects: [
          { type: "removeItem", itemId: "smedenTools" },
          { type: "addExperience", amount: 25 },
          { type: "addGold", amount: 50 },
        ],
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

  nattvaktenStart: {
    id: "nattvaktenStart",
    text: "Smeden lyfter ett ögonbryn och lägger ifrån sig hammaren. 'Tio spjut? Vad tänker du göra med dem, kasta dem ett i taget?'",
    choices: [
      {
        text: "Lars vill bilda en nattvakt av bybor. Spjut är billiga och enkla att lära sig.",
        nextNodeId: "nattvaktenImpressed",
      },
    ],
  },

  nattvaktenImpressed: {
    id: "nattvaktenImpressed",
    text: "Smeden blir tyst en stund. 'Lars? Ulfs son? Hm. Jag trodde han bara stod och darrade vid dörren.' Han nickar långsamt. 'Det är en klok idé, och den unge mannen har ett bättre huvud än jag trodde. Jag hjälper gärna till.' Han kliar sig i nacken. 'Men inte med brons, järn eller stål. Jag skulle göra spetsarna av gjutjärn.'",
    choices: [
      {
        text: "Varför gjutjärn?",
        nextNodeId: "nattvaktenCastIron",
      },
    ],
  },

  nattvaktenCastIron: {
    id: "nattvaktenCastIron",
    text: "'Det här hände strax innan jag skadades,' säger smeden och sänker rösten. 'En flock vättar kom ned från skogen. Små troll, ungefär som tomtar, röda som flugsvampar. Vi stod där och visste inte vad vi skulle göra, tills en kvinna slog till en av dem med en gjutjärnspanna.' Han skakar på huvudet. 'Skinnet började fräta och smälta där den träffade. Hela flocken blev förskräckt och sprang tillbaka in i skogen.' Han rynkar pannan. 'Jag har funderat på det sedan dess. Kanske är det för att järnet är så onaturligt för dem. Vad vet jag. Men det verkade fungera bättre än något svärd.'",
    choices: [
      {
        text: "Kan du göra det?",
        nextNodeId: "nattvaktenTools",
      },
    ],
  },

  nattvaktenTools: {
    id: "nattvaktenTools",
    text: "'Jag har nästan allt jag behöver. Det finns gott om övergivna grytor i byn att smälta ned.' Han tvekar. 'Men det finns ett problem. För en stund sedan var jag inne i huset när jag hörde någon i smedjan. Jag sprang ut och ropade, men en man rotade redan bland mina saker och sprang iväg med viktiga verktyg.'",
    choices: [
      {
        text: "Vad stal han?",
        nextNodeId: "nattvaktenWhat",
      },
      {
        text: "Vem var det?",
        nextNodeId: "nattvaktenWho",
      },
      {
        text: "Var ska jag leta?",
        nextNodeId: "nattvaktenWhere",
      },
    ],
  },

  nattvaktenWhat: {
    id: "nattvaktenWhat",
    text: "'Mina verktyg för gjutning: formar, en degel och några långa tänger.' Smeden suckar. 'Det är inget jag använder i det dagliga arbetet, så han kan ha tänkt att de var värda något. Men för det här jobbet måste jag ha dem tillbaka.'",
    choices: [
      {
        text: "Tillbaka.",
        nextNodeId: "nattvaktenTools",
      },
    ],
  },

  nattvaktenWho: {
    id: "nattvaktenWho",
    text: "'Jag såg inte ansiktet. Jag antar att det var någon från byn, om det inte var en rövare i bykläder.' Han tänker efter. 'Han såg inte ut som en rövare, dock. Mer som en rädd och desperat man.'",
    choices: [
      {
        text: "Tillbaka.",
        nextNodeId: "nattvaktenTools",
      },
    ],
  },

  nattvaktenWhere: {
    id: "nattvaktenWhere",
    text: "'Fråga runt i byn om någon såg något,' säger smeden. 'Alla har fullt upp med sitt, men någon måste ha sett honom. Och vill de inte prata så kanske du får muta dem. Folk är rädda och desperata nu.'",
    choices: [
      {
        text: "Jag tar tag i det.",
        nextNodeId: "start",
        effects: [
          { type: "setStoryFlag", flag: "nattvakten.smithAsked", value: true },
          { type: "setStoryFlag", flag: "nattvakten.askSmith", value: false },
          { type: "setStoryFlag", flag: "nattvakten.askAround", value: true },
        ],
      },
    ],
  },

  nattvaktenToolsReturn: {
    id: "nattvaktenToolsReturn",
    text: "Du räcker över verktygen, inlindade i en hoprullad läderfilt. Smeden vecklar upp den och går noggrant igenom varje formar, tång och degel. 'Allt finns med,' mumlar han nöjt. 'Nu har jag allt jag behöver för att smida.' Han sträcker dig en påse med mynt som tack.",
    choices: [
      {
        text: "Undrar du inte vem tjuven var?",
        nextNodeId: "nattvaktenTold",
      },
      {
        text: "Vill du veta var jag hittade dem?",
        nextNodeId: "nattvaktenTold",
      },
    ],
  },

  nattvaktenTold: {
    id: "nattvaktenTold",
    text: "Du berättar vad som hände i detalj. Smeden lyssnar tyst och lutar sig mot städet. 'Envis och modig, det är du. Jag ska inte ljuga, jag sörjer inte tjuven. Det är svårt att ha medlidande med den som stjäl.' Han skakar på huvudet och tar fram en liten påse. 'Men du fick tillbaka mina saker, och det glömmer jag inte. Här, 50 Kroner för besväret. Nu kör jag igång smidet.'",
    choices: [
      {
        text: "Jag hjälper till så går det fortare.",
        nextNodeId: "nattvaktenForge",
        effects: [],
      },
      {
        text: "Jag vill se hur man gjuter järn.",
        nextNodeId: "nattvaktenForge",
        effects: [],
      },
    ],
  },

  nattvaktenForge: {
    id: "nattvaktenForge",
    text: "Ni spenderar flera timmar i smedjan. Smeden smälter ned gamla grytor i degeln medan du hjälper till att hålla elden uppe. Han häller det glödande järnet i formarna, och du ser hur varje spjutspets tar form. När de svalnat nitar ni fast dem på trästavar och slipar dem vassa, en efter en. Till slut ligger tio spjut på rad vid väggen. Smeden torkar svetten ur pannan och nickar belåtet. 'Det här borde duga. Säg till Lars att de finns här att hämta när de behövs.'",
    choices: [
      {
        text: "Då går jag tillbaka till Lars.",
        effects: [
          {
            type: "setStoryFlag",
            flag: "nattvakten.ToolsReturned",
            value: true,
          },
          { type: "setStoryFlag", flag: "nattvakten.reportLars", value: true },
          {
            type: "setStoryFlag",
            flag: "nattvakten.returnTools",
            value: false,
          },
          { type: "endAdventure" },
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
