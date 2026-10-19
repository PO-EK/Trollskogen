import { usePlayer } from "../context/usePlayer";
import type { OverlayId } from "../pages/overlays";
import "./CharacterPanel.css";
import { getMaxHP } from "../game/characterStats";
type CharacterPanelProps = {
  onOpenOverlay: (overlay: OverlayId) => void;
};

function CharacterPanel({ onOpenOverlay }: CharacterPanelProps) {
  const { player } = usePlayer();
  const manaPercent = (player.Mana / player.ManaMax) * 100;
  const maxHP = getMaxHP(player);
  const hpPercent = (player.HP / maxHP) * 100;
  return (
    <aside className="character-panel">
      <div className="character-header">
        <h2>{player.Name}</h2>
        <span>Nivå {player.Level}</span>
      </div>

      <div className="resource-section">
        <div className="resource-label">
          <span>❤️ Hälsa: </span>
          <span>
            {player.HP} / {maxHP}
          </span>
        </div>

        <div className="resource-bar">
          <div className="health-bar" style={{ width: `${hpPercent}%` }} />
        </div>
      </div>

      <div className="resource-section">
        <div className="resource-label">
          <span>💧 Magi: </span>
          <span>
            {player.Mana} / {player.ManaMax}
          </span>
        </div>

        <div className="resource-bar">
          <div className="mana-bar" style={{ width: `${manaPercent}%` }} />
        </div>
      </div>

      <button
        className="character-panel-button"
        onClick={() => onOpenOverlay("character")}
      >
        Karaktär
      </button>
      <button
        className="character-panel-button"
        onClick={() => onOpenOverlay("skills")}
      >
        Färdigheter
      </button>
    </aside>
  );
}

export default CharacterPanel;
