import { createContext } from "react";
import type { Player } from "../data/player";

export type PlayerContextType = {
  player: Player;
  setPlayer: React.Dispatch<React.SetStateAction<Player>>;
};

export const PlayerContext = createContext<PlayerContextType | null>(null);
