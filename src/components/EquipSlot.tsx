import { useState } from "react";
import { usePlayer } from "../context/usePlayer";
import { useItemDrag } from "../context/useItemDrag";
import { items } from "../data/items";
import type { EquipmentSlot } from "../data/itemTypes";
import { canEquipInSlot, equipSlotId, SLOT_LABELS } from "../game/equipment";
import { findFirstAvailableItemPosition } from "../game/inventory";
import { performTransaction } from "../game/performTransaction";

type EquipSlotProps = {
  slot: EquipmentSlot;
  onHoveredItemChange?: (itemId: string | null) => void;
};

function EquipSlot({ slot, onHoveredItemChange }: EquipSlotProps) {
  const { player, setPlayer } = usePlayer();
  const {
    draggedItem,
    dragSourceId,
    dragSourceType,
    startDrag,
    updatePointerPosition,
    endDrag,
  } = useItemDrag();

  const [isOver, setIsOver] = useState(false);

  const equipped = player.Equipment[slot];
  const equippedDefinition = equipped
    ? items.find((definition) => definition.id === equipped.itemId)
    : undefined;

  // While dragging from the backpack, show which slots accept the item.
  let dragState: "valid" | "invalid" | undefined;

  if (draggedItem && dragSourceType === "player") {
    const draggedDefinition = items.find(
      (definition) => definition.id === draggedItem.itemId,
    );

    dragState =
      draggedDefinition &&
      canEquipInSlot(draggedDefinition, slot) &&
      (!equipped ||
        findFirstAvailableItemPosition(
          equipped.itemId,
          player.Inventory.filter(
            (inventoryItem) =>
              inventoryItem.containerItemId !== draggedItem.containerItemId,
          ),
          player.BackpackWidth,
          player.BackpackHeight,
        ) !== null)
        ? "valid"
        : "invalid";
  }

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (!equipped || draggedItem) {
      return;
    }

    event.preventDefault();

    startDrag(
      equipped,
      equipSlotId(slot),
      "equipment",
      // performTransaction already removes the item from the slot on a
      // successful drop, so there is nothing for the drag system to remove.
      () => {},
      { x: 0, y: 0 },
      { x: event.clientX, y: event.clientY },
    );
  }

  function handlePointerUp() {
    setIsOver(false);

    if (!draggedItem || !dragSourceId || !dragSourceType) {
      return;
    }

    const result = performTransaction({
      item: draggedItem,
      sourceId: dragSourceId,
      sourceType: dragSourceType,
      destinationId: equipSlotId(slot),
      destinationType: "equipment",
      position: { x: 0, y: 0 },
      player,
    });

    if (result.success) {
      setPlayer(result.player);
    }

    endDrag();
  }

  return (
    <div
      className={`equip-slot${equipped ? " equip-slot--filled" : ""}`}
      data-slot={slot}
      data-drag-state={dragState}
      data-over={isOver}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerEnter={() => setIsOver(true)}
      onPointerLeave={() => setIsOver(false)}
      onPointerMove={(event) => {
        if (draggedItem) {
          updatePointerPosition({ x: event.clientX, y: event.clientY });
        }
      }}
      onMouseEnter={() => {
        if (equipped) {
          onHoveredItemChange?.(equipped.itemId);
        }
      }}
      onMouseLeave={() => onHoveredItemChange?.(null)}
    >
      {equipped && equippedDefinition ? (
        <img
          className="equip-slot-image"
          src={equippedDefinition.image}
          alt={equippedDefinition.name}
          draggable={false}
          style={{
            // Dim the item while it's being dragged out of this slot.
            opacity:
              draggedItem?.containerItemId === equipped.containerItemId
                ? 0.25
                : 1,
          }}
        />
      ) : (
        <span className="equip-slot-label">{SLOT_LABELS[slot]}</span>
      )}
    </div>
  );
}

export default EquipSlot;
