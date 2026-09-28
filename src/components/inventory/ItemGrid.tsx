import { useState } from "react";
import { items } from "../../data/items";
import type { InventoryItem } from "../../data/player";
import "./ItemGrid.css";

type ItemGridProps = {
  width: number;
  height: number;
  inventory: InventoryItem[];
  onInventoryChange: (inventory: InventoryItem[]) => void;
  onHoveredItemChange?: (itemId: string | null) => void;
};

function ItemGrid({
  width,
  height,
  inventory,
  onInventoryChange,
  onHoveredItemChange,
}: ItemGridProps) {
  // Drag states
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);

  const [dragPosition, setDragPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const [dragOffset, setDragOffset] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const [pointerPosition, setPointerPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  // --------------------------------------------------
  // Check if an item can be placed
  // --------------------------------------------------

  const canPlaceItem = (itemId: string, x: number, y: number): boolean => {
    const item = items.find((item) => item.id === itemId);

    if (!item) {
      return false;
    }

    for (const shapeCell of item.shape) {
      const targetX = x + shapeCell.x;
      const targetY = y + shapeCell.y;

      // Outside the container
      if (targetX < 0 || targetX >= width || targetY < 0 || targetY >= height) {
        return false;
      }

      // Check against other items
      for (const otherInventoryItem of inventory) {
        // Don't collide with ourselves
        if (otherInventoryItem.itemId === itemId) {
          continue;
        }

        const otherItem = items.find(
          (item) => item.id === otherInventoryItem.itemId,
        );

        if (!otherItem) {
          continue;
        }

        for (const otherShapeCell of otherItem.shape) {
          const otherX = otherInventoryItem.x + otherShapeCell.x;

          const otherY = otherInventoryItem.y + otherShapeCell.y;

          if (targetX === otherX && targetY === otherY) {
            return false;
          }
        }
      }
    }

    return true;
  };

  // --------------------------------------------------
  // Determine preview state of one cell
  // --------------------------------------------------

  const getPreviewCellState = (
    x: number,
    y: number,
  ): "valid" | "invalid" | null => {
    if (!draggedItemId || !dragPosition) {
      return null;
    }

    const item = items.find((item) => item.id === draggedItemId);

    if (!item) {
      return null;
    }

    const relativeX = x - dragPosition.x;
    const relativeY = y - dragPosition.y;

    const isShapeCell = item.shape.some(
      (shapeCell) => shapeCell.x === relativeX && shapeCell.y === relativeY,
    );

    if (!isShapeCell) {
      return null;
    }

    const isValid = canPlaceItem(draggedItemId, dragPosition.x, dragPosition.y);

    return isValid ? "valid" : "invalid";
  };

  // --------------------------------------------------
  // Create grid cells
  // --------------------------------------------------

  const cells = [];

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const previewState = getPreviewCellState(x, y);

      cells.push(
        <div
          key={`${x}-${y}`}
          className={`inventory-cell ${
            previewState === "valid"
              ? "inventory-cell-preview-valid"
              : previewState === "invalid"
                ? "inventory-cell-preview-invalid"
                : ""
          }`}
        />,
      );
    }
  }

  // --------------------------------------------------
  // Render
  // --------------------------------------------------

  return (
    <div
      className="inventory-grid"
      style={{
        gridTemplateColumns: `repeat(${width}, 32px)`,
        gridTemplateRows: `repeat(${height}, 32px)`,
      }}
      onPointerMove={(event) => {
        if (!draggedItemId || !dragOffset) {
          return;
        }

        setPointerPosition({
          x: event.clientX,
          y: event.clientY,
        });

        const rect = event.currentTarget.getBoundingClientRect();

        const mouseX = Math.floor((event.clientX - rect.left - 4) / 34);

        const mouseY = Math.floor((event.clientY - rect.top - 4) / 34);

        setDragPosition({
          x: mouseX - dragOffset.x,
          y: mouseY - dragOffset.y,
        });
      }}
      onPointerUp={() => {
        if (!draggedItemId || !dragPosition) {
          return;
        }

        if (!canPlaceItem(draggedItemId, dragPosition.x, dragPosition.y)) {
          setDraggedItemId(null);
          setDragPosition(null);
          setDragOffset(null);
          setPointerPosition(null);

          return;
        }

        onInventoryChange(
          inventory.map((inventoryItem) =>
            inventoryItem.itemId === draggedItemId
              ? {
                  ...inventoryItem,
                  x: dragPosition.x,
                  y: dragPosition.y,
                }
              : inventoryItem,
          ),
        );

        setDraggedItemId(null);
        setDragPosition(null);
        setDragOffset(null);
        setPointerPosition(null);
      }}
    >
      {cells}

      {/* DOM drag preview */}
      {draggedItemId &&
        pointerPosition &&
        (() => {
          const draggedItem = items.find((item) => item.id === draggedItemId);

          if (!draggedItem) {
            return null;
          }

          const itemWidth =
            Math.max(...draggedItem.shape.map((cell) => cell.x)) + 1;

          const itemHeight =
            Math.max(...draggedItem.shape.map((cell) => cell.y)) + 1;

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
                src={draggedItem.image}
                alt={draggedItem.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",

                  transform: `
                    translate(
                      ${draggedItem.imageOffsetX ?? 0}px,
                      ${draggedItem.imageOffsetY ?? 0}px
                    )
                    scale(${draggedItem.imageScale ?? 1})
                  `,
                }}
              />
            </div>
          );
        })()}

      {/* Items */}
      {inventory.map((inventoryItem) => {
        const item = items.find((item) => item.id === inventoryItem.itemId);

        if (!item) {
          return null;
        }

        const itemWidth = Math.max(...item.shape.map((cell) => cell.x)) + 1;

        const itemHeight = Math.max(...item.shape.map((cell) => cell.y)) + 1;

        return (
          <div
            key={inventoryItem.itemId}
            className="inventory-item"
            onPointerDown={(event) => {
              event.preventDefault();

              const rect = event.currentTarget.getBoundingClientRect();

              const localX = Math.floor((event.clientX - rect.left) / 34);
              const localY = Math.floor((event.clientY - rect.top) / 34);

              const grabbedShapeCell = item.shape.find(
                (shapeCell) => shapeCell.x === localX && shapeCell.y === localY,
              );

              if (!grabbedShapeCell) {
                return;
              }

              setDraggedItemId(inventoryItem.itemId);

              setDragOffset({
                x: grabbedShapeCell.x,
                y: grabbedShapeCell.y,
              });

              setDragPosition({
                x: inventoryItem.x,
                y: inventoryItem.y,
              });

              setPointerPosition({
                x: event.clientX,
                y: event.clientY,
              });
            }}
            onMouseEnter={() => onHoveredItemChange?.(inventoryItem.itemId)}
            onMouseLeave={() => onHoveredItemChange?.(null)}
            style={{
              left: `${inventoryItem.x * 34 + 4}px`,
              top: `${inventoryItem.y * 34 + 4}px`,

              width: `${itemWidth * 32 + (itemWidth - 1) * 2}px`,
              height: `${itemHeight * 32 + (itemHeight - 1) * 2}px`,

              opacity: draggedItemId === inventoryItem.itemId ? 0 : 1,
            }}
          >
            {" "}
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
      })}
    </div>
  );
}

export default ItemGrid;
