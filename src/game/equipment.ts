import type { EquipmentSlot, GameItem } from "../data/itemTypes";

// Record<...> makes TypeScript complain if you add a slot and forget it here.
export const SLOT_LABELS: Record<EquipmentSlot, string> = {
  mainHand: "Huvudhand",
  offHand: "Andra handen",
  head: "Huvud",
  body: "Kropp",
  feet: "Fötter",
  hands: "Händer",
};

const SLOT_ID_PREFIX = "equip-";

// Container ids follow the same convention as "trader-<id>".
export function equipSlotId(slot: EquipmentSlot): string {
  return `${SLOT_ID_PREFIX}${slot}`;
}

export function parseEquipSlotId(id: string): EquipmentSlot | null {
  if (!id.startsWith(SLOT_ID_PREFIX)) {
    return null;
  }

  const name = id.slice(SLOT_ID_PREFIX.length);

  return (
    (Object.keys(SLOT_LABELS) as EquipmentSlot[]).find(
      (slot) => slot === name,
    ) ?? null
  );
}

export function canEquipInSlot(item: GameItem, slot: EquipmentSlot): boolean {
  return (
    (item.category === "weapon" || item.category === "armour") &&
    item.slot === slot
  );
}
