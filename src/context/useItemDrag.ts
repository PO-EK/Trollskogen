import { useContext } from "react";
import { ItemDragContext } from "./ItemDragContext";

export function useItemDrag() {
  const context = useContext(ItemDragContext);

  if (!context) {
    throw new Error("useItemDrag must be used inside ItemDragProvider");
  }

  return context;
}
