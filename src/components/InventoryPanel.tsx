import { usePlayer } from "../context/usePlayer";
import { items } from "../data/items";
import "./InventoryPanel.css";
import { useState } from "react";

function InventoryPanel() {
  const { player, setPlayer } = usePlayer();
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);
  //my drag states
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [dragPosition, setDragPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [dragOffset, setDragOffset] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const cells = [];
  const canPlaceItem = (itemId: string, x: number, y: number): boolean => {
    const item = items.find((item) => item.id === itemId);

    if (!item) {
      return false;
    }

    for (const shapeCell of item.shape) {
      const targetX = x + shapeCell.x;
      const targetY = y + shapeCell.y;

      // Out of bounds of the backpack
      if (
        targetX < 0 ||
        targetX >= player.BackpackWidth ||
        targetY < 0 ||
        targetY >= player.BackpackHeight
      ) {
        return false;
      }

      // Check every other items
      for (const otherInventoryItem of player.Inventory) {
        // no collide
        if (otherInventoryItem.itemId === itemId) {
          continue;
        }

        const otherItem = items.find(
          (item) => item.id === otherInventoryItem.itemId,
        );

        if (!otherItem) {
          continue;
        }

        // Check the other item shape
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

  for (let y = 0; y < player.BackpackHeight; y++) {
    for (let x = 0; x < player.BackpackWidth; x++) {
      cells.push(<div key={`${x}-${y}`} className="inventory-cell" />);
    }
  }

  return (
    <aside className="inventory-panel">
      <h2>Ryggsäck</h2>
      <h3 className="gold">🪙 {player.Gold} 🪙</h3>

      <div //the backpack
        //the inventory grid
        className="inventory-grid"
        style={{
          gridTemplateColumns: `repeat(${player.BackpackWidth}, 32px)`,
          gridTemplateRows: `repeat(${player.BackpackHeight}, 32px)`,
        }}
        //Drag Over event
        onDragOver={(event) => {
          event.preventDefault();

          const rect = event.currentTarget.getBoundingClientRect();

          const mouseX = Math.floor((event.clientX - rect.left - 4) / 34);

          const mouseY = Math.floor((event.clientY - rect.top - 4) / 34);

          if (dragOffset) {
            setDragPosition({
              x: mouseX - dragOffset.x,
              y: mouseY - dragOffset.y,
            });
          }
        }}
        //drop item event
        onDrop={(event) => {
          event.preventDefault();

          if (!draggedItemId || !dragPosition) {
            return;
          }

          if (!canPlaceItem(draggedItemId, dragPosition.x, dragPosition.y)) {
            setDraggedItemId(null);
            setDragPosition(null);
            return;
          }

          setPlayer((currentPlayer) => ({
            ...currentPlayer,
            Inventory: currentPlayer.Inventory.map((inventoryItem) =>
              inventoryItem.itemId === draggedItemId
                ? {
                    ...inventoryItem,
                    x: dragPosition.x,
                    y: dragPosition.y,
                  }
                : inventoryItem,
            ),
          }));

          setDraggedItemId(null);
          setDragPosition(null);
        }}
      >
        {cells}

        {player.Inventory.map((inventoryItem) => {
          const item = items.find((item) => item.id === inventoryItem.itemId);

          if (!item) {
            return null;
          }

          const itemWidth = Math.max(...item.shape.map((cell) => cell.x)) + 1;
          const itemHeight = Math.max(...item.shape.map((cell) => cell.y)) + 1;

          // START OF RETURN
          return (
            <div
              key={inventoryItem.itemId}
              className="inventory-item"
              draggable
              // ON DRAG START IS HERE
              onDragStart={(event) => {
                setDraggedItemId(inventoryItem.itemId);

                const rect = event.currentTarget.getBoundingClientRect();

                const localX = Math.floor((event.clientX - rect.left) / 34);
                const localY = Math.floor((event.clientY - rect.top) / 34);

                const grabbedShapeCell = item.shape.find(
                  (shapeCell) =>
                    shapeCell.x === localX && shapeCell.y === localY,
                );

                if (grabbedShapeCell) {
                  setDragOffset({
                    x: grabbedShapeCell.x,
                    y: grabbedShapeCell.y,
                  });
                }
              }}
              style={{
                left: `${inventoryItem.x * 34 + 4}px`,
                top: `${inventoryItem.y * 34 + 4}px`,
                width: `${itemWidth * 32 + (itemWidth - 1) * 2}px`,
                height: `${itemHeight * 32 + (itemHeight - 1) * 2}px`,
              }}
              onMouseEnter={() => setHoveredItemId(inventoryItem.itemId)}
              onMouseLeave={() => setHoveredItemId(null)}
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

              {hoveredItemId === inventoryItem.itemId && (
                <div className="item-tooltip">{item.name}</div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}

export default InventoryPanel;
