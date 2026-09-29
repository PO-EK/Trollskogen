import { items } from "../../data/items";
import { useItemDrag } from "../../context/useItemDrag";
import "./DragPreview.css";

function DragPreview() {
  const { draggedItem, dragOffset, pointerPosition } = useItemDrag();

  if (!draggedItem || !pointerPosition) {
    return null;
  }

  const item = items.find((item) => item.id === draggedItem.itemId);

  if (!item) {
    return null;
  }

  const itemWidth = Math.max(...item.shape.map((cell) => cell.x)) + 1;

  const itemHeight = Math.max(...item.shape.map((cell) => cell.y)) + 1;

  return (
    <div
      className="inventory-drag-preview"
      style={{
        left: pointerPosition.x,
        top: pointerPosition.y,
        width: `${itemWidth * 32 + (itemWidth - 1) * 2}px`,
        height: `${itemHeight * 32 + (itemHeight - 1) * 2}px`,
        transform: `translate(
          ${-(dragOffset?.x ?? 0) * 34}px,
          ${-(dragOffset?.y ?? 0) * 34}px
        )`,
      }}
    >
      <img
        src={item.image}
        alt={item.name}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          transform: `
            translate(
              ${item.imageOffsetX ?? 0}px,
              ${item.imageOffsetY ?? 0}px
            )
            scale(${item.imageScale ?? 1})
          `,
        }}
      />
    </div>
  );
}

export default DragPreview;
