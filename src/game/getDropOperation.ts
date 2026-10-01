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

  if (destinationType === "quest") {
    return "quest";
  }

  return null;
}
