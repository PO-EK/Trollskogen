import type { EquipmentSlot, GameItem } from "../data/itemTypes";
import type { Player } from "../data/player";
import { items } from "../data/items";

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

export function equippedItem(
  player: Player,
  itemId: string,
  containerItemId?: string,
): Player {
  const definition = items.find((item) => item.id === itemId);

  if (
    !definition ||
    (definition.category !== "weapon" && definition.category !== "armour")
  ) {
    throw new Error(`Cannot equip item "${itemId}".`);
  }

  const existingIds = [
    ...player.Inventory.map((item) => item.containerItemId),
    ...player.Storage.map((item) => item.containerItemId),
    ...Object.values(player.Equipment).flatMap((item) =>
      item ? [item.containerItemId] : [],
    ),
  ];

  let newContainerItemId = containerItemId;
  if (newContainerItemId) {
    if (existingIds.includes(newContainerItemId)) {
      throw new Error(`Duplicate container item id "${newContainerItemId}".`);
    }
  } else {
    let suffix = 1;
    newContainerItemId = `${itemId}-${suffix}`;

    while (existingIds.includes(newContainerItemId)) {
      suffix += 1;
      newContainerItemId = `${itemId}-${suffix}`;
    }
  }

  return {
    ...player,
    Equipment: {
      ...player.Equipment,
      [definition.slot]: {
        containerItemId: newContainerItemId,
        itemId,
        x: 0,
        y: 0,
      },
    },
  };
}
