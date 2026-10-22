import { items } from "../data/items";
import type { ItemUse } from "../data/itemTypes";

// The combat effect of an item, or null if it can't be used.
export function getItemUse(itemId: string): ItemUse | null {
  const definition = items.find((item) => item.id === itemId);

  if (
    !definition ||
    definition.category === "weapon" ||
    definition.category === "armour"
  ) {
    return null;
  }

  return definition.use ?? null;
}
