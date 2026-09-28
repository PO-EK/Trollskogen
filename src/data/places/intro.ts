import type { AdventureNode } from "../adventureTypes";

export const intro: Record<string, AdventureNode> = {
  start: {
    id: "start",

    text: "Du är på väg hem till sina föräldrar på gården där du växte upp. Byn ligger långt ifrån den stora staden där du gick i hamn, djupt in i vildmarken. Eftersom du ej har råd med häst så får du vandra. Du är van med leva i vildmarken och har dina vapen med dig, och allt som behövs för att slå läger för natten om det behövs. Men inte långt efter solen har gått ned kommer du fram till din by. Byn verkar vara i fara, folk ropar och många eldar brinner så du springer till räddningen.",

    choices: [
      {
        text: "Till byn",
        nextNodeId: "intro1",
      },
    ],
  },

  intro1: {
    id: "intro1",
    text: "Bybor med högafflar och faklor försöker stoppa ett enormt troll från att ta deras djur. De hugger och hotar monstret som verkar tveka om det ska anfalla eller fly. Du ser trollet svinga sin klubba, vad ser ut som ett halv träd uppdraget med rötterna, och två av byborna flyger flera meter bakåt och förblir still på marken. De andra byborna tappar modet och börjar backa undan. Trollet stoppar in armen i ett stall och plockar ut en häst som om det var en liten katt. Du bestämmer dig för att agera och drar dina vapen.",
    choices: [
      {
        text: "Attack",
        nextNodeId: "intro2",
      },
    ],
  },

  intro2: {
    id: "intro2",
    text: "Även om du inte kan besegra detta monster så får du trollet att släppa djuret och backa undan. När den svingar sin klubba tar du ett steg åt sidan och passar på att hugga med ditt vapen. Trollet backar undan och håller om sin skadade hand. Du står kvar med en fot på trollets tappade vapen när de andra byborna ansluter sig till dig. Som en grupp ropar ni och hotar trollet som bestämmer sig för att det inte är värt besväret och springer iväg in i den mörka skogen.",
    choices: [
      {
        text: "Bli hyllad",
        nextNodeId: "intro3",
      },
    ],
  },

  intro3: {
    id: "intro3",
    text: "Du blir kallad Hjälte och finner byns ledare. När de får veta att du är bonden son, tillbaka från kriget, så kommer de med dåliga nyheter. Ditt hem brann ned, inget vet varför men de antar att ett monster från skogen gjorde det. Din familj är död och byborna begravde dem där huset stod. Det är inte bara du, många i byn har förlorat sina nära och kära till de monster som vandrar ur skogen på natten. De skickade bud till stan att skicka knäckar eller soldater men han återvände aldrig så det är osäkra om meddelandet kom fram. Folket i denna by hoppas att du kan ändra på saker, göra deras liv bättre. Du får ett liten stuga att stanna i och by ledaren ber dig att försöka ta reda på varför varelser från skogen kommer ut och anfaller dem nu, det har inte hänt förr. Han rekommenderar att gå till den gamla gumman som bor själv utanför byn. Hon har kallas för häxa och varelserna från skogen verkar inte våga gå nära hennes stuga. Ta reda på om hon är orsaken till problemet eller om hon kan hjälpa till.",
    choices: [
      {
        text: "Utforska byn",
        effects: [
          {
            type: "endAdventure",
          },
        ],
      },
    ],
  },
};
