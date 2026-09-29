import { useState } from "react";
import type { InventoryItem } from "../data/player";
import { ItemDragContext } from "./ItemDragContext";

export function ItemDragProvider({ children }: { children: React.ReactNode }) {
  const [draggedItem, setDraggedItem] = useState<InventoryItem | null>(null);

  const [dragSourceId, setDragSourceId] = useState<string | null>(null);
  const [removeFromSource, setRemoveFromSource] = useState<(() => void) | null>(
    null,
  );

  const [dragOffset, setDragOffset] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const [pointerPosition, setPointerPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  function startDrag(
    item: InventoryItem,
    sourceId: string,
    removeItemFromSource: () => void,
    offset: {
      x: number;
      y: number;
    },
    pointer: {
      x: number;
      y: number;
    },
  ) {
    setDraggedItem(item);
    setDragSourceId(sourceId);
    setRemoveFromSource(() => removeItemFromSource);
    setDragOffset(offset);
    setPointerPosition(pointer);
  }

  function updatePointerPosition(pointer: { x: number; y: number }) {
    setPointerPosition(pointer);
  }

  function endDrag() {
    setDraggedItem(null);
    setDragSourceId(null);
    setRemoveFromSource(null);
    setDragOffset(null);
    setPointerPosition(null);
  }

  return (
    <ItemDragContext.Provider
      value={{
        draggedItem,
        dragSourceId,
        removeFromSource,
        dragOffset,
        pointerPosition,
        startDrag,
        updatePointerPosition,
        endDrag,
      }}
    >
      {children}
    </ItemDragContext.Provider>
  );
}
