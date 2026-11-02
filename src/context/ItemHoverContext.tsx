import { createContext } from "react";

export type ItemHoverContextType = {
  hoveredItemId: string | null;
  salePrice: number | null;
  setHoveredItem: (itemId: string | null, salePrice?: number) => void;
};

export const ItemHoverContext = createContext<ItemHoverContextType | null>(null);
