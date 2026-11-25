import { useEffect, useRef, useState } from "react";
import "./App.css";
import DragPreview from "./components/inventory/DragPreview";
import TopBar from "./components/TopBar";
import CharacterPanel from "./components/CharacterPanel";
import InventoryPanel from "./components/inventory/InventoryPanel";
import WorldMap from "./pages/WorldMap";
import Location from "./pages/Location";
import Trading from "./pages/Trading";
import Combat from "./pages/Combat";
import { locations } from "./data/locations";
import { OVERLAYS } from "./pages/overlays";
import type { OverlayId } from "./pages/overlays";
import type { CombatEncounter, CombatResult } from "./game/combatTypes";
import { usePlayer } from "./context/usePlayer";
import {
  createNewPlayer,
  deserializePlayerSave,
} from "./data/player";

type GameScreen = "worldMap" | "location" | "trading" | "combat";

// The fight in progress. onFinish is created by Location and applies the
// result to Location's own state.
type ActiveCombat = {
  encounter: CombatEncounter;
  onFinish: (result: CombatResult) => void;
};

function getLocationMapId(locationId: string): string {
  const location = locations.find((entry) => entry.id === locationId);
  if (!location) {
    throw new Error(`Unknown location "${locationId}".`);
  }
  return location.mapId;
}

function App() {
  const { setPlayer } = usePlayer();
  const [hasStarted, setHasStarted] = useState(false);
  const [menuError, setMenuError] = useState<string | null>(null);
  const [screen, setScreen] = useState<GameScreen>("worldMap");
  const [activeMapId, setActiveMapId] = useState("village");
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(
    null,
  );
  const [loadInputKey, setLoadInputKey] = useState(0);
  const loadInputRef = useRef<HTMLInputElement>(null);

  // Disable the browser context menu throughout the app.
  useEffect(() => {
    function preventContextMenu(event: MouseEvent) {
      event.preventDefault();
    }

    document.addEventListener("contextmenu", preventContextMenu);
    return () =>
      document.removeEventListener("contextmenu", preventContextMenu);
  }, []);

  // Disable browser-native text selection and dragging of text or images.
  useEffect(() => {
    function preventNativeInteraction(event: Event) {
      event.preventDefault();
    }

    document.addEventListener("selectstart", preventNativeInteraction);
    document.addEventListener("dragstart", preventNativeInteraction);

    return () => {
      document.removeEventListener("selectstart", preventNativeInteraction);
      document.removeEventListener("dragstart", preventNativeInteraction);
    };
  }, []);

  const [selectedTraderId, setSelectedTraderId] = useState<string | null>(null);
  const [combat, setCombat] = useState<ActiveCombat | null>(null);

  function startNewGame() {
    setPlayer(createNewPlayer());
    setSelectedLocationId("intro");
    setActiveMapId(getLocationMapId("intro"));
    setScreen("location");
    setMenuError(null);
    setHasStarted(true);
  }

  async function loadSavedGame(file: File) {
    try {
      const loadedPlayer = deserializePlayerSave(await file.text());
      setPlayer(loadedPlayer);
      setScreen("worldMap");
      setMenuError(null);
      setHasStarted(true);
    } catch (error) {
      setMenuError(
        error instanceof Error
          ? error.message
          : "Save-filen kunde inte laddas.",
      );
    } finally {
      setLoadInputKey((key) => key + 1);
    }
  }

  function enterLocation(locationId: string) {
    const mapId = getLocationMapId(locationId);
    setSelectedLocationId(locationId);
    setActiveMapId(mapId);
    setScreen("location");

    if (locationId !== "playerHQ") {
      setPlayer((player) => ({
        ...player,
        ActionPoints: Math.max(0, player.ActionPoints - 1),
      }));
    }
  }

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

  if (!hasStarted) {
    return (
      <main className="main-menu">
        <h1>Trollskogen</h1>
        <div className="main-menu-actions">
          <button type="button" onClick={startNewGame}>
            New Game
          </button>
          <button
            type="button"
            onClick={() => loadInputRef.current?.click()}
          >
            Load Game
          </button>
          <input
            key={loadInputKey}
            ref={loadInputRef}
            className="main-menu-load-input"
            type="file"
            accept=".json,application/json"
            aria-label="Choose a save file"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) {
                setMenuError(null);
                void loadSavedGame(file);
              }
            }}
          />
        </div>
        {menuError && (
          <p className="main-menu-error" role="alert">
            {menuError}
          </p>
        )}
      </main>
    );
  }

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
                  mapId={activeMapId}
                  onLocationSelect={enterLocation}
                  onMapSelect={setActiveMapId}
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
                    onTravelTo={enterLocation}
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
