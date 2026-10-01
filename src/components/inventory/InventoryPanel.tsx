import { useState } from "react";
import { usePlayer } from "../../context/usePlayer";
import { useTrader } from "../../context/useTrader";
import { useItemDrag } from "../../context/useItemDrag";
import { items } from "../../data/items";
import type { ContainerItem } from "../../data/containerItems";
import type { ContainerType } from "../../data/containerTypes";
import ItemGrid from "./ItemGrid";
import "./InventoryPanel.css";
import { performTransaction } from "../../game/performTransaction";

function InventoryPanel() {
  const { player, setPlayer } = usePlayer();
  const { traders, setTraders } = useTrader();
  const { removeFromSource } = useItemDrag();

  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);

  function handleCrossContainerDrop(
    item: ContainerItem,
    position: { x: number; y: number },
    sourceId: string,
    sourceType: ContainerType,
  ) {
    let trader;

    if (sourceType === "trader") {
      trader = traders.find((trader) => `trader-${trader.id}` === sourceId);

      if (!trader) {
        return;
      }
    }

    const result = performTransaction({
      item,
      sourceId,
      sourceType,
      destinationId: "player",
      destinationType: "player",
      position,
      player,
      trader,
    });

    if (!result.success) {
      return;
    }

    setPlayer(result.player);

    if (result.trader && trader) {
      setTraders((currentTraders) =>
        currentTraders.map((currentTrader) =>
          currentTrader.id === trader.id ? result.trader! : currentTrader,
        ),
      );
    }

    /*
     * The source container owns the item.
     *
     * For pickup, remove the item from the temporary loot
     * container only after the transaction succeeded.
     *
     * Buy/sell use trader/player state updates above instead.
     */
    if (sourceType === "loot") {
      removeFromSource?.();
    }
  }

  return (
    <aside className="inventory-panel">
      <h3 className="gold">🪙 {player.Gold} Kroner</h3>
      Ryggsäcken
      <ItemGrid
        containerId="player"
        containerType="player"
        width={player.BackpackWidth}
        height={player.BackpackHeight}
        inventory={player.Inventory}
        onInventoryChange={(newInventory) => {
          setPlayer((currentPlayer) => ({
            ...currentPlayer,
            Inventory: newInventory,
          }));
        }}
        onItemRemoved={(containerItemId) => {
          setPlayer((currentPlayer) => ({
            ...currentPlayer,
            Inventory: currentPlayer.Inventory.filter(
              (item) => item.containerItemId !== containerItemId,
            ),
          }));
        }}
        onHoveredItemChange={setHoveredItemId}
        onCrossContainerDrop={handleCrossContainerDrop}
      />
      <div className="inventory-item-name">
        {hoveredItemId
          ? items.find((item) => item.id === hoveredItemId)?.name
          : ""}
      </div>
      <div className="inventory-item-value">
        {hoveredItemId
          ? `Värt ${items.find((item) => item.id === hoveredItemId)?.baseValue} Kronor`
          : ""}
      </div>
      <div className="inventory-item-descript">
        {hoveredItemId
          ? items.find((item) => item.id === hoveredItemId)?.description
          : ""}
      </div>
    </aside>
  );
}

export default InventoryPanel;
