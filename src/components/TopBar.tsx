import { useRef } from "react";
import {
  DAILY_ACTION_POINTS,
  deserializePlayerSave,
  serializePlayerSave,
} from "../data/player";
import { usePlayer } from "../context/usePlayer";

function TopBar() {
  const { player, setPlayer } = usePlayer();
  const loadInputRef = useRef<HTMLInputElement>(null);
  const actionPoints = Math.min(
    Math.max(player.ActionPoints, 0),
    DAILY_ACTION_POINTS,
  );

  function saveGame() {
    const blob = new Blob([serializePlayerSave(player)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const date = new Date().toISOString().slice(0, 10);
    link.href = url;
    link.download = `trollskogen-save-${date}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  async function loadGame(file: File) {
    try {
      const loadedPlayer = deserializePlayerSave(await file.text());
      setPlayer(loadedPlayer);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Save-filen kunde inte laddas.";
      window.alert(message);
    } finally {
      if (loadInputRef.current) {
        loadInputRef.current.value = "";
      }
    }
  }

  return (
    <header className="top-bar">
      <h2>Trollskogen</h2>

      <div className="top-bar-stats">
        <span>Dag: {player.day}</span>
        <div className="action-points">
          <span>Tid kvar:</span>
          <div
            className="action-points-bar"
            role="progressbar"
            aria-label="Action points"
            aria-valuemin={0}
            aria-valuemax={DAILY_ACTION_POINTS}
            aria-valuenow={actionPoints}
          >
            {Array.from({ length: DAILY_ACTION_POINTS }, (_, index) => (
              <span
                className={`action-point-block${index < actionPoints ? " filled" : ""}`}
                key={index}
                aria-hidden="true"
              />
            ))}
          </div>
        </div>
      </div>
      <div className="top-bar-save-actions">
        <button type="button" onClick={saveGame}>
          Save
        </button>
        <button type="button" onClick={() => loadInputRef.current?.click()}>
          Load
        </button>
        <input
          ref={loadInputRef}
          className="top-bar-load-input"
          type="file"
          accept=".json,application/json"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) {
              void loadGame(file);
            }
          }}
        />
      </div>
      <p className="top-bar-version">
        Version 1.0 - 2026-11-25. Skuggan över Trollskogen är klart.
      </p>
    </header>
  );
}

export default TopBar;
