import { useState } from "react";
import { usePlayer } from "../../context/usePlayer";
import { useTrader } from "../../context/useTrader";
import type { ContainerItem } from "../../data/containerItems";
import type { ContainerType } from "../../data/containerTypes";
import ItemGrid from "./ItemGrid";
import "./InventoryPanel.css";
import { performTransaction } from "../../game/performTransaction";
import ItemCard from "./ItemCard";
import ItemDeleteSlot from "./ItemDeleteSlot";
import ItemUseSlot from "./ItemUseSlot";
import type { ItemUse } from "../../data/itemTypes";
import { getWorldBlockReason, USE_SLOT_ID } from "../../game/itemUse";

type InventoryPanelProps = {
  inCombat?: boolean; // the slot in the fight handles items there
};

function InventoryPanel({ inCombat = false }: InventoryPanelProps) {
  const { player, setPlayer } = usePlayer();
  const { traders, setTraders } = useTrader();

  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);
  function handleUseItem(
    item: ContainerItem,
    _use: ItemUse,
    sourceId: string,
    sourceType: ContainerType,
  ): boolean {
    const result = performTransaction({
      item,
      sourceId,
      sourceType,
      destinationId: USE_SLOT_ID,
      destinationType: "useSlot",
      position: { x: 0, y: 0 },
      player,
    });

    if (result.success) {
      setPlayer(result.player);
    }

    return false;
  }
  function handleCrossContainerDrop(
    item: ContainerItem,
    position: { x: number; y: number },
    sourceId: string,
    sourceType: ContainerType,
  ): boolean {
    let trader;

    if (sourceType === "trader") {
      trader = traders.find((trader) => `trader-${trader.id}` === sourceId);

      if (!trader) {
        return false;
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
      return false;
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
     * Loot lives in temporary local state that performTransaction can't
     * touch, so ItemGrid has to remove it from the loot container.
     *
     * Buy and retrieve already updated their source (trader / storage)
     * inside the transaction, so they return false here.
     */
    return sourceType === "loot";
  }

  return (
    <aside className="inventory-panel">
      <h3 className="gold">🪙 {player.Gold} Kroner</h3>

      <div className="inventory-action-slots">
        {!inCombat && (
          <ItemUseSlot
            getBlockReason={(use) => getWorldBlockReason(player, use)}
            onUse={handleUseItem}
          />
        )}
        <ItemDeleteSlot />
      </div>
      <div className="inventory-panel-title">Ryggsäcken</div>
      <div className="inventory-grid-wrapper">
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
      </div>

      <ItemCard itemId={hoveredItemId} />
    </aside>
  );
}

export default InventoryPanel;
