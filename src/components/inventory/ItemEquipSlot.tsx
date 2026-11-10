import { useState } from "react";
import { useItemDrag } from "../../context/useItemDrag";
import { usePlayer } from "../../context/usePlayer";
import type { ContainerItem } from "../../data/containerItems";
import type { ContainerType } from "../../data/containerTypes";
import { items } from "../../data/items";
import type { EquipmentSlot } from "../../data/itemTypes";
import { canEquipInSlot } from "../../game/equipment";
import { findFirstAvailableItemPosition } from "../../game/inventory";
import "./ItemEquipSlot.css";

type ItemEquipSlotProps = {
  onEquip: (
    item: ContainerItem,
    slot: EquipmentSlot,
    sourceId: string,
    sourceType: ContainerType,
  ) => void;
};

function ItemEquipSlot({ onEquip }: ItemEquipSlotProps) {
  const { player } = usePlayer();
  const {
    draggedItem,
    dragSourceId,
    dragSourceType,
    updatePointerPosition,
    endDrag,
  } = useItemDrag();
  const [isOver, setIsOver] = useState(false);

  const definition = draggedItem
    ? items.find((item) => item.id === draggedItem.itemId)
    : undefined;
  const slot =
    definition?.category === "weapon" || definition?.category === "armour"
      ? definition.slot
      : null;
  const equipped = slot ? player.Equipment[slot] : undefined;
  const canReplaceEquipped =
    !equipped ||
    findFirstAvailableItemPosition(
      equipped.itemId,
      player.Inventory.filter(
        (item) => item.containerItemId !== draggedItem?.containerItemId,
      ),
      player.BackpackWidth,
      player.BackpackHeight,
    ) !== null;

  let blockReason: string | null = null;

  if (draggedItem) {
    if (dragSourceType !== "player" || dragSourceId !== "player") {
      blockReason = "Bara föremål från ryggsäcken.";
    } else if (!definition || !slot || !canEquipInSlot(definition, slot)) {
      blockReason = "Det går inte att utrusta.";
    } else if (!canReplaceEquipped) {
      blockReason = "Ryggsäcken har inte plats för föremålet som används.";
    }
  }

  const dragState = draggedItem
    ? blockReason
      ? "invalid"
      : "valid"
    : undefined;

  function handlePointerUp() {
    setIsOver(false);

    if (
      draggedItem &&
      slot &&
      blockReason === null &&
      dragSourceId &&
      dragSourceType
    ) {
      onEquip(draggedItem, slot, dragSourceId, dragSourceType);
    }

    endDrag();
  }

  return (
    <div
      className="item-equip-slot"
      data-drag-state={dragState}
      data-over={isOver}
      title={blockReason ?? "Dra ett utrustningsbart föremål hit"}
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
        <span className="item-equip-slot-reason">{blockReason}</span>
      ) : (
        <>
          <span className="item-equip-slot-icon">⚔️</span>
          <span>Utrusta</span>
        </>
      )}
    </div>
  );
}

export default ItemEquipSlot;
