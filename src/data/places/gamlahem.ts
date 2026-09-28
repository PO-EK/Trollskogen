import type { AdventureNode } from "../adventureTypes";

export const gamlahem: Record<string, AdventureNode> = {
  start: {
    id: "start",

    text: "Du följer de gamla bekanta vägarna genom byn mot dina föräldrars gård, huvudet fullt av minnen av din barndom. När du kliver över den förstörda grinden så blir du stående en stund, dina ögon sveper över kolsvarta stockar där ditt hur brukade stå.",

    choices: [
      {
        text: "Försök att ta reda på vad som hänt.",
        nextNodeId: "inspect",
      },
      {
        text: "Leta efter din familj.",
        nextNodeId: "findGraves",
      },
      {
        text: "Återvänd till byn",
        nextNodeId: "leave",
      },
    ],
  },

  inspect: {
    id: "inspect",

    text: "Du söker igenom det nerbrända huset. Det finns inte mycket kvar. Intressant nog så är mitten av huset mer nerbränt än sidorna. Köket, trots att allt är svart bränt och övervånning har fallit ned, är rätt intakt med väggen fortfarande stående, så elden började inte där. Du kommer till den slutsatsen att branden måste ha startat vid ytterdörren. Detta var inte en olycka, någon eller något ville förstöra detta hus och dem bor här.",

    choices: [
      {
        text: "Leta efter dina föräldrar",
        nextNodeId: "findGraves",
      },
      {
        text: "Återvänd till byn",
        nextNodeId: "leave",
      },
    ],
  },

  findGraves: {
    id: "findGraves",

    text: "Byborna sa att de hade begravd din familj vid den stora eken, bakom huset. Du faller ned på knä framför de två enkla träkors som byborna satte up. Du läser dina föräldrars namn på korsen en efter den andra. Du förblir tyst och stilla en lång stund i sörjan.",

    choices: [
      {
        text: "Sök hämd",
        nextNodeId: "revenge",
      },
      {
        text: "Lova att beskydda byn",
        nextNodeId: "hero",
      },
    ],
  },

  revenge: {
    id: "revenge",
    text: "Du svär till dina föräldrar att den som orsakade detta kommer att lida. Du kommer jaga dem, eller det, till världens ände, oavsätt vilka hinder som står ivägen.",
    choices: [
      {
        text: "Sök igenom huset",
        nextNodeId: "inspect",
      },
      {
        text: "Återvänd till byn",
        nextNodeId: "leave",
      },
    ],
  },

  hero: {
    id: "hero",
    text: "I ditt huvud hör du din faders visa ord, när han lärde dig vad som var rätt och fel. Du svär till dina föräldrar att du ska göra vad du kan för att skydda denna by och dessa människor. Ingen ska behöva lida som din familj har gjort.",
    choices: [
      {
        text: "Sök igenom huset",
        nextNodeId: "inspect",
      },
      {
        text: "Återvänd till byn",
        nextNodeId: "leave",
      },
    ],
  },

  leave: {
    id: "leave",
    text: "Du säger farväl till ditt barndomshem och börjar gå emot byn.",

    choices: [
      {
        text: "Återvänd till byn",
        effects: [
          {
            type: "endAdventure",
          },
        ],
      },
    ],
  },
};
