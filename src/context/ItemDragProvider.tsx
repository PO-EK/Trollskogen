import { useState } from "react";
import type { ContainerItem } from "../data/containerItems";
import { ItemDragContext } from "./ItemDragContext";
import type { ContainerType } from "../data/containerTypes";

export function ItemDragProvider({ children }: { children: React.ReactNode }) {
  const [draggedItem, setDraggedItem] = useState<ContainerItem | null>(null);
  const [dragSourceType, setDragSourceType] = useState<ContainerType | null>(
    null,
  );
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
    item: ContainerItem,
    sourceId: string,
    sourceType: ContainerType,
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
    setDragSourceType(sourceType);
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
    setDragSourceType(null);
    setRemoveFromSource(null);
    setDragOffset(null);
    setPointerPosition(null);
  }

  return (
    <ItemDragContext.Provider
      value={{
        draggedItem,
        dragSourceId,
        dragSourceType,
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
