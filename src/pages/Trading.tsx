import { usePlayer } from "../context/usePlayer";
import { useTrader } from "../context/useTrader";
import ItemGrid from "../components/inventory/ItemGrid";
import { useState } from "react";
import type { ContainerItem } from "../data/containerItems";
import type { TraderInventoryItem } from "../data/traders/tradersTypes";
import { items } from "../data/items";
import { performTransaction } from "../game/performTransaction";

type TradingProps = {
  traderId: string | null;
  onReturn: () => void;
};

function Trading({ traderId, onReturn }: TradingProps) {
  const { player, setPlayer } = usePlayer();
  const { traders, setTraders } = useTrader();
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);
  const trader = traders.find((trader) => trader.id === traderId);

  if (!trader) {
    return (
      <div>
        <p>Handlaren kunde inte hittas.</p>

        <button onClick={onReturn}>Tillbaka</button>
      </div>
    );
  }

  const currentTrader = trader;
  const backButtonStyle = {
    padding: "0.5rem",
    fontSize: "1rem",
    fontWeight: 400,
    border: "none",
    borderRadius: "12px",
    background: "linear-gradient(silver, darkgray)",
    color: "black",
    cursor: "pointer",
    boxShadow: "0 8px 20px rgba(99, 102, 241, 0.28)",
    transition: "transform 0.15s ease, box-shadow 0.15s ease",
  } as const;

  function handleInventoryChange(updatedInventory: TraderInventoryItem[]) {
    setTraders((currentTraders) =>
      currentTraders.map((currentTrader) =>
        currentTrader.id === traderId
          ? {
              ...currentTrader,
              inventory: updatedInventory,
            }
          : currentTrader,
      ),
    );
  }

  function handleCrossContainerDrop(
    item: ContainerItem,
    position: { x: number; y: number },
  ) {
    const result = performTransaction({
      item,
      sourceId: "player",
      sourceType: "player",
      destinationId: `trader-${currentTrader.id}`,
      destinationType: "trader",
      position,
      player,
      trader,
    });

    if (!result.success) {
      return;
    }

    setPlayer(result.player);

    if (result.trader) {
      setTraders((currentTraders) =>
        currentTraders.map((currentTrader) =>
          currentTrader.id === currentTrader.id
            ? result.trader!
            : currentTrader,
        ),
      );
    }
  }

  return (
    <div>
      <div>
        <h2>{trader.name}</h2>
        <p>{trader.description}</p>
        Dra ett föremål till ditt inventory för att köpa det.
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <ItemGrid<TraderInventoryItem>
          containerId={`trader-${trader.id}`}
          containerType="trader"
          width={trader.inventoryWidth}
          height={trader.inventoryHeight}
          inventory={trader.inventory}
          onInventoryChange={handleInventoryChange}
          onCrossContainerDrop={handleCrossContainerDrop}
          onHoveredItemChange={setHoveredItemId}
        />
      </div>

      <div>
        {hoveredItemId
          ? items.find((item) => item.id === hoveredItemId)?.name
          : ""}
      </div>
      <div style={{ marginBottom: "20px" }}>
        {hoveredItemId
          ? `Kostnad: ${trader.inventory.find((item) => item.itemId === hoveredItemId)?.buyPrice ?? 0} Kronor`
          : "Peka på ett föremål"}
      </div>

      <button onClick={onReturn} style={backButtonStyle}>
        Tillbaka
      </button>
    </div>
  );
}

export default Trading;
