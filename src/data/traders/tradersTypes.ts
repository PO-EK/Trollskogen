import type { ContainerItem } from "../containerItems";

export type TraderInventoryItem = ContainerItem & {
  buyPrice: number;
};

export type Trader = {
  id: string;
  name: string;
  description: string;
  inventoryWidth: number;
  inventoryHeight: number;
  inventory: TraderInventoryItem[];
};
