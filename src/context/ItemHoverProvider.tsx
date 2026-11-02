import { useState } from "react";
import { ItemHoverContext } from "./ItemHoverContext";

export function ItemHoverProvider({ children }: { children: React.ReactNode }) {
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);
  const [salePrice, setSalePrice] = useState<number | null>(null);

  function setHoveredItem(itemId: string | null, price?: number) {
    setHoveredItemId(itemId);
    setSalePrice(itemId && price !== undefined ? price : null);
  }

  return (
    <ItemHoverContext.Provider
      value={{ hoveredItemId, salePrice, setHoveredItem }}
    >
      {children}
    </ItemHoverContext.Provider>
  );
}
