import { createContext } from "react";
import type { Trader } from "../data/traders/tradersTypes";

export type TraderContextType = {
  traders: Trader[];
  setTraders: React.Dispatch<React.SetStateAction<Trader[]>>;
  resetTraders: () => void;
};

export const TraderContext = createContext<TraderContextType | null>(null);
