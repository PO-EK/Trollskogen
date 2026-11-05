import type { ContainerItem } from "../data/containerItems";
import { getChestDefinition } from "../data/Chests";
import type { Player } from "../data/player";
import type { Trader, TraderInventoryItem } from "../data/traders/tradersTypes";
import { items } from "../data/items";

type AddItemToContainerOptions<Metadata extends object> = {
  idPrefix: string;
  metadata: Metadata;
  containerItemId?: string;
  occupiedIds?: string[];
};

export function addItemToContainer<Metadata extends object>(
  inventory: Array<ContainerItem & Metadata>,
  itemId: string,
  width: number,
  height: number,
  {
    idPrefix,
    metadata,
    containerItemId,
    occupiedIds = [],
  }: AddItemToContainerOptions<Metadata>,
): Array<ContainerItem & Metadata> {
  if (!items.some((item) => item.id === itemId)) {
    throw new Error(`Cannot add unknown item "${itemId}" to a container.`);
  }

  const existingIds = new Set([
    ...inventory.map((item) => item.containerItemId),
    ...occupiedIds,
  ]);
  let newContainerItemId = containerItemId;

  if (newContainerItemId) {
    if (existingIds.has(newContainerItemId)) {
      throw new Error(`Duplicate container item id "${newContainerItemId}".`);
    }
  } else {
    let suffix = 1;
    newContainerItemId = `${idPrefix}-${suffix}`;

    while (existingIds.has(newContainerItemId)) {
      suffix += 1;
      newContainerItemId = `${idPrefix}-${suffix}`;
    }
  }

  const position = findFirstAvailableItemPosition(
    itemId,
    inventory,
    width,
    height,
  );

  if (!position) {
    throw new Error(`No space available for item "${itemId}".`);
  }

  return [
    ...inventory,
    {
      ...metadata,
      containerItemId: newContainerItemId,
      itemId,
      ...position,
    },
  ];
}

export function findFirstAvailableItemPosition(
  itemId: string,
  inventory: ContainerItem[],
  width: number,
  height: number,
): { x: number; y: number } | null {
  const definition = items.find((item) => item.id === itemId);

  if (!definition || definition.shape.length === 0) {
    return null;
  }

  const occupiedCells = new Set<string>();

  for (const containerItem of inventory) {
    const otherDefinition = items.find(
      (item) => item.id === containerItem.itemId,
    );

    for (const cell of otherDefinition?.shape ?? []) {
      occupiedCells.add(`${containerItem.x + cell.x},${containerItem.y + cell.y}`);
    }
  }

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const fits = definition.shape.every((cell) => {
        const cellX = x + cell.x;
        const cellY = y + cell.y;

        return (
          cellX >= 0 &&
          cellX < width &&
          cellY >= 0 &&
          cellY < height &&
          !occupiedCells.has(`${cellX},${cellY}`)
        );
      });

      if (fits) {
        return { x, y };
      }
    }
  }

  return null;
}

function getPlayerContainerItemIds(player: Player): string[] {
  return [
    ...player.Inventory.map((item) => item.containerItemId),
    ...Object.values(player.Chests).flatMap((items) =>
      items.map((item) => item.containerItemId),
    ),
    ...Object.values(player.Equipment).flatMap((item) =>
      item ? [item.containerItemId] : [],
    ),
  ];
}

export function addItemToInventory(
  player: Player,
  itemId: string,
  containerItemId?: string,
): Player {
  if (!items.some((item) => item.id === itemId)) {
    throw new Error(`Cannot add unknown item "${itemId}" to the player.`);
  }

  const occupiedIds = getPlayerContainerItemIds(player);
  if (containerItemId && occupiedIds.includes(containerItemId)) {
    throw new Error(`Duplicate container item id "${containerItemId}".`);
  }

  const backpackPosition = findFirstAvailableItemPosition(
    itemId,
    player.Inventory,
    player.BackpackWidth,
    player.BackpackHeight,
  );

  if (backpackPosition) {
    return {
      ...player,
      Inventory: addItemToContainer(
        player.Inventory,
        itemId,
        player.BackpackWidth,
        player.BackpackHeight,
        {
          idPrefix: itemId,
          metadata: {},
          containerItemId,
          occupiedIds: [
            ...Object.values(player.Chests).flatMap((items) =>
              items.map((item) => item.containerItemId),
            ),
            ...Object.values(player.Equipment).flatMap((item) =>
              item ? [item.containerItemId] : [],
            ),
          ],
        },
      ),
    };
  }

  const storageDefinition = getChestDefinition("playerStorage");
  const storagePosition = findFirstAvailableItemPosition(
    itemId,
    player.Chests.playerStorage,
    storageDefinition.width,
    storageDefinition.height,
  );

  if (storagePosition) {
    return addItemToChest(player, "playerStorage", itemId, containerItemId);
  }

  throw new Error(`No space available for item "${itemId}".`);
}

export function addItemToChest(
  player: Player,
  chestId: string,
  itemId: string,
  containerItemId?: string,
): Player {
  const definition = getChestDefinition(chestId);
  const chestInventory = player.Chests[chestId];

  if (!chestInventory) {
    throw new Error(`Missing player inventory for chest "${chestId}".`);
  }

  return {
    ...player,
    Chests: {
      ...player.Chests,
      [chestId]: addItemToContainer(
        chestInventory,
        itemId,
        definition.width,
        definition.height,
        {
          idPrefix: `${chestId}-${itemId}`,
          metadata: {},
          containerItemId,
          occupiedIds: [
            ...player.Inventory.map((item) => item.containerItemId),
            ...Object.values(player.Chests).flatMap((items) =>
              items.map((item) => item.containerItemId),
            ),
            ...Object.values(player.Equipment).flatMap((item) =>
              item ? [item.containerItemId] : [],
            ),
          ],
        },
      ),
    },
  };
}

export function addItemToTraderInventory(
  trader: Trader,
  itemId: string,
): Trader {
  const definition = items.find((item) => item.id === itemId);

  if (!definition) {
    throw new Error(
      `Cannot add unknown item "${itemId}" to trader "${trader.id}".`,
    );
  }
  if (!Number.isFinite(trader.markup) || trader.markup < 0) {
    throw new Error(`Invalid markup for trader "${trader.id}".`);
  }

  const inventory: TraderInventoryItem[] = addItemToContainer(
    trader.inventory,
    itemId,
    trader.inventoryWidth,
    trader.inventoryHeight,
    {
      idPrefix: `${trader.id}-${itemId}`,
      metadata: { buyPrice: Math.round(definition.baseValue * trader.markup) },
    },
  );

  return { ...trader, inventory };
}
