import { DAILY_ACTION_POINTS } from "../data/player";
import { usePlayer } from "../context/usePlayer";

function TopBar() {
  const { player } = usePlayer();
  const actionPoints = Math.min(
    Math.max(player.ActionPoints, 0),
    DAILY_ACTION_POINTS,
  );

  return (
    <header className="top-bar">
      <h2>Trollskogen</h2>

      <div className="top-bar-stats">
        <span>Dag: {player.day}</span>
        <div className="action-points">
          <span>Actions</span>
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
      <p className="top-bar-version">
        Version 0.1.8 - 2026-11-10. Dag och Tid, nya quests och vapen. klart.
      </p>
    </header>
  );
}

export default TopBar;
