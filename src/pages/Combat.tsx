import { useEffect, useRef, useState } from "react";
import { usePlayer } from "../context/usePlayer";
import { getEnemy } from "../data/enemy";
import type { ItemUse } from "../data/itemTypes";
import type { Skill } from "../data/skillTypes";
import {
  createCombat,
  enemyAct,
  getCombatResult,
  getItemBlockReason,
  getSkillAvailability,
  playerFlee,
  playerUseItem,
  playerUseSkill,
} from "../game/combatEngine";
import type { CombatContext, CombatState, Status } from "../game/combatEngine";
import type { CombatEncounter, CombatResult } from "../game/combatTypes";
import { ATTRIBUTE_LABELS, getSkillSummary } from "../game/labels";
import { getBattleSkills, getSkillGroup } from "../game/skillLoadout";
import "./Combat.css";
import ItemUseSlot from "../components/inventory/ItemUseSlot";

const ENEMY_TURN_DELAY = 1500; // ms, so the log is readable

// Placeholder icons. Swap `icon` for an <img> when you have the images.
const STATUS_VISUALS: Record<Status["kind"], { icon: string; label: string }> =
  {
    burn: { icon: "🔥", label: "Brand" },
    bleed: { icon: "🩸", label: "Blödning" },
    stun: { icon: "💫", label: "Bedövad" },
    guard: { icon: "🛡️", label: "Skydd" },
    evade: { icon: "💨", label: "Undvikande" },
    damageMod: { icon: "⚔️", label: "Skada" },
    stat: { icon: "✨", label: "Egenskap" },
    weak: { icon: "📉", label: "Försvagad" },
    offguard: { icon: "👁️", label: "Ur Ballans" },
  };

function describeStatus(status: Status): string {
  switch (status.kind) {
    case "burn":
    case "bleed": {
      const total = status.damage * status.stacks;

      return status.stacks > 1
        ? `${total} skada per runda (${status.stacks} lager)`
        : `${total} skada per runda`;
    }
    case "stun":
      return "förlorar sin tur";
    case "guard":
      return `tar ${status.percent}% mindre skada`;
    case "evade":
      return `${status.chance}% att undvika attacker`;
    case "damageMod":
      return `${status.percent > 0 ? "+" : ""}${status.percent}% skada`;
    case "stat":
      return `${status.amount > 0 ? "+" : ""}${status.amount} ${ATTRIBUTE_LABELS[status.stat]}`;
    case "weak":
      return `${status.percent}% mindre skada`;
    case "offguard":
      return `${status.percent}% mer skada`;
  }
}

function isHarmful(status: Status): boolean {
  switch (status.kind) {
    case "burn":
    case "bleed":
    case "stun":
      return true;
    case "damageMod":
      return status.percent < 0;
    case "weak":
    case "offguard":
      return true;
    case "stat":
      return status.amount < 0;
    default:
      return false;
  }
}

function getTurnLabel(phase: CombatState["phase"], enemyName: string): string {
  switch (phase) {
    case "playerTurn":
      return "Din tur";
    case "enemyTurn":
      return `${enemyName} agerar...`;
    case "won":
      return "Seger!";
    case "lost":
      return "Du har fallit...";
    case "fled":
      return "Du flydde.";
  }
}

