import type { ContainerType } from "../data/containerTypes";
import type { DragOperation } from "../data/itemDragTypes";

export function getDropOperation(
  sourceType: ContainerType,
  destinationType: ContainerType,
): DragOperation | null {
  if (sourceType === "player" && destinationType === "player") {
    return "move";
  }

  if (sourceType === "trader" && destinationType === "player") {
    return "buy";
  }

  if (sourceType === "player" && destinationType === "trader") {
    return "sell";
  }

  if (sourceType === "loot" && destinationType === "player") {
    return "pickup";
  }

  if (sourceType === "player" && destinationType === "chest") {
    return "store";
  }

  if (sourceType === "chest" && destinationType === "player") {
    return "retrieve";
  }

  if (sourceType === "player" && destinationType === "equipment") {
    return "equip";
  }

  if (sourceType === "equipment" && destinationType === "player") {
    return "unequip";
  }

  if (destinationType === "quest") {
    return "quest";
  }
  if (sourceType === "player" && destinationType === "useSlot") {
    return "use";
  }

  return null;
}
