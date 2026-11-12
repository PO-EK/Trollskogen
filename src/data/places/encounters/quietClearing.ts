import type { AdventureEncounter } from "../../adventureTypes";

export const quietClearing: AdventureEncounter = {
  startNodeId: "quietClearingStart",
  nodes: {
    quietClearingStart: {
      id: "quietClearingStart",
      text: "Mellan täta granar hittar du en rund glänta. Mossan är mjuk och orörd, men mitt i den står en ensam stol av flätade grenar. Någon har lämnat en varm kopp te på sitsen.",
      choices: [
        {
          text: "Sätt dig en stund.",
          nextNodeId: "quietClearingRest",
        },
        {
          text: "Lämna gläntan.",
          effects: [{ type: "endAdventure" }],
        },
      ],
    },
    quietClearingRest: {
      id: "quietClearingRest",
      text: "Du slår dig ned. Skogens ljud tystnar, och för en kort stund känns det som om gläntan vaktar över dig. När du reser dig är koppen borta.",
      choices: [
        {
          text: "Gå tillbaka till stigen.",
          effects: [{ type: "endAdventure" }],
        },
      ],
    },
  },
};
