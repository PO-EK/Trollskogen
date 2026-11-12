import { village } from "./village";
import type { AdventureNode } from "../adventureTypes";
import { intro } from "./intro";
import { ruins } from "./ruins";
import { witchCottage } from "./witchCottage";
import { smeden } from "./smeden";
import { playerHQ } from "../places/playerHQ";
import { places } from "../places/places";
import { vardshuset } from "../places/Värdshuset";
import { mayors } from "../places/mayors";
import { woodcuttersHut } from "../places/woodcuttersHut";
import { byHus } from "../places/byHus";
import { banditCamp } from "../places/banditCamp";
import { witchIntroQuest } from "../places/witchIntroQuest";
import { exploreForrest, exploreForrestStartNodeIds } from "./exploreForrest";

export const adventures: Record<string, Record<string, AdventureNode>> = {
  intro,
  village,
  smeden,
  ruins,
  witchCottage,
  playerHQ,
  places,
  vardshuset,
  mayors,
  witchIntroQuest,
  woodcuttersHut,
  byHus1: byHus,
  byHus2: byHus,
  byHus3: byHus,
  byHus4: byHus,
  exploreForrest,
  banditCamp,
};

const randomizedAdventureStartNodeIds: Record<string, string[]> = {
  exploreForrest: exploreForrestStartNodeIds,
};

export function getRandomAdventureStartNodeId(
  adventureId: string,
): string | undefined {
  const startNodeIds = randomizedAdventureStartNodeIds[adventureId];

  if (!startNodeIds) {
    return undefined;
  }

  if (startNodeIds.length === 0) {
    throw new Error(`Adventure "${adventureId}" has no encounter start nodes.`);
  }

  const startNodeId =
    startNodeIds[Math.floor(Math.random() * startNodeIds.length)];

  if (!startNodeId) {
    throw new Error(
      `Adventure "${adventureId}" has an invalid encounter list.`,
    );
  }

  return startNodeId;
}
