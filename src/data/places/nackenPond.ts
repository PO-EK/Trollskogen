import type { AdventureChoice, AdventureNode } from "../adventureTypes";

// Frågor som leder fel. Flaggorna nollställs aldrig, så en ställd fråga
// är borta för gott. Lägg till nya här + en nod med samma id.
const wrongQuestions = [
  {
    flag: "nacken.askedAsk",
    nodeId: "nackenAsk",
    text: "Vem är Ask? Det var inte min fars namn.",
  },
  {
    flag: "nacken.askedDeath",
    nodeId: "nackenDeath",
    text: "Varför lurar du folk till döden?",
  },
  {
    flag: "nacken.askedEvil",
    nodeId: "nackenEvil",
    text: "Är du ondskan som påverkar skogen?",
  },
  {
    flag: "nacken.askedBeings",
    nodeId: "nackenBeings",
    text: "Vilka andra väsen finns i skogen?",
  },
  {
    flag: "nacken.askedUnusual",
    nodeId: "nackenUnusual",
    text: "Har du sett något ovanligt på sistone?",
  },
  {
    flag: "nacken.askedVillage",
    nodeId: "nackenVillage",
    text: "Vet du vad som hände med byn?",
  },
  {
    flag: "nacken.askedMelander",
    nodeId: "nackenMelander",
    text: "Känner du Melander?",
  },
  {
    flag: "nacken.askedAge",
    nodeId: "nackenAge",
    text: "Hur gammal är du?",
  },
];

// Frågeval i hubben: alla oställda fel-frågor + den rätta.
const hubChoices = (): AdventureChoice[] => [
  ...wrongQuestions.map(
    (q): AdventureChoice => ({
      text: q.text,
      nextNodeId: q.nodeId,
      condition: { type: "storyFlag", flag: q.flag, value: false },
      effects: [{ type: "setStoryFlag", flag: q.flag, value: true }],
    }),
  ),
  {
    text: "Vad är det som får troll och tomtar att fly skogen?",
    nextNodeId: "nackenShadow",
  },
];

// "Tillbaka" från en fel-fråga. Första frågan under besöket leder till hub 2,
// andra till hub 3 och tredje till att du blir blöt om fötterna.
const backFromQuestion = (): AdventureChoice[] => [
  {
    text: "Tillbaka.",
    nextNodeId: "nackenHub2",
    condition: { type: "storyFlag", flag: "nacken.oneAsked", value: false },
    effects: [{ type: "setStoryFlag", flag: "nacken.oneAsked", value: true }],
  },
  {
    text: "Tillbaka.",
    nextNodeId: "nackenHub3",
    condition: [
      { type: "storyFlag", flag: "nacken.oneAsked", value: true },
      { type: "storyFlag", flag: "nacken.twoAsked", value: false },
    ],
    effects: [{ type: "setStoryFlag", flag: "nacken.twoAsked", value: true }],
  },
  {
    text: "Tillbaka.",
    nextNodeId: "nackenWet",
    condition: [
      { type: "storyFlag", flag: "nacken.oneAsked", value: true },
      { type: "storyFlag", flag: "nacken.twoAsked", value: true },
    ],
  },
];

