import { useState } from "react";
import { usePlayer } from "../../context/usePlayer";
import { items } from "../../data/items";
import ItemGrid from "./ItemGrid";
import "./InventoryPanel.css";

function InventoryPanel() {
  const { player, setPlayer } = usePlayer();

  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);

  return (
    <aside className="inventory-panel">
      <h3 className="gold">🪙 {player.Gold} 🪙</h3>

      <div className="inventory-item-name">
        {hoveredItemId
          ? items.find((item) => item.id === hoveredItemId)?.name
          : "Ryggsäcken"}
      </div>

      <ItemGrid
        containerId="player"
        width={player.BackpackWidth}
        height={player.BackpackHeight}
        inventory={player.Inventory}
        onInventoryChange={(newInventory) => {
          setPlayer((currentPlayer) => ({
            ...currentPlayer,
            Inventory: newInventory,
          }));
        }}
        onItemRemoved={(inventoryId) => {
          setPlayer((currentPlayer) => ({
            ...currentPlayer,
            Inventory: currentPlayer.Inventory.filter(
              (item) => item.inventoryId !== inventoryId,
            ),
          }));
        }}
        onHoveredItemChange={setHoveredItemId}
      />
    </aside>
  );
}

export default InventoryPanel;
