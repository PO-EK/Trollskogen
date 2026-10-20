import { useEffect, useState } from "react";
import "./App.css";
import DragPreview from "./components/inventory/DragPreview";
import TopBar from "./components/TopBar";
import CharacterPanel from "./components/CharacterPanel";
import InventoryPanel from "./components/inventory/InventoryPanel";
import WorldMap from "./pages/WorldMap";
import Location from "./pages/Location";
import Trading from "./pages/Trading";
import Combat from "./pages/Combat";
import { OVERLAYS } from "./pages/overlays";
import type { OverlayId } from "./pages/overlays";
import type { CombatEncounter, CombatResult } from "./game/combatTypes";

type GameScreen = "worldMap" | "location" | "trading" | "combat";

// The fight in progress. onFinish is created by Location and applies the
// result to Location's own state.
type ActiveCombat = {
  encounter: CombatEncounter;
  onFinish: (result: CombatResult) => void;
};

function App() {
  const [screen, setScreen] = useState<GameScreen>("worldMap");

  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(
    null,
  );

  const [selectedTraderId, setSelectedTraderId] = useState<string | null>(null);
  const [combat, setCombat] = useState<ActiveCombat | null>(null);
  // Which overlay page (character, skill tree...) is open, if any.
  const [overlay, setOverlay] = useState<OverlayId | null>(null);
  // No swapping gear or skills in the middle of a fight.
  const overlaysLocked = screen === "combat";
  // Escape closes whichever overlay is open.
  useEffect(() => {
    if (!overlay) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOverlay(null);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [overlay]);

  const ActiveOverlay = overlay ? OVERLAYS[overlay] : null;

  return (
    <>
      <DragPreview />

      <div className="game">
        <TopBar />

        <main className="game-layout">
          <CharacterPanel
            locked={overlaysLocked}
            onOpenOverlay={(id) => {
              if (!overlaysLocked) {
                setOverlay(id);
              }
            }}
          />

          <section className="main-panel">
            {/*
              While an overlay is open, the current screen is hidden, not
              removed. Hidden components keep their state, so Location is
              exactly as you left it. "contents" makes the wrapper invisible
              to your layout when shown.
            */}
            <div style={{ display: overlay ? "none" : "contents" }}>
              {screen === "worldMap" && (
                <WorldMap
                  onLocationSelect={(locationId) => {
                    setSelectedLocationId(locationId);
                    setScreen("location");
                  }}
                />
              )}

              {/* Location also stays mounted behind trading. */}
              {(screen === "location" ||
                screen === "trading" ||
                screen === "combat") && (
                <div
                  style={{
                    display: screen === "location" ? "contents" : "none",
                  }}
                >
                  <Location
                    key={selectedLocationId}
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
                    onStartCombat={(encounter, onFinish) => {
                      setOverlay(null);
                      setCombat({ encounter, onFinish });
                      setScreen("combat");
                    }}
                  />
                </div>
              )}

              {screen === "trading" && (
                <Trading
                  traderId={selectedTraderId}
                  onReturn={() => setScreen("location")}
                />
              )}
              {screen === "combat" && combat && (
                <Combat
                  encounter={combat.encounter}
                  onFinish={(result) => {
                    const { onFinish } = combat;
                    setCombat(null);
                    setScreen("location");
                    onFinish(result);
                  }}
                />
              )}
            </div>

            {ActiveOverlay && (
              <ActiveOverlay onClose={() => setOverlay(null)} />
            )}
          </section>

          <InventoryPanel />
        </main>
      </div>
    </>
  );
}

export default App;
