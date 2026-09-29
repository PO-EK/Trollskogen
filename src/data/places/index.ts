import { village } from "./village";
import type { AdventureNode } from "../adventureTypes";
import { intro } from "./intro";
import { ruins } from "./ruins";

export const adventures: Record<string, Record<string, AdventureNode>> = {
  intro,
  village,
  ruins,
};
