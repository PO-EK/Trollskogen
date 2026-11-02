import { useContext } from "react";
import { ItemHoverContext } from "./ItemHoverContext";

export function useItemHover() {
  const context = useContext(ItemHoverContext);

  if (!context) {
    throw new Error("useItemHover must be used inside ItemHoverProvider");
  }

  return context;
}
