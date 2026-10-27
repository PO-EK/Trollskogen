import { useState } from "react";
import { useItemDrag } from "../../context/useItemDrag";
import "./ItemDeleteSlot.css";

function ItemDeleteSlot() {
  const {
    draggedItem,
    dragSourceType,
    removeFromSource,
    updatePointerPosition,
    endDrag,
  } = useItemDrag();
  const [isOver, setIsOver] = useState(false);

  const blockReason =
    draggedItem && dragSourceType !== "player"
      ? "Bara föremål från ryggsäcken."
      : null;
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

    if (dragSourceType === "player") {
      removeFromSource?.();
    }

    endDrag();
  }

  return (
    <div
      className="item-delete-slot"
      data-drag-state={dragState}
      data-over={isOver}
      title={blockReason ?? "Dra ett föremål hit för att ta bort det ur ryggsäcken"}
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
        <span className="item-delete-slot-reason">{blockReason}</span>
      ) : (
        <>
          <span className="item-delete-slot-icon">🗑️</span>
          <span>Ta bort</span>
        </>
      )}
    </div>
  );
}

export default ItemDeleteSlot;
