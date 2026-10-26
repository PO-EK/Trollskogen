import { usePlayer } from "../context/usePlayer";
import type { OverlayId } from "../pages/overlays";
import "./CharacterPanel.css";
import { getMaxHP } from "../game/characterStats";

type CharacterPanelProps = {
  onOpenOverlay: (overlay: OverlayId) => void;
  locked?: boolean; // true during combat
};

function CharacterPanel({
  onOpenOverlay,
  locked = false,
}: CharacterPanelProps) {
  const { player } = usePlayer();
  const maxHP = getMaxHP(player);
  const expMax = player.ExpMax;

  const manaPercent =
    player.ManaMax > 0
      ? Math.max(0, Math.min(100, (player.Mana / player.ManaMax) * 100))
      : 0;

  const hpPercent =
    maxHP > 0 ? Math.max(0, Math.min(100, (player.HP / maxHP) * 100)) : 0;

  const expPercent =
    expMax > 0
      ? Math.max(0, Math.min(100, (player.Exp / player.ExpMax) * 100))
      : 0;

  return (
    <aside className="character-panel">
      <div className="character-header">
        <h2>{player.Name}</h2>
        <span>Nivå {player.Level}</span>
      </div>

      <div className="resource-section">
        <div className="resource-label">
          <span>Erfarenhet: </span>
          <span>
            {player.Exp} / {player.ExpMax}
          </span>
        </div>
        <div className="resource-bar">
          <div className="exp-bar" style={{ width: `${expPercent}%` }} />
        </div>
        <div className="levelUp">
          {player.SkillPoints > 0 && <span>Nivåhöjning!</span>}
        </div>
      </div>

      <button
        className="character-panel-button"
        disabled={locked}
        title={locked ? "Inte under strid" : undefined}
        onClick={() => onOpenOverlay("skillTree")}
      >
        Färdighetsträd{player.SkillPoints > 0 ? ` (${player.SkillPoints})` : ""}
      </button>

      <button
        className="character-panel-button"
        disabled={locked}
        title={locked ? "Inte under strid" : undefined}
        onClick={() => onOpenOverlay("skills")}
      >
        Förmågor
      </button>

      <button
        className="character-panel-button"
        disabled={locked}
        title={locked ? "Inte under strid" : undefined}
        onClick={() => onOpenOverlay("character")}
      >
        Utrustning
      </button>

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
    </aside>
  );
}

export default CharacterPanel;
