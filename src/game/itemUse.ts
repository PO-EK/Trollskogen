import { items } from "../data/items";
import type { ItemUse } from "../data/itemTypes";
import type { Player } from "../data/player";
import { getMaxHP } from "./characterStats";
import { getUseBlockReason } from "./effects";
import type { Vitals } from "./effects";

// The drop target for using an item. Same id convention as "equip-<slot>".
export const USE_SLOT_ID = "use-slot";

// The player outside combat: no statuses exist there.
export function getPlayerVitals(player: Player): Vitals {
  return {
    hp: player.HP,
    maxHp: getMaxHP(player),
    mana: player.Mana,
    maxMana: player.ManaMax,
    statuses: [],
  };
}

// Why an item can't be used from the world (outside combat), or null.
export function getWorldBlockReason(
  player: Player,
  use: ItemUse,
): string | null {
  return getUseBlockReason(getPlayerVitals(player), use, false);
}

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

//
