import { createContext } from "react";
import type { ContainerItem } from "../data/containerItems";
import type { ContainerType } from "../data/containerTypes";

export type ItemDragContextType = {
  draggedItem: ContainerItem | null;
  dragSourceId: string | null;
  dragSourceType: ContainerType | null;

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
    item: ContainerItem,
    sourceId: string,
    sourceType: ContainerType,
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
