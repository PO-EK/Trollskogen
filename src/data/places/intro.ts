import type { AdventureNode } from "../adventureTypes";

export const intro: Record<string, AdventureNode> = {
  start: {
    id: "start",

    text: "Du är på väg hem till dina föräldrars gård, där du växte upp. Byn ligger långt från den stora staden där du tjänstgjorde under kriget, undangömd bland vildmarkens täta skogar. \n\nDu har inte råd med en häst, så du får gå hela vägen. Du bär dina vapen och har med dig allt du behöver för att slå läger om natten skulle falla innan du når fram.\n\nSolen har sedan länge sjunkit bakom träden när du till sist skymtar byn. Innan du går vidare stannar du upp en stund. \n\nVad ska människorna här kalla dig?",
    input: {
      type: "playerName",
      label: "Vad heter du?",
      placeholder: "Skriv ditt namn",
      submitText: "Fortsätt",
      nextNodeId: "arrival",
    },
    choices: [],
  },

  arrival: {
    id: "arrival",
    text: "När du närmar dig byn ser du lågor fladdra mellan husen och hör rop eka genom mörkret. Något är fel. Du skyndar fram, beredd att hjälpa till.",
    choices: [
      {
        text: "Till byn",
        nextNodeId: "intro1",
        effects: [{ type: "addExperience", amount: 20 }],
      },
    ],
  },

  intro1: {
    id: "intro1",
    text: "På byns öppna plats står några bybor med högafflar och facklor. De försöker hålla stånd mot ett enormt troll som är ute efter byns boskap. De ropar och stöter mot besten med sina redskap, men trollet verkar väga sina alternativ: ska det anfalla eller fly?\n\nPlötsligt svingar trollet sin klubba, ett massivt träd som slitits upp med rötterna. Två bybor träffas och slungas flera meter bakåt. De blir liggande orörliga på marken. De andra tappar modet och börjar dra sig undan.\n\nTrollet sträcker in armen i stallet och lyfter ut en häst som om den inte vägde mer än en katt. Du kan inte stå bredvid och se på. Du drar dina vapen och gör dig redo att ingripa.",
    choices: [
      {
        text: "Attack",
        nextNodeId: "intro2",
        effects: [{ type: "addExperience", amount: 34 }],
      },
    ],
  },

  intro2: {
    id: "intro2",
    text: "Du är ingen match för ett så stort monster, men du lyckas få trollet att släppa hästen. När det höjer klubban kastar du dig åt sidan och hugger till. Trollet rycker undan handen och backar, medan det håller om såret. Klubban faller tungt till marken.\n\n Byborna samlas run dig, tillsammans ropar ni och hotar trollet. Det tvekar, inser att bytet inte är värt kampen och vänder sedan om. Med tunga steg försvinner det in bland skogens mörka träd.",
    choices: [
      {
        text: "Bli hyllad",
        nextNodeId: "intro3",
        effects: [{ type: "addExperience", amount: 32 }],
      },
    ],
  },

  intro3: {
    id: "intro3",
    text: 'Byborna hyllar dig som en hjälte. Du söker upp byns ledare, som känner igen dig som bondens son, hemvänd från kriget. Men glädjen över återseendet blir kortvarig. Han berättar att gården brann ner och att ingen vet hur elden började. Många misstänker att ett monster från skogen låg bakom branden. Din familj omkom, och byborna begravde dem där huset en gång stod.\n\nDet är inte bara du som har förlorat någon. På sistone har varelser börjat lämna skogen om nätterna och angripa byn. Flera familjer sörjer sina nära och kära. Byborna skickade en budbärare till staden för att be om hjälp från soldater eller legoknektar, men han kom aldrig tillbaka. Ingen vet om meddelandet nådde fram.\n\nDu tänker på allt du har gått igenom och på det som väntar. Vad kan du lita på när det verkligen gäller?\n\n"Min största styrka är min..."',
    choices: [
      {
        text: "Styrka (+5)",
        nextNodeId: "intro4",
        effects: [{ type: "increaseAttribute", attribute: "Str", amount: 5 }],
      },
      {
        text: "Smidighet (+5)",
        nextNodeId: "intro4",
        effects: [{ type: "increaseAttribute", attribute: "Dex", amount: 5 }],
      },
      {
        text: "Intelligens (+5)",
        nextNodeId: "intro4",
        effects: [{ type: "increaseAttribute", attribute: "Int", amount: 5 }],
      },
    ],
  },

  intro4: {
    id: "intro4",
    text: "Du vill gärna ta dig till familjens gård, men byborna övertalar dig att vänta till morgonen. Det är farligt ute i mörkret, och de vill ha dig kvar i byn. De visar dig till en övergiven stuga och säger att du får använda den.",
    choices: [
      {
        text: "Gå till stugan",
        effects: [{ type: "travelTo", locationId: "playerHQ" }],
      },
    ],
  },
};
