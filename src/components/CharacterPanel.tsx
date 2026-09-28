import { usePlayer } from "../context/usePlayer";
import "./CharacterPanel.css";

function CharacterPanel() {
  const { player } = usePlayer();
  const hpPercent = (player.HP / player.HPMax) * 100;
  const manaPercent = (player.Mana / player.ManaMax) * 100;

  return (
    <aside className="character-panel">
      <div className="character-header">
        <h2>{player.Name}</h2>
        <span>Nivå {player.Level}</span>
      </div>

      <div className="resource-section">
        <div className="resource-label">
          <span>❤️ Hälsa</span>
          <span>
            {player.HP} / {player.HPMax}
          </span>
        </div>

        <div className="resource-bar">
          <div className="health-bar" style={{ width: `${hpPercent}%` }} />
        </div>
      </div>

      <div className="resource-section">
        <div className="resource-label">
          <span>💧 Magi</span>
          <span>
            {player.Mana} / {player.ManaMax}
          </span>
        </div>

        <div className="resource-bar">
          <div className="mana-bar" style={{ width: `${manaPercent}%` }} />
        </div>
      </div>

      <div className="stats">
        <h3>Egenskaper</h3>

        <div className="stat-row">
          <span>⚔️ Styrka</span>
          <span>{player.Str}</span>
        </div>

        <div className="stat-row">
          <span>🏹 Smidighet </span>
          <span>{player.Dex}</span>
        </div>

        <div className="stat-row">
          <span>🛡️ Fysik </span>
          <span>{player.Con}</span>
        </div>

        <div className="stat-row">
          <span>🔮 Intelligens </span>
          <span>{player.Int}</span>
        </div>
      </div>
    </aside>
  );
}

export default CharacterPanel;
