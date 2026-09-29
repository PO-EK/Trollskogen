import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { PlayerProvider } from "./context/PlayerProvider";
import { ItemDragProvider } from "./context/ItemDragProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PlayerProvider>
      <ItemDragProvider>
        <App />
      </ItemDragProvider>
    </PlayerProvider>
  </StrictMode>,
);
