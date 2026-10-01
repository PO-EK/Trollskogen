import { useState } from "react";
import "./App.css";
import DragPreview from "./components/inventory/DragPreview";
import TopBar from "./components/TopBar";
import CharacterPanel from "./components/CharacterPanel";
import InventoryPanel from "./components/inventory/InventoryPanel";
import WorldMap from "./pages/WorldMap";
import Location from "./pages/Location";
import Trading from "./pages/Trading";

type GameScreen = "worldMap" | "location" | "trading";

function App() {
  const [screen, setScreen] = useState<GameScreen>("worldMap");

  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(
    null,
  );

  const [selectedTraderId, setSelectedTraderId] = useState<string | null>(null);

  return (
    <>
      <DragPreview />

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
                onOpenTrader={(traderId) => {
                  setSelectedTraderId(traderId);
                  setScreen("trading");
                }}
                onTravelTo={(locationId) => {
                  setSelectedLocationId(locationId);
                  setScreen("location");
                }}
              />
            )}

            {screen === "trading" && (
              <Trading
                traderId={selectedTraderId}
                onReturn={() => setScreen("location")}
              />
            )}
          </section>

          <InventoryPanel />
        </main>
      </div>
    </>
  );
}

export default App;
