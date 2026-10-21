import { useEffect, useRef, useState } from "react";
import { usePlayer } from "../context/usePlayer";
import { getEnemy } from "../data/enemy";
import type { Skill } from "../data/skillTypes";
import {
  createCombat,
  enemyAct,
  getCombatResult,
  getSkillAvailability,
  playerFlee,
  playerUseSkill,
} from "../game/combatEngine";
import type { CombatContext, CombatState, Status } from "../game/combatEngine";
import type { CombatEncounter, CombatResult } from "../game/combatTypes";
import { ATTRIBUTE_LABELS, getSkillSummary } from "../game/labels";
import { getBattleSkills, getSkillGroup } from "../game/skillLoadout";
import "./Combat.css";

const ENEMY_TURN_DELAY = 700; // ms, so the log is readable

// Placeholder icons. Swap `icon` for an <img> when you have the images.
const STATUS_VISUALS: Record<Status["kind"], { icon: string; label: string }> =
  {
    burn: { icon: "🔥", label: "Brand" },
    stun: { icon: "💫", label: "Bedövad" },
    guard: { icon: "🛡️", label: "Skydd" },
    evade: { icon: "💨", label: "Undvikande" },
    damageMod: { icon: "⚔️", label: "Skada" },
    stat: { icon: "✨", label: "Egenskap" },
  };

function describeStatus(status: Status): string {
  switch (status.kind) {
    case "burn":
      return `${status.damage} skada per runda`;
    case "stun":
      return "förlorar sin tur";
    case "guard":
      return `tar ×${status.multiplier} skada`;
    case "evade":
      return `${Math.round(status.chance * 100)}% att undvika attacker`;
    case "damageMod":
      return `${status.percent > 0 ? "+" : ""}${status.percent}% skada`;
    case "stat":
      return `${status.amount > 0 ? "+" : ""}${status.amount} ${ATTRIBUTE_LABELS[status.stat]}`;
  }
}

function isHarmful(status: Status): boolean {
  switch (status.kind) {
    case "burn":
    case "stun":
      return true;
    case "damageMod":
      return status.percent < 0;
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
            <span className="combat-status-turns">{status.turnsLeft}</span>
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
  const hpPercent = (state.player.hp / state.player.maxHp) * 100;
  const manaPercent =
    (state.player.mana / Math.max(1, ctx.player.ManaMax)) * 100;

  return (
    <div className="combat">
      {/* Enemy: name, hp, statuses */}
      <section className="combat-enemy">
        <div className="combat-enemy-title">
          <h2>{enemy.name}</h2>
          <span className="combat-round">Runda {state.round}</span>
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

        <StatusRow statuses={state.enemy.statuses} />
      </section>

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
      </div>

      {/* You: bars, statuses, skills, actions */}
      <section className="combat-player">
        <div className="combat-player-bars">
          <div>
            <div className="resource-label">
              <span>❤️ Hälsa </span>
              <span>
                {state.player.hp} / {state.player.maxHp}
              </span>
            </div>
            <div className="resource-bar">
              <div className="health-bar" style={{ width: `${hpPercent}%` }} />
            </div>
          </div>

          <div>
            <div className="resource-label">
              <span>💧 Magi </span>
              <span>
                {state.player.mana} / {ctx.player.ManaMax}
              </span>
            </div>
            <div className="resource-bar">
              <div className="mana-bar" style={{ width: `${manaPercent}%` }} />
            </div>
          </div>
        </div>

        <StatusRow statuses={state.player.statuses} />

        <p className="combat-row-label">Från utrustning</p>
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

        <p className="combat-row-label">Dina färdigheter</p>
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

        <div className="combat-actions">
          <span className="combat-turn">
            {getTurnLabel(state.phase, enemy.name)}
          </span>

          {over ? (
            <button className="combat-button" onClick={handleContinue}>
              Fortsätt
            </button>
          ) : (
            // Room for an items button here later.
            <button
              className="combat-button"
              disabled={enemy.isBoss || state.phase !== "playerTurn"}
              title={enemy.isBoss ? "Du kan inte fly från en boss" : undefined}
              onClick={handleFlee}
            >
              Fly
            </button>
          )}
        </div>
      </section>
    </div>
  );
}

export default Combat;
