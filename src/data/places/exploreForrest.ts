import type { AdventureEncounter, AdventureNode } from "../adventureTypes";
import { foxfire } from "./encounters/foxfire";
import { quietClearing } from "./encounters/quietClearing";
import { bear } from "./encounters/bear";
import { boar } from "./encounters/boar";
import { wolverine } from "./encounters/wolverine";
import { ambusher } from "./encounters/ambusher";
import { bandit } from "./encounters/bandit";
import { mercenary } from "./encounters/mercenary";
import { ambush } from "./encounters/ambush";

const encounters: [AdventureEncounter, ...AdventureEncounter[]] = [
  quietClearing,
  foxfire,
  wolverine,
  boar,
  bear,
  bandit,
  ambusher,
  mercenary,
  ambush,
];
export const exploreForrestStartNodeIds = encounters.map(
  (encounter) => encounter.startNodeId,
);

export const exploreForrest: Record<string, AdventureNode> = Object.assign(
  {
    start: {
      id: "start",
      text: "Stigen smalnar av och leder dig bort från de vältrampade stigarna, in bland Trollskogens djupare delar. Helt plötsligt öppnar träden och du snubblar in i en glänta med en stor sten i mitten.",
      choices: [
        {
          text: "Utforska skogen.",
          effects: [
            {
              type: "startRandomEncounter",
              adventureId: "exploreForrest",
            },
          ],
        },
        {
          text: "Titta närmare på stenen.",
          nextNodeId: "runeStone",
        },
        {
          text: "Vänd tillbaka.",
          effects: [{ type: "endAdventure" }],
        },
      ],
    },

    runeStone: {
      id: "runeStone",
      text: "Du går fram till stenen. Den är nästan lika hög som du, av grå granit täckt av lav och mossa, och den står stadigt trots att den måste ha stått här i åratal. Hela ytan är full av runor som slingrar sig i täta band uppåt längs sidorna. De är ristade så djupt att de syns tydligt än i dag. Du har hört berättelser om sådana stenar. Det måste vara vikingarna som rest den, för hundratals år sedan. Du kan inte läsa ett enda tecken, men vissa symboler återkommer om och om igen, som om de var viktiga. Du lägger handen mot stenen. Den är kall, trots solen.",
      choices: [
        {
          text: "Försök tyda runorna.",
          nextNodeId: "runeStoneRead",
          condition: {
            type: "storyFlag",
            flag: "runeStone.canRead",
            value: true,
          },
        },
        {
          text: "Tillbaka.",
          nextNodeId: "start",
        },
      ],
    },

    // Platshållare: skrivs när spelaren kan läsa runorna.
    runeStoneRead: {
      id: "runeStoneRead",
      text: "Runorna ligger inför dig, och för första gången kan du läsa dem.",
      choices: [
        {
          text: "Tillbaka.",
          nextNodeId: "runeStone",
        },
      ],
    },
  },
  ...encounters.map((encounter) => encounter.nodes),
);
