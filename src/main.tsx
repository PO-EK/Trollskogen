import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { PlayerProvider } from "./context/PlayerProvider";
import { ItemDragProvider } from "./context/ItemDragProvider";
import { TraderProvider } from "./context/TraderProvider";
import { ItemHoverProvider } from "./context/ItemHoverProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PlayerProvider>
      <TraderProvider>
        <ItemHoverProvider>
          <ItemDragProvider>
            <App />
          </ItemDragProvider>
        </ItemHoverProvider>
      </TraderProvider>
    </PlayerProvider>
  </StrictMode>,
);
