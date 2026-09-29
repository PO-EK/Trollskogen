import { createContext } from "react";
import type { InventoryItem } from "../data/player";

export type ItemDragContextType = {
  draggedItem: InventoryItem | null;

  dragSourceId: string | null;

  removeFromSource: (() => void) | null;

  dragOffset: {
    x: number;
    y: number;
  } | null;

  pointerPosition: {
    x: number;
    y: number;
  } | null;

  startDrag: (
    item: InventoryItem,
    sourceId: string,
    removeFromSource: () => void,
    dragOffset: {
      x: number;
      y: number;
    },
    pointerPosition: {
      x: number;
      y: number;
    },
  ) => void;

  updatePointerPosition: (pointerPosition: { x: number; y: number }) => void;

  endDrag: () => void;
};

export const ItemDragContext = createContext<ItemDragContextType | null>(null);
