import { items } from "../data/items";
import type { ContainerItem } from "../data/containerItems";
import type { ContainerType } from "../data/containerTypes";
import type { Player } from "../data/player";
import type { Trader, TraderInventoryItem } from "../data/traders/tradersTypes";

import { getDropOperation } from "./getDropOperation";
import type { TransactionResult } from "./transactionTypes";

type PerformTransactionArgs = {
  item: ContainerItem;

  sourceId: string;
  sourceType: ContainerType;

  destinationId: string;
  destinationType: ContainerType;

  position: {
    x: number;
    y: number;
  };

  player: Player;
  trader?: Trader;
};

export type PerformTransactionOutput = TransactionResult & {
  player: Player;
  trader?: Trader;
};

export function performTransaction({
  item,
  sourceId,
  sourceType,
  destinationId,
  destinationType,
  position,
  player,
  trader,
}: PerformTransactionArgs): PerformTransactionOutput {
  const operation = getDropOperation(sourceType, destinationType);

  if (!operation) {
    return {
      success: false,
      reason: "invalid_transaction",
      player,
      trader,
    };
  }

  switch (operation) {
    case "buy":
      return performBuy({
        item,
        sourceId,
        destinationId,
        position,
        player,
        trader,
      });

    case "sell":
      return performSell({
        item,
        sourceId,
        destinationId,
        position,
        player,
        trader,
      });

    case "pickup":
      return performPickup({
        item,
        sourceId,
        destinationId,
        position,
        player,
        trader,
      });

    default:
      return {
        success: false,
        reason: "invalid_transaction",
        player,
        trader,
      };
  }
}

type TransactionHandlerArgs = {
  item: ContainerItem;

  sourceId: string;
  destinationId: string;

  position: {
    x: number;
    y: number;
  };

  player: Player;
  trader?: Trader;
};

function performPickup({
  item,
  sourceId,
  destinationId,
  position,
  player,
  trader,
}: TransactionHandlerArgs): PerformTransactionOutput {
  /*
   * Loot can only be picked up into the player's inventory.
   */
  if (sourceId === "" || destinationId !== "player") {
    return {
      success: false,
      reason: "invalid_transaction",
      player,
      trader,
    };
  }

  /*
   * The item being picked up must actually be a known item.
   */
  const itemDefinition = items.find(
    (itemDefinition) => itemDefinition.id === item.itemId,
  );

  if (!itemDefinition) {
    return {
      success: false,
      reason: "invalid_transaction",
      player,
      trader,
    };
  }

  /*
   * ItemGrid has already checked that the item fits in the
   * player's inventory at this position.
   *
   * We therefore create a new ContainerItem at that position.
   */
  const playerItem: ContainerItem = {
    containerItemId: item.containerItemId,
    itemId: item.itemId,
    x: position.x,
    y: position.y,
  };

  const updatedPlayer: Player = {
    ...player,
    Inventory: [...player.Inventory, playerItem],
  };

  return {
    success: true,
    player: updatedPlayer,
    trader,
  };
}

function performBuy({
  item,
  sourceId,
  destinationId,
  position,
  player,
  trader,
}: TransactionHandlerArgs): PerformTransactionOutput {
  if (!trader) {
    return {
      success: false,
      reason: "invalid_transaction",
      player,
      trader,
    };
  }

  if (sourceId !== `trader-${trader.id}`) {
    return {
      success: false,
      reason: "invalid_transaction",
      player,
      trader,
    };
  }

  if (destinationId !== "player") {
    return {
      success: false,
      reason: "invalid_transaction",
      player,
      trader,
    };
  }

  const traderItem = trader.inventory.find(
    (inventoryItem) => inventoryItem.containerItemId === item.containerItemId,
  );

  if (!traderItem) {
    return {
      success: false,
      reason: "invalid_transaction",
      player,
      trader,
    };
  }

  if (player.Gold < traderItem.buyPrice) {
    return {
      success: false,
      reason: "not_enough_gold",
      player,
      trader,
    };
  }

  /*
   * A TraderInventoryItem becomes an ordinary ContainerItem
   * when it enters the player's inventory.
   *
   * buyPrice belongs to the trader's inventory entry,
   * not to the physical item itself.
   */
  const playerItem: ContainerItem = {
    containerItemId: traderItem.containerItemId,
    itemId: traderItem.itemId,
    x: position.x,
    y: position.y,
  };

  const updatedPlayer: Player = {
    ...player,
    Gold: player.Gold - traderItem.buyPrice,
    Inventory: [...player.Inventory, playerItem],
  };

  const updatedTrader: Trader = {
    ...trader,
    inventory: trader.inventory.filter(
      (inventoryItem) =>
        inventoryItem.containerItemId !== traderItem.containerItemId,
    ),
  };

  return {
    success: true,
    player: updatedPlayer,
    trader: updatedTrader,
  };
}

function performSell({
  item,
  sourceId,
  destinationId,
  position,
  player,
  trader,
}: TransactionHandlerArgs): PerformTransactionOutput {
  if (!trader) {
    return {
      success: false,
      reason: "invalid_transaction",
      player,
      trader,
    };
  }

  if (sourceId !== "player") {
    return {
      success: false,
      reason: "invalid_transaction",
      player,
      trader,
    };
  }

  if (destinationId !== `trader-${trader.id}`) {
    return {
      success: false,
      reason: "invalid_transaction",
      player,
      trader,
    };
  }

  const playerItem = player.Inventory.find(
    (inventoryItem) => inventoryItem.containerItemId === item.containerItemId,
  );

  if (!playerItem) {
    return {
      success: false,
      reason: "invalid_transaction",
      player,
      trader,
    };
  }

  const itemDefinition = items.find(
    (itemDefinition) => itemDefinition.id === playerItem.itemId,
  );

  if (!itemDefinition) {
    return {
      success: false,
      reason: "invalid_transaction",
      player,
      trader,
    };
  }

  /*
   * The player receives the item's intrinsic base value
   * when selling it.
   */
  const sellPrice = itemDefinition.baseValue;

  /*
   * When the trader receives the item, it becomes a
   * TraderInventoryItem.
   *
   * The trader's future asking price is 25% above
   * the item's base value.
   */
  const buyPrice = Math.round(itemDefinition.baseValue * 1.25);

  const traderItem: TraderInventoryItem = {
    containerItemId: playerItem.containerItemId,
    itemId: playerItem.itemId,
    x: position.x,
    y: position.y,
    buyPrice,
  };

  const updatedPlayer: Player = {
    ...player,
    Gold: player.Gold + sellPrice,
    Inventory: player.Inventory.filter(
      (inventoryItem) =>
        inventoryItem.containerItemId !== playerItem.containerItemId,
    ),
  };

  const updatedTrader: Trader = {
    ...trader,
    inventory: [...trader.inventory, traderItem],
  };

  return {
    success: true,
    player: updatedPlayer,
    trader: updatedTrader,
  };
}
