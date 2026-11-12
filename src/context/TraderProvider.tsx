import { useState } from "react";
import { createTraders } from "../data/traders/traders";
import { TraderContext } from "./TraderContext";

export function TraderProvider({ children }: { children: React.ReactNode }) {
  const [currentTraders, setCurrentTraders] = useState(createTraders);

  function resetTraders() {
    setCurrentTraders(createTraders());
  }

  return (
    <TraderContext.Provider
      value={{
        traders: currentTraders,
        setTraders: setCurrentTraders,
        resetTraders,
      }}
    >
      {children}
    </TraderContext.Provider>
  );
}
