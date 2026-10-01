import { useState } from "react";
import { items } from "../../data/items";
import { useItemDrag } from "../../context/useItemDrag";
import type { ContainerItem } from "../../data/containerItems";
import type { ContainerType } from "../../data/containerTypes";
import "./ItemGrid.css";

type ItemGridProps<T extends ContainerItem = ContainerItem> = {
  containerId: string;
  containerType: ContainerType;
  width: number;
  height: number;
  inventory: T[];
  onInventoryChange: (inventory: T[]) => void;
  onItemRemoved?: (containerItemId: string) => void;
  onHoveredItemChange?: (itemId: string | null) => void;
  onCrossContainerDrop?: (
    item: ContainerItem,
    position: { x: number; y: number },
    sourceId: string,
    sourceType: ContainerType,
  ) => void;
};

function ItemGrid<T extends ContainerItem>({
  containerId,
  containerType,
  width,
  height,
  inventory,
  onInventoryChange,
  onItemRemoved,
  onHoveredItemChange,
  onCrossContainerDrop,
}: ItemGridProps<T>) {
  const {
    draggedItem,
    dragSourceId,
    dragSourceType,
    dragOffset,
    startDrag,
    updatePointerPosition,
    endDrag,
  } = useItemDrag();

  // Position of the dragged item relative to THIS grid.
  const [dragPosition, setDragPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  // --------------------------------------------------
  // Check if a ContainerItem can be placed
  // --------------------------------------------------

  const canPlaceItem = (
    containerItemToPlace: ContainerItem,
    x: number,
    y: number,
  ): boolean => {
    const item = items.find((item) => item.id === containerItemToPlace.itemId);

    if (!item) {
      return false;
    }

    for (const shapeCell of item.shape) {
      const targetX = x + shapeCell.x;
      const targetY = y + shapeCell.y;

      // Check if the item would be outside the container.
      if (targetX < 0 || targetX >= width || targetY < 0 || targetY >= height) {
        return false;
      }

      // Check if the item would overlap another ContainerItem.
      for (const otherContainerItem of inventory) {
        // An item does not collide with itself.
        if (
          otherContainerItem.containerItemId ===
          containerItemToPlace.containerItemId
        ) {
          continue;
        }

        const otherItem = items.find(
          (item) => item.id === otherContainerItem.itemId,
        );

        if (!otherItem) {
          continue;
        }

        for (const otherShapeCell of otherItem.shape) {
          const otherX = otherContainerItem.x + otherShapeCell.x;

          const otherY = otherContainerItem.y + otherShapeCell.y;

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
    if (!draggedItem || !dragPosition) {
      return null;
    }

    const item = items.find((item) => item.id === draggedItem.itemId);

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

    const isValid = canPlaceItem(draggedItem, dragPosition.x, dragPosition.y);

    return isValid ? "valid" : "invalid";
  };

  // --------------------------------------------------
  // Calculate dragged item position inside this grid
  // --------------------------------------------------

  function getDragPosition(event: React.PointerEvent<HTMLDivElement>) {
    if (!dragOffset) {
      return null;
    }

    const rect = event.currentTarget.getBoundingClientRect();

    const mouseX = Math.floor((event.clientX - rect.left - 4) / 34);

    const mouseY = Math.floor((event.clientY - rect.top - 4) / 34);

    return {
      x: mouseX - dragOffset.x,
      y: mouseY - dragOffset.y,
    };
  }

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
        if (!draggedItem || !dragOffset) {
          return;
        }

        updatePointerPosition({
          x: event.clientX,
          y: event.clientY,
        });

        const newDragPosition = getDragPosition(event);

        if (newDragPosition) {
          setDragPosition(newDragPosition);
        }
      }}
      onPointerEnter={(event) => {
        if (!draggedItem || !dragOffset) {
          return;
        }

        updatePointerPosition({
          x: event.clientX,
          y: event.clientY,
        });

        const newDragPosition = getDragPosition(event);

        if (newDragPosition) {
          setDragPosition(newDragPosition);
        }
      }}
      onPointerUp={(event) => {
        if (!draggedItem || !dragOffset) {
          return;
        }

        const newDragPosition = getDragPosition(event);

        if (!newDragPosition) {
          endDrag();
          setDragPosition(null);
          return;
        }

        const isValid = canPlaceItem(
          draggedItem,
          newDragPosition.x,
          newDragPosition.y,
        );

        if (!isValid) {
          console.log("Drop rejected:", {
            draggedItem,
            newDragPosition,
            containerId,
            containerType,
            inventory,
          });

          endDrag();
          setDragPosition(null);
          return;
        }

        const isSameGrid = dragSourceId === containerId;

        if (isSameGrid) {
          onInventoryChange(
            inventory.map((containerItem) =>
              containerItem.containerItemId === draggedItem.containerItemId
                ? {
                    ...containerItem,
                    x: newDragPosition.x,
                    y: newDragPosition.y,
                  }
                : containerItem,
            ),
          );
        } else if (dragSourceId && dragSourceType) {
          console.log("Cross-container drop:", {
            draggedItem,
            newDragPosition,
            dragSourceId,
            dragSourceType,
            destinationId: containerId,
            destinationType: containerType,
          });

          onCrossContainerDrop?.(
            draggedItem,
            newDragPosition,
            dragSourceId,
            dragSourceType,
          );
        }

        endDrag();
        setDragPosition(null);
      }}
    >
      {cells}

      {/* Items */}
      {inventory.map((containerItem) => {
        const item = items.find((item) => item.id === containerItem.itemId);

        if (!item) {
          return null;
        }

        const itemWidth = Math.max(...item.shape.map((cell) => cell.x)) + 1;

        const itemHeight = Math.max(...item.shape.map((cell) => cell.y)) + 1;

        return (
          <div
            key={containerItem.containerItemId}
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

              startDrag(
                containerItem,
                containerId,
                containerType,
                () => {
                  onItemRemoved?.(containerItem.containerItemId);
                },
                {
                  x: grabbedShapeCell.x,
                  y: grabbedShapeCell.y,
                },
                {
                  x: event.clientX,
                  y: event.clientY,
                },
              );

              setDragPosition({
                x: containerItem.x,
                y: containerItem.y,
              });
            }}
            onMouseEnter={() => onHoveredItemChange?.(containerItem.itemId)}
            onMouseLeave={() => onHoveredItemChange?.(null)}
            style={{
              left: `${containerItem.x * 34 + 4}px`,
              top: `${containerItem.y * 34 + 4}px`,
              width: `${itemWidth * 32 + (itemWidth - 1) * 2}px`,
              height: `${itemHeight * 32 + (itemHeight - 1) * 2}px`,
              opacity:
                draggedItem?.containerItemId === containerItem.containerItemId
                  ? 0
                  : 1,
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
      })}
    </div>
  );
}

export default ItemGrid;
