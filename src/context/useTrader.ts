import { useContext } from "react";
import { TraderContext } from "./TraderContext";

export function useTrader() {
  const context = useContext(TraderContext);

  if (!context) {
    throw new Error("useTrader must be used inside TraderProvider");
  }

  return context;
}
