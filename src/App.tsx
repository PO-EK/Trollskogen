import { useState } from "react";
import "./App.css";

import TopBar from "./components/TopBar";
import CharacterPanel from "./components/CharacterPanel";
import InventoryPanel from "./components/inventory/InventoryPanel";

import WorldMap from "./pages/WorldMap";
import Location from "./pages/Location";

type GameScreen = "worldMap" | "location";

function App() {
  const [screen, setScreen] = useState<GameScreen>("worldMap");

  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(
    null,
  );
  return (
    <div className="game">
      <TopBar />

      <main className="game-layout">
        <CharacterPanel />

        <section className="main-panel">
          {screen === "worldMap" && (
            <WorldMap
              onLocationSelect={(locationId) => {
                setSelectedLocationId(locationId);
                setScreen("location");
              }}
            />
          )}

          {screen === "location" && (
            <Location
              locationId={selectedLocationId}
              onReturn={() => setScreen("worldMap")}
            />
          )}
        </section>

        <InventoryPanel />
      </main>
    </div>
  );
}

export default App;
