import { useState } from "react";
import { createNewPlayer } from "../data/player";
import { PlayerContext } from "./PlayerContext";

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [player, setPlayer] = useState(createNewPlayer());

  return (
    <PlayerContext.Provider value={{ player, setPlayer }}>
      {children}
    </PlayerContext.Provider>
  );
}
