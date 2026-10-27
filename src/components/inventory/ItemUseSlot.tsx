import { useState } from "react";
import { useItemDrag } from "../../context/useItemDrag";
import type { ContainerItem } from "../../data/containerItems";
import type { ContainerType } from "../../data/containerTypes";
import type { ItemUse } from "../../data/itemTypes";
import { getItemUse } from "../../game/itemUse";
import "./ItemUseSlot.css";

type ItemUseSlotProps = {
  // Why this item can't be used right now, or null if it can. Each place
  // decides: combat checks whose turn it is, the world checks hp and mana.
  getBlockReason: (use: ItemUse) => string | null;

  // Called when a usable item is dropped. Return true if the slot should
  // delete the item from the backpack, false if you already took care of it.
  // (Same idea as ItemGrid's onCrossContainerDrop.)
  onUse: (
    item: ContainerItem,
    use: ItemUse,
    sourceId: string,
    sourceType: ContainerType,
  ) => boolean;
};

// A square to drop a potion or bandage on. It never changes game state itself.
function ItemUseSlot({ getBlockReason, onUse }: ItemUseSlotProps) {
  const {
    draggedItem,
    dragSourceId,
    dragSourceType,
    removeFromSource,
    updatePointerPosition,
    endDrag,
  } = useItemDrag();
  const [isOver, setIsOver] = useState(false);

  const use =
    draggedItem && dragSourceType === "player"
      ? getItemUse(draggedItem.itemId)
      : null;

  // Why the dragged item can't be used, or null if it can.
  let blockReason: string | null = null;

  if (draggedItem) {
    if (dragSourceType !== "player") {
      blockReason = "Bara föremål från ryggsäcken.";
    } else if (!use) {
      blockReason = "Det går inte att använda.";
    } else {
      blockReason = getBlockReason(use);
    }
  }

  const dragState = draggedItem
    ? blockReason
      ? "invalid"
      : "valid"
    : undefined;

  function handlePointerUp() {
    setIsOver(false);

    if (!draggedItem) {
      return;
    }

    if (use && blockReason === null && dragSourceId && dragSourceType) {
      const shouldRemove = onUse(
        draggedItem,
        use,
        dragSourceId,
        dragSourceType,
      );

      if (shouldRemove) {
        removeFromSource?.(); // the backpack deletes the item
      }
    }

    endDrag();
  }

  return (
    <div
      className="item-use-slot"
      data-drag-state={dragState}
      data-over={isOver}
      title={blockReason ?? "Dra en dryck eller ett bandage hit"}
      onPointerEnter={() => setIsOver(true)}
      onPointerLeave={() => setIsOver(false)}
      onPointerMove={(event) => {
        if (draggedItem) {
          updatePointerPosition({ x: event.clientX, y: event.clientY });
        }
      }}
      onPointerUp={handlePointerUp}
    >
      {isOver && blockReason ? (
        <span className="item-use-slot-reason">{blockReason}</span>
      ) : (
        <>
          <span className="item-use-slot-icon">🧪</span>
          <span>Använd</span>
        </>
      )}
    </div>
  );
}

export default ItemUseSlot;