export const nackenPond: Record<string, AdventureNode> = {
  intro: {
    id: "intro",
    text: "Du går in i skogen med amuletten hängande kring halsen och lyssnar. Först hör du ingenting. Sedan, svagt och långt borta, kommer fiolen. Melodin är vacker på ett sätt som gör ont, och den drar i dig. Du följer den utan att tänka, och hela tiden växer musiken. Mellan träden hörs ett dån som blir starkare. En flod strömmar fram med fart genom skogen, och bortom det vita skummet hörs musiken, högre nu, som om den lockade dig rakt ned i vattnet. Dina steg blir fler och snabbare, och dina fötter bär dig närmare strandkanten. Du griper hårt om amuletten, så hårt att runorna trycker in sig i handflatan. Du måste kämpa emot. Du skakar på huvudet, drar ett djupt andetag och ropar så högt du kan: 'Nykr!'",
    choices: [
      {
        text: "Fortsätt.",
        nextNodeId: "nackenCallAgain",
        effects: [
          { type: "setStoryFlag", flag: "nacken.oneAsked", value: false },
          { type: "setStoryFlag", flag: "nacken.twoAsked", value: false },
        ],
      },
    ],
  },

  nackenCallAgain: {
    id: "nackenCallAgain",
    text: "Först händer ingenting. Fiolen fortsätter spela som förut, och floden rinner på. Du ropar igen, högre än förut, så att din röst skär genom ljudet av vatten: 'Nykr!' Musiken slutar abrupt.",
    choices: [{ text: "Fortsätt.", nextNodeId: "nackenSilence" }],
  },

  nackenSilence: {
    id: "nackenSilence",
    text: "Du ser dig omkring, men ser ingen. Bara floden, som rinner på, med stora grå stenar i mitten som sticker upp ur vattnet. Vinden susar i träden, och vattnet porlar. Det är det enda du hör. Du gör dig redo att ropa igen när du hör en röst. 'Var hörde du detta namn, soldat?' Du tittar dig omkring, men det finns ingen där. Rösten verkar komma inifrån ditt eget huvud.",
    choices: [{ text: "Fortsätt.", nextNodeId: "nackenAppears" }],
  },

  nackenAppears: {
    id: "nackenAppears",
    text: "'Många vintrar sedan,' säger rösten, 'var det en av Asks söner som tilltalade oss.' Fiolen börjar spela igen, och ditt sinne snurrar när du ser mot stenen mitt i floden. Den var tom. Nu sitter en man på den med en fiol. Du blir yr när du försöker förstå vad du såg när han dök upp. Dina ögon sa att stenen var tom, men innerst inne vet du att han alltid har suttit där och att du bara inte kunde se honom. Eller snarare: att du inte kunde förstå vad du såg. Tänker du tillbaka på ögonblicket innan han dök upp blir du illamående, så du bestämmer dig för att fokusera på varför du är här. Du lägger alla tankar och känslor åt sidan och rätar på dig. Näcken sitter avslappnat på stenen och gnolar till sin fiol, och väntar.",
    choices: [
      {
        text: "Fortsätt.",
        nextNodeId: "nackenHub1",
        effects: [
          { type: "setStoryFlag", flag: "nacken.IntroSeen", value: true },
        ],
      },
    ],
  },

  // Dit man kommer vid återbesök, efter att introt är sett.
  start: {
    id: "start",
    text: "Du håller i amuletten och följer fiolen genom skogen, tillbaka till floden. Den här gången går det fortare, och du känner igen varje sväng. Musiken lockar fortfarande, men du vet vad den vill, och du går inte närmare vattnet än du behöver. På den grå stenen i floden sitter Näcken, precis som förut, som om han aldrig lämnat den. 'Tillbaka så snart?' säger han med ett leende, utan att sluta spela.",
    choices: [
      {
        text: "Fråga ut Näcken.",
        nextNodeId: "nackenHub1",
        effects: [
          { type: "setStoryFlag", flag: "nacken.oneAsked", value: false },
          { type: "setStoryFlag", flag: "nacken.twoAsked", value: false },
        ],
      },
      {
        text: "Ursäkta dig och lämna floden.",
        effects: [{ type: "endAdventure" }],
      },
    ],
  },

  // Hub när ingen fråga ställts under det här besöket.
  nackenHub1: {
    id: "nackenHub1",
    text: "Näcken sitter kvar på stenen och drar bågen över strängarna, lätt och utan brådska, och tittar på dig som om han hade all tid i världen. Det har han kanske också. Du är här för information. Kom ihåg vad Melander sa.",
    choices: hubChoices(),
  },

  // Hub efter en fråga: vattnet är närmare.
  nackenHub2: {
    id: "nackenHub2",
    text: "Näcken har inte rört sig från stenen, och melodin är samma som förut. Men floden är närmare nu. Du kan inte minnas att du tagit några steg, men det porlar lägre och tydligare, och marken under stövlarna är fuktig. Du borde nog inte stanna länge till.",
    choices: hubChoices(),
  },

  // Hub efter två frågor: vattnet är nästan vid dina fötter.
  nackenHub3: {
    id: "nackenHub3",
    text: "Musiken har ändrat sig, nästan omärkligt. Den är långsammare nu, och mjukare, och du upptäcker att du står och vaggar i takt med den. Vattnet är bara ett par steg bort, och det blänker i kanten av dina stövlar. Näcken ler vänligt mot dig från sin sten. Du vet att du måste gå snart.",
    choices: hubChoices(),
  },

  nackenAsk: {
    id: "nackenAsk",
    text: "'Ask?' Näcken ler mjukt. 'Den första av er som jag någonsin såg. Han kom ned till vattnet en gryning och stannade, och vi tittade på varandra länge.' Han drar några toner på fiolen. 'Det var honom jag tog min nuvarande gestalt efter, så jag kunde vara ihop med dig och dina.' Du ser en mörkhårig man. Men du kunde svära på att han för bara en stund sedan hade hovar och horn och blont hår. Du minns säkert fel. 'Jag är människornas äldsta vän,' fortsätter han. 'Vi brukade spela och sjunga tillsammans, ofta. De frågade mig om råd, och jag hjälpte alltid till. Det var jag som gav dem deras första instrument och lärde dem spela.' Han lutar huvudet. 'Finns det inget du skulle vilja ha, soldat? Styrka? Pengar? Magiska krafter?' Han ler stort, men du får en dålig känsla. Du märker att du har närmat dig vattnet medan han pratade, så du tackar nej.",
    choices: backFromQuestion(),
  },

  nackenDeath: {
    id: "nackenDeath",
    text: "Näcken spelar förolämpad och lägger handen mot bröstet. 'Lurar? Det är inte mitt fel om folk inte tittar vart de går när jag spelar.' Han lutar sig bakåt. 'Och vet du ens att de är döda? Kanske blev de bara inbjudna till en bättre värld, där de kan dansa och ha det bra.' Du undrar om det är sant. Näcken ler. 'Det finns bara ett sätt att få svaret.' Du tittar ned på vattnet vid dina fötter, som du kommit närmare utan att märka det, och skakar på huvudet.",
    choices: backFromQuestion(),
  },

  nackenEvil: {
    id: "nackenEvil",
    text: "'Ondska?' Näcken kluckar. 'Vad menar du med det ordet?' Du försöker förklara och ger ett första exempel, och han petar hål på det. Du försöker med ett andra, och han petar hål på det också. Du ger ett tredje, och han ler bara. 'Jag är vad jag är,' säger han till slut, med fiolen i knät. 'Varken god eller ond. Jag bara är.' Du ger upp att argumentera filosofi med någon som har haft flera tusen år att tänka på saken. Och då märker du att vattnet kluckar kring dina skor. Du har närmat dig det utan att märka det.",
    choices: backFromQuestion(),
  },

  nackenBeings: {
    id: "nackenBeings",
    text: "'Åh, många.' Näcken räknar på fingrarna, utan att sluta spela. 'Skogsrået, som är vackert framifrån och ihåligt bakifrån. Lyktgubbarna, som gärna leder vilse. Vättarna, som inte tål att bli stirrade på. Älvorna, som är artiga, tills de inte är det.' Du känner igen allt från sagorna. 'Du känner dem redan,' säger han. 'Du har bara inte träffat dem än.' Du frågar vilken av dem som är farligast. 'Det beror på vem du frågar. Frågar du skogsrået, så är det jag. Frågar du mig, så är det hon.' Han skrattar tyst. Du känner att du gått i cirklar. Det är först då du märker vattnet runt kanten av dina stövlar.",
    choices: backFromQuestion(),
  },

  nackenUnusual: {
    id: "nackenUnusual",
    text: "'Ovanligt?' Näcken ser mot himlen och låtsas fundera. 'Allt är ovanligt, soldat. Ingen dag är den andra lik. Floden har aldrig runnit likadant två gånger.' Han lutar sig fram på stenen. 'Det mest ovanliga jag har sett på sistone är att du står här och frågar mig.' Hans leende blir bredare. 'Men säg mig, vad såg du själv därute i kriget? Det var väl ovanligt?' Du öppnar munnen för att svara, och stänger den. Du svarar inte på hans frågor. Det var det Melander sa. Näcken suckar, som om du hade förstört något roligt, och du märker att du har glidit närmare vattnet utan att ha tagit ett steg.",
    choices: backFromQuestion(),
  },

  nackenVillage: {
    id: "nackenVillage",
    text: "Fiolen tystnar, och för första gången låter Näcken allvarlig. 'Byn.' Han ser inte på dig, utan på vattnet. 'Jag hörde den falla. Ett hus gör ett ljud när det faller, och ett annat när det brinner. Jag vet vilket som var vilket.' Du väntar på mer. 'Men du frågar som någon som redan vet svaret,' säger han. 'Det gör ont att höra. Du frågar efter något annat.' Han tittar upp, och leendet är tillbaka. 'Vill du höra hur det lät?' Du tar ett steg bakåt och skakar på huvudet. Vattnet kluckar vid dina fötter, närmare än du trodde.",
    choices: backFromQuestion(),
  },

  nackenMelander: {
    id: "nackenMelander",
    text: "'Melander.' Näcken smakar på namnet. 'Hon heter inte så. Det är en mans efternamn, som hon bär som ett lånat plagg.' Han drar några toner. 'Jag kände henne när hon hade ett eget namn. Det var ett vackert namn.' Han ser på dig med ett ögonkast som är alldeles för vänligt. 'Jag kan säga det, om du vill. Det kostar bara en liten tjänst.' Du minns vad hon berättade, att hon gav bort sitt namn till en älva, och att hon aldrig ångrat det. Det är inget du ska ta ifrån henne, och inget du ska köpa av honom. Du skakar på huvudet. Näcken verkar inte förvånad. Du märker att vattnet har kommit närmare.",
    choices: backFromQuestion(),
  },

  nackenAge: {
    id: "nackenAge",
    text: "'Hur gammal?' Näcken skrattar. 'Äldre än den här floden. Eller yngre. Floden har bytt plats många gånger, och jag har alltid funnits där den var.' Han ser på stenen under sig. 'Och den här stenen är äldre än båda.' Han vinkar med bågen mot dig. 'Men hur gammal är du, soldat? Du ser ung ut, men du känner dig äldre, eller hur? Det syns i dina ögon.' Du svarar inte. Näcken nickar, nöjd, som om du ändå gett honom ett svar. Du märker att det porlar högre än förut, och att du står närmare vattnet.",
    choices: backFromQuestion(),
  },

  nackenWet: {
    id: "nackenWet",
    text: "Du känner att dina fötter är blöta. Floden har tagit sig upp över dina skor, och kylan kryper uppför benen. Du har stått här alldeles för länge. 'Förlåt, jag har saker att göra,' säger du snabbt och backar ur vattnet. Näcken lutar sig fram och säger att han gärna pratar mer, att du borde stanna, att det finns så mycket kvar att berätta. Du ger honom inget svar. Du vänder dig om och går, fort, bort från floden, tills musiken har tystnat bakom dig och huvudet börjar klarna.",
    choices: [
      {
        text: "Lämna floden.",
        effects: [
          { type: "setStoryFlag", flag: "nacken.oneAsked", value: false },
          { type: "setStoryFlag", flag: "nacken.twoAsked", value: false },
          { type: "endAdventure" },
        ],
      },
    ],
  },

  nackenShadow: {
    id: "nackenShadow",
    text: "'Rädda?' Näcken skrattar mjukt. 'Kalla dem inte fega. De gör plats för skuggan, vilket är ganska artigt när man tänker efter.' Du tänker efter, och det är det. 'Skuggan?' frågar du.",
    choices: [{ text: "Fortsätt.", nextNodeId: "nackenShadow2" }],
  },

  nackenShadow2: {
    id: "nackenShadow2",
    text: "'Det har funnits många sorters väsen genom tiderna,' säger Näcken. 'Och en gång, för länge sedan, dök det upp en nykomling som gillade att skapa rädsla hos de dödliga.' Han fnyser. 'Jag hade inget intresse för gröngölingar som skuggan. Men människorna på den tiden tog det illa upp. Tydligen på grund av alla problem skuggan skapade, så bad folket älvorna om hjälp, och de lyckades fånga den och spärra in den.' Du frågar om skuggan har återvänt, och om han vet mer.",
    choices: [{ text: "Fortsätt.", nextNodeId: "nackenOffer" }],
  },

  nackenOffer: {
    id: "nackenOffer",
    text: "Näcken ler, och det är samma leende som förut, brett och varmt och fel. 'Det vet jag kanske. Och jag kan berätta, om du hjälper mig med något.' Melanders varning ekar i ditt huvud. Du är bara här för information. Du tar ett steg bakåt, ur vattnet, och tackar nej.",
    choices: [{ text: "Tacka nej och gå.", nextNodeId: "nackenFarewell" }],
  },

  nackenFarewell: {
    id: "nackenFarewell",
    text: "'Besvikelse,' ropar Näcken efter dig, 'vi kunde ha blivit goda vänner!' Du vänder dig inte om. Du fortsätter in i skogen med snabba steg, bort från floden, och musiken blir svagare och svagare bakom dig. Ditt huvud börjar klarna, och det känns som om du vaknat ur en dröm. Du måste berätta för Melander vad du fått veta.",
    choices: [
      {
        text: "Gå tillbaka till häxan.",
        effects: [
          {
            type: "setStoryFlag",
            flag: "mainstory.nacken.talked",
            value: true,
          },
          { type: "setStoryFlag", flag: "mainstory.shadow.known", value: true },
          { type: "addExperience", amount: 220 },
          { type: "hideLocation", locationId: "nackenPond" },
          { type: "endAdventure" },
        ],
      },
    ],
  },
};
