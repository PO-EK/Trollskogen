import { usePlayer } from "../context/usePlayer";
import { getEnemy, rollLoot } from "../data/enemy";
import type {
  CombatEncounter,
  CombatOutcome,
  CombatResult,
} from "../game/combatTypes";

type CombatProps = {
  encounter: CombatEncounter;
  onFinish: (result: CombatResult) => void;
};

// TEMPORARY stub: no fighting, just three buttons that end the fight.
function Combat({ encounter, onFinish }: CombatProps) {
  const { player } = usePlayer();
  const enemy = getEnemy(encounter.enemyId);

  function finish(outcome: CombatOutcome) {
    const won = outcome === "win";

    onFinish({
      outcome,
      hp: outcome === "lose" ? 0 : player.HP,
      mana: player.Mana,
      exp: won ? enemy.exp : 0,
      gold: won ? enemy.gold : 0,
      loot: won ? rollLoot(enemy, encounter.extraLoot) : [],
    });
  }

  return (
    <div style={{ padding: 16, textAlign: "center", color: "#e8e0d0" }}>
      <h2>{enemy.name}</h2>
      <img src={enemy.image} alt={enemy.name} style={{ maxHeight: 160 }} />
      <p>HP {enemy.hp}</p>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <div className="location-choices">
          <button className="location-choice" onClick={() => finish("win")}>
            Vinn (test)
          </button>
          <button className="location-choice" onClick={() => finish("lose")}>
            Förlora (test)
          </button>
          <button
            className="location-choice"
            disabled={enemy.isBoss}
            onClick={() => finish("flee")}
          >
            Fly
          </button>
        </div>
      </div>
    </div>
  );
}

export default Combat;
