import { village } from "./village";
import type { AdventureNode } from "../adventureTypes";
import { intro } from "./intro";
import { ruins } from "./ruins";
import { witchHut } from "./witchHut";
import { smeden } from "./smeden";
import { playerHQ } from "../places/playerHQ";
import { places } from "../places/places";
import { vardshuset } from "../places/Värdshuset";
import { mayors } from "../places/mayors";

export const adventures: Record<string, Record<string, AdventureNode>> = {
  intro,
  village,
  smeden,
  ruins,
  witchHut,
  playerHQ,
  places,
  vardshuset,
  mayors,
};
