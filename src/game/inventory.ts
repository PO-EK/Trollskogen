import type { ContainerItem } from "../data/containerItems";
import type { Player } from "../data/player";
import { items } from "../data/items";

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

function createContainerItemId(player: Player, itemId: string): string {
  const occupiedIds = new Set([
    ...player.Inventory.map((item) => item.containerItemId),
    ...player.Storage.map((item) => item.containerItemId),
    ...Object.values(player.Equipment).flatMap((item) =>
      item ? [item.containerItemId] : [],
    ),
  ]);

  let suffix = 1;
  let containerItemId = `${itemId}-${suffix}`;

  while (occupiedIds.has(containerItemId)) {
    suffix += 1;
    containerItemId = `${itemId}-${suffix}`;
  }

  return containerItemId;
}

export function addItemToInventory(
  player: Player,
  itemId: string,
  containerItemId?: string,
): Player {
  if (!items.some((item) => item.id === itemId)) {
    throw new Error(`Cannot add unknown item "${itemId}" to the player.`);
  }

  const newContainerItemId =
    containerItemId ?? createContainerItemId(player, itemId);

  const existingIds = [
    ...player.Inventory,
    ...player.Storage,
    ...Object.values(player.Equipment).filter(
      (item): item is ContainerItem => item !== undefined,
    ),
  ].map((item) => item.containerItemId);

  if (existingIds.includes(newContainerItemId)) {
    throw new Error(`Duplicate container item id "${newContainerItemId}".`);
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
      Inventory: [
        ...player.Inventory,
        {
          containerItemId: newContainerItemId,
          itemId,
          ...backpackPosition,
        },
      ],
    };
  }

  const storagePosition = findFirstAvailableItemPosition(
    itemId,
    player.Storage,
    player.StorageWidth,
    player.StorageHeight,
  );

  if (storagePosition) {
    return {
      ...player,
      Storage: [
        ...player.Storage,
        {
          containerItemId: newContainerItemId,
          itemId,
          ...storagePosition,
        },
      ],
    };
  }

  throw new Error(`No space available for item "${itemId}".`);
}
