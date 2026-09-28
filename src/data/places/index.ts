import { gamlahem } from "./gamlahem";
import { village } from "./village";
import type { AdventureNode } from "../adventureTypes";
import { intro } from "./intro";

export const adventures: Record<string, Record<string, AdventureNode>> = {
  gamlahem,
  intro,
  village,
};
