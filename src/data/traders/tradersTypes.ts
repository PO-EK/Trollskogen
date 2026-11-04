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
  markup: number;
  inventory: TraderInventoryItem[];
};

export type TraderDefinition = Omit<Trader, "inventory"> & {
  stock: string[];
};