function StatusRow({ statuses }: { statuses: Status[] }) {
  return (
    <div className="combat-statuses">
      {statuses.map((status, index) => {
        const visual = STATUS_VISUALS[status.kind];

        return (
          <div
            key={`${status.kind}-${index}`}
            className="combat-status"
            data-tone={isHarmful(status) ? "bad" : "good"}
            title={`${visual.label}: ${describeStatus(status)}`}
          >
            <span>{visual.icon}</span>
            <span className="combat-status-turns">
              {status.turnsLeft ?? ""}
            </span>
            {"stacks" in status && status.stacks > 1 && (
              <span className="combat-status-stacks">×{status.stacks}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

type SkillButtonProps = {
  skill: Skill;
  state: CombatState;
  onUse: (skillId: string) => void;
};

function SkillButton({ skill, state, onUse }: SkillButtonProps) {
  const availability = getSkillAvailability(state, skill);

  return (
    <button
      className="combat-skill"
      data-group={getSkillGroup(skill)}
      // Only dimmed for cooldown or mana, not while waiting for your turn.
      data-unavailable={
        availability.cooldownLeft > 0 || !availability.enoughMana
          ? "true"
          : undefined
      }
      data-low-mana={availability.enoughMana ? undefined : "true"}
      disabled={!availability.usable}
      title={skill.description}
      onClick={() => onUse(skill.id)}
    >
      <span className="combat-skill-name">{skill.name}</span>
      <span className="combat-skill-meta">{getSkillSummary(skill)}</span>
      <span className="combat-skill-meta">{skill.description}</span>
      {availability.cooldownLeft > 0 && (
        <span className="combat-skill-cooldown">
          ⏳{availability.cooldownLeft}
        </span>
      )}
    </button>
  );
}

type CombatProps = {
  encounter: CombatEncounter;
  onFinish: (result: CombatResult) => void;
};

function Combat({ encounter, onFinish }: CombatProps) {
  const { player, setPlayer } = usePlayer();

  // Fixed for the whole fight: gear and skills are locked during combat.
  const [ctx] = useState<CombatContext>(() => ({
    player,
    enemy: getEnemy(encounter.enemyId),
    encounter,
  }));
  const [state, setState] = useState<CombatState>(() => createCombat(ctx));

  const logRef = useRef<HTMLDivElement>(null);
  const finishedRef = useRef(false);

  const { enemy } = ctx;
  const { granted, chosen } = getBattleSkills(ctx.player);
  const over =
    state.phase === "won" || state.phase === "lost" || state.phase === "fled";

  // The enemy acts a moment after your turn ends.
  useEffect(() => {
    if (state.phase !== "enemyTurn") {
      return;
    }

    const timer = window.setTimeout(
      () => setState((current) => enemyAct(current, ctx)),
      ENEMY_TURN_DELAY,
    );

    return () => window.clearTimeout(timer);
  }, [state.phase, state.log.length, ctx]);

  // Keep the newest log line in view.
  useEffect(() => {
    const element = logRef.current;

    if (element) {
      element.scrollTop = element.scrollHeight;
    }
  }, [state.log.length]);

  // Show your HP and mana in the left panel while the fight goes on.
  useEffect(() => {
    const hp = state.player.hp;
    const mana = state.player.mana;

    setPlayer((p) =>
      p.HP === hp && p.Mana === mana ? p : { ...p, HP: hp, Mana: mana },
    );
  }, [state.player.hp, state.player.mana, setPlayer]);

  function handleUseSkill(skillId: string) {
    setState((current) => playerUseSkill(current, ctx, skillId));
  }

  function handleUseItem(use: ItemUse) {
    setState((current) => playerUseItem(current, ctx, use));
  }

  function handleFlee() {
    setState((current) => playerFlee(current, ctx));
  }

  function handleContinue() {
    if (finishedRef.current) {
      return;
    }

    const result = getCombatResult(state, ctx);

    if (!result) {
      return;
    }

    finishedRef.current = true;
    onFinish(result);
  }

  const enemyPercent = (state.enemy.hp / state.enemy.maxHp) * 100;

  return (
    <div className="combat">
      {/* Enemy: name, hp, statuses */}
      <section className="combat-enemy">
        <div className="combat-enemy-title">
          <h2>{enemy.name}</h2>
          <span className="combat-turn">
            {getTurnLabel(state.phase, enemy.name)}
          </span>
          <span className="combat-round">Runda {state.round}</span>
        </div>
      </section>
      <StatusRow statuses={state.enemy.statuses} />
      {/* Middle: enemy image and the log */}
      <div className="combat-middle">
        <img
          className="combat-enemy-image"
          src={enemy.image}
          alt={enemy.name}
        />

        <div className="combat-log" ref={logRef}>
          {state.log.map((entry, index) => (
            <p key={index} className="combat-log-line" data-tone={entry.tone}>
              {entry.text}
            </p>
          ))}
        </div>
        <div className="resource-label">
          <span>❤️ Hälsa </span>
          <span>
            {state.enemy.hp} / {state.enemy.maxHp}
          </span>
        </div>
        <div className="resource-bar">
          <div className="health-bar" style={{ width: `${enemyPercent}%` }} />
        </div>
      </div>

      {/* You: skills, statuses, item slot, actions */}
      <section className="combat-player">
        <div className="combat-player-bg">
          <div className="combat-skill-row">
            {granted.map((skill) => (
              <SkillButton
                key={skill.id}
                skill={skill}
                state={state}
                onUse={handleUseSkill}
              />
            ))}
          </div>

          <div className="combat-skill-row combat-skill-row--slots">
            {chosen.map((skill, index) =>
              skill ? (
                <SkillButton
                  key={skill.id}
                  skill={skill}
                  state={state}
                  onUse={handleUseSkill}
                />
              ) : (
                <div key={`empty-${index}`} className="combat-skill-empty">
                  Tom plats
                </div>
              ),
            )}
          </div>
          <div className="combat-player-bars">
            <StatusRow statuses={state.player.statuses} />
            {over ? (
              <button className="combat-button" onClick={handleContinue}>
                Fortsätt
              </button>
            ) : (
              <>
                <ItemUseSlot
                  getBlockReason={(use) => getItemBlockReason(state, use)}
                  // true = the slot deletes the item from the backpack for us
                  onUse={(_item, use) => {
                    handleUseItem(use);
                    return true;
                  }}
                />
                <button
                  className="combat-button"
                  disabled={enemy.isBoss || state.phase !== "playerTurn"}
                  title={
                    enemy.isBoss ? "Du kan inte fly från en boss" : undefined
                  }
                  onClick={handleFlee}
                >
                  Fly
                </button>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Combat;
