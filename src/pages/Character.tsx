import { usePlayer } from "../context/usePlayer";
import "./Character.css";
import { useState } from "react";
import type { EquipmentSlot } from "../data/itemTypes";
import charBG from "../assets/charBG.png";
import EquipSlot from "../components/EquipSlot";
import ItemCard from "../components/inventory/ItemCard";
import { getCharacterStats } from "../game/characterStats";

const VISIBLE_SLOTS: EquipmentSlot[] = [
  "head",
  "body",
  "feet",
  "mainHand",
  "offHand",
];

type CharacterProps = {
  onClose: () => void;
};

function Character({ onClose }: CharacterProps) {
  const { player } = usePlayer();
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);

  // Recalculated on every render, so it updates the moment you equip something.
  const stats = getCharacterStats(player);

  return (
    <div className="character-page">
      <div className="character-page-header">
        <h1>{player.Name}</h1>
        <span>Nivå {player.Level}</span>
        <button className="character-page-close" onClick={onClose}>
          Tillbaka
        </button>
      </div>

      <div className="character-page-body">
        {/* Row 1: item card on the left, equipment on the right */}
        <div className="character-page-top">
          <section className="character-page-card">
            <h3>Föremål</h3>
            <ItemCard itemId={hoveredItemId} />
          </section>

          <section className="character-page-equipment">
            <h3>Utrustning</h3>

            <div
              className="equip-section"
              style={{ backgroundImage: `url(${charBG})` }}
            >
              {VISIBLE_SLOTS.map((slot) => (
                <EquipSlot
                  key={slot}
                  slot={slot}
                  onHoveredItemChange={setHoveredItemId}
                />
              ))}
            </div>
          </section>
        </div>

        {/* Row 2: attributes on the left, combat values on the right */}
        <div className="character-page-bottom">
          <section className="stats">
            <h3>Egenskaper</h3>

            <div className="stat-row">
              <span>⚔️ Styrka: </span>
              <span>{player.Str}</span>
            </div>

            <div className="stat-row">
              <span>🏹 Smidighet: </span>
              <span>{player.Dex}</span>
            </div>

            <div className="stat-row">
              <span>🛡️ Fysik: </span>
              <span>{player.Con}</span>
            </div>

            <div className="stat-row">
              <span>🔮 Intelligens: </span>
              <span>{player.Int}</span>
            </div>
          </section>

          <section className="stats">
            <h3>Stridsvärden: </h3>

            <div className="stat-row">
              <span>🗡️ Attack: </span>
              <span
                className={stats.weaponName ? "stat-value--boosted" : undefined}
              >
                {stats.attack}
              </span>
            </div>

            <div className="stat-row">
              <span>🛡️ Försvar: </span>
              <span
                className={
                  stats.defense > 0 ? "stat-value--boosted" : undefined
                }
              >
                {stats.defense}
              </span>
            </div>
            <div className="stat-row">
              <span>❤️ Max hälsa: </span>
              <span>{stats.maxHP}</span>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Character;
