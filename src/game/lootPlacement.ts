import { items } from "../data/items";
import type { ContainerItem } from "../data/containerItems";

// Places dropped items in the first free spot of a width x height grid.
// Items that don't fit are skipped (with a warning in dev).
export function placeLoot(
  itemIds: string[],
  width: number,
  height: number,
): ContainerItem[] {
  const placed: ContainerItem[] = [];
  const occupied = new Set<string>();

  for (const itemId of itemIds) {
    const definition = items.find((item) => item.id === itemId);

    if (!definition) {
      continue;
    }

    let found = false;

    for (let y = 0; y < height && !found; y++) {
      for (let x = 0; x < width && !found; x++) {
        const cells = definition.shape.map((cell) => ({
          x: x + cell.x,
          y: y + cell.y,
        }));

        const fits = cells.every(
          (cell) =>
            cell.x < width &&
            cell.y < height &&
            !occupied.has(`${cell.x},${cell.y}`),
        );

        if (fits) {
          cells.forEach((cell) => occupied.add(`${cell.x},${cell.y}`));
          placed.push({ containerItemId: crypto.randomUUID(), itemId, x, y });
          found = true;
        }
      }
    }

    if (!found && import.meta.env.DEV) {
      console.warn(`No room in the loot container for ${itemId}`);
    }
  }

  return placed;
}
