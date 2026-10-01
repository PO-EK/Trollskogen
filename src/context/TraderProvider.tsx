import { useState } from "react";
import { traders } from "../data/traders/traders";
import { TraderContext } from "./TraderContext";

export function TraderProvider({ children }: { children: React.ReactNode }) {
  const [currentTraders, setCurrentTraders] = useState(traders);

  return (
    <TraderContext.Provider
      value={{
        traders: currentTraders,
        setTraders: setCurrentTraders,
      }}
    >
      {children}
    </TraderContext.Provider>
  );
}
