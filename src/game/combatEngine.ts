import { rollLoot } from "../data/enemy";
import type { Enemy, EnemyId } from "../data/enemy";
import type { Player } from "../data/player";
import type { Skill, SkillEffect } from "../data/skillTypes";
import { getSkill } from "../data/skills";
import { rollSkillDamage } from "./battleSkills";
import {
  BASE_DODGE,
  BASELINE_STAT,
  DEFENSE_HALF_POINT,
  DODGE_HALF_POINT,
  MAX_DODGE,
} from "./balance";
import { getDefense, getEquippedWeapon, getMaxHP } from "./characterStats";
import type {
  CombatEncounter,
  CombatOutcome,
  CombatResult,
} from "./combatTypes";
import { getBattleSkills } from "./skillLoadout";

// ---------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------

type AttributeName = "Str" | "Dex" | "Con" | "Int";
type Side = "player" | "enemy";

export type Status =
  | { kind: "stat"; stat: AttributeName; amount: number; turnsLeft: number }
  | { kind: "damageMod"; percent: number; turnsLeft: number }
  | { kind: "guard"; multiplier: number; turnsLeft: number }
  | { kind: "evade"; chance: number; turnsLeft: number }
  | { kind: "burn"; damage: number; turnsLeft: number }
  | { kind: "stun"; turnsLeft: number };

export type Fighter = {
  hp: number;
  maxHp: number;
  mana: number; // enemies ignore it
  cooldowns: Record<string, number>; // skill id -> turns until usable again
  statuses: Status[];
};

export type LogEntry = { text: string; tone: Side | "info" };

export type CombatPhase = "playerTurn" | "enemyTurn" | "won" | "lost" | "fled";

export type CombatState = {
  phase: CombatPhase;
  round: number;
  player: Fighter;
  enemy: Fighter;
  log: LogEntry[];
};

// Fixed for the whole fight: gear and skills can't change in combat.
export type CombatContext = {
  player: Player;
  enemy: Enemy;
  encounter: CombatEncounter;
};

type Action =
  | { kind: "skill"; skill: Skill }
  | { kind: "basic" } // an enemy with no usable skill
  | { kind: "skip" }; // stunned

// ---------------------------------------------------------------------
// Math
// ---------------------------------------------------------------------

export function getDodgeChance(dex: number): number {
  const points = Math.max(0, dex - BASELINE_STAT);

  return (
    BASE_DODGE +
    (MAX_DODGE - BASE_DODGE) * (points / (points + DODGE_HALF_POINT))
  );
}

export function getDefenseReduction(defense: number): number {
  return defense / (defense + DEFENSE_HALF_POINT);
}

function rollInt(min: number, max: number, random: () => number): number {
  return min + Math.floor(random() * (max - min + 1));
}

// ---------------------------------------------------------------------
// Statuses
// ---------------------------------------------------------------------

/*
 * "N turns" means N times it matters:
 * - burn, guard, evade and stun count down after the OPPONENT's action
 *   (burn ticks, guard blocks N hits, stun skips N turns)
 * - stat buffs and damageMod count down after the owner's OWN action
 *   (they boost the next N actions)
 */
const OWN_ACTION_KINDS: Status["kind"][] = ["stat", "damageMod"];

// Casting the same status again refreshes it instead of stacking.
function statusKey(status: Status): string {
  if (status.kind === "stat") {
    return `stat:${status.stat}:${status.amount >= 0 ? "up" : "down"}`;
  }

  if (status.kind === "damageMod") {
    return `damageMod:${status.percent >= 0 ? "up" : "down"}`;
  }

  return status.kind;
}

function addStatus(statuses: Status[], status: Status): Status[] {
  const key = statusKey(status);

  return [
    ...statuses.filter((existing) => statusKey(existing) !== key),
    status,
  ];
}

function effectToStatus(effect: SkillEffect): Status | null {
  switch (effect.type) {
    case "buff":
      return {
        kind: "stat",
        stat: effect.stat,
        amount: effect.amount,
        turnsLeft: effect.turns,
      };
    case "damageMod":
      return {
        kind: "damageMod",
        percent: effect.percent,
        turnsLeft: effect.turns,
      };
    case "guard":
      return {
        kind: "guard",
        multiplier: effect.multiplier,
        turnsLeft: effect.turns,
      };
    case "evade":
      return { kind: "evade", chance: effect.chance, turnsLeft: effect.turns };
    case "burn":
      return { kind: "burn", damage: effect.damage, turnsLeft: effect.turns };
    case "stun":
      return { kind: "stun", turnsLeft: effect.turns };
    case "heal":
      return null;
  }
}

function isStunned(fighter: Fighter): boolean {
  return fighter.statuses.some((status) => status.kind === "stun");
}

function getDamageMultiplier(statuses: Status[]): number {
  return statuses.reduce(
    (total, status) =>
      status.kind === "damageMod" ? total * (1 + status.percent / 100) : total,
    1,
  );
}

function getGuardMultiplier(statuses: Status[]): number {
  return statuses.reduce(
    (total, status) =>
      status.kind === "guard" ? total * status.multiplier : total,
    1,
  );
}

// Dodge and evade statuses are independent sources of avoiding a hit.
function getAvoidChance(baseDodge: number, statuses: Status[]): number {
  let hitChance = 1 - baseDodge;

  for (const status of statuses) {
    if (status.kind === "evade") {
      hitChance *= 1 - status.chance;
    }
  }

  return 1 - hitChance;
}

// The player with stat buffs and debuffs applied, so the existing damage
// functions work unchanged.
function getEffectivePlayer(player: Player, statuses: Status[]): Player {
  const effective = { ...player };

  for (const status of statuses) {
    if (status.kind === "stat") {
      effective[status.stat] = Math.max(
        0,
        effective[status.stat] + status.amount,
      );
    }
  }

  return effective;
}

// After the opponent's action: burn damage, then count everything down.
function tickFighter(
  fighter: Fighter,
  side: Side,
  ctx: CombatContext,
): { fighter: Fighter; burnDamage: number } {
  let burnDamage = 0;
  const statuses: Status[] = [];

  for (const status of fighter.statuses) {
    if (OWN_ACTION_KINDS.includes(status.kind)) {
      statuses.push(status);
      continue;
    }

    if (status.kind === "burn") {
      const resistance = side === "enemy" ? ctx.enemy.resistances.fire : 1;
      burnDamage += Math.max(1, Math.round(status.damage * resistance));
    }

    if (status.turnsLeft > 1) {
      statuses.push({ ...status, turnsLeft: status.turnsLeft - 1 });
    }
  }

  return {
    fighter: { ...fighter, hp: fighter.hp - burnDamage, statuses },
    burnDamage,
  };
}

// After the owner's own action: buffs and debuffs on its damage count down.
function tickOwnClock(fighter: Fighter): Fighter {
  const statuses = fighter.statuses.flatMap((status): Status[] => {
    if (!OWN_ACTION_KINDS.includes(status.kind)) {
      return [status];
    }

    return status.turnsLeft > 1
      ? [{ ...status, turnsLeft: status.turnsLeft - 1 }]
      : [];
  });

  return { ...fighter, statuses };
}

function applyEffects(
  fighter: Fighter,
  effects: SkillEffect[],
): { fighter: Fighter; healed: number } {
  let next = fighter;
  let healed = 0;

  for (const effect of effects) {
    if (effect.type === "heal") {
      const amount =
        (effect.amount ?? 0) +
        Math.round(((effect.percentOfMax ?? 0) / 100) * next.maxHp);
      const hp = Math.min(next.maxHp, next.hp + amount);

      healed += hp - next.hp;
      next = { ...next, hp };
      continue;
    }

    const status = effectToStatus(effect);

    if (status) {
      next = { ...next, statuses: addStatus(next.statuses, status) };
    }
  }

  return { fighter: next, healed };
}

// A skill with "Väntetid 2" is usable again 2 turns after it was used.
function decrementCooldowns(
  cooldowns: Record<string, number>,
): Record<string, number> {
  const next: Record<string, number> = {};

  for (const [skillId, turns] of Object.entries(cooldowns)) {
    if (turns > 1) {
      next[skillId] = turns - 1;
    }
  }

  return next;
}

// ---------------------------------------------------------------------
// Damage
// ---------------------------------------------------------------------

function rollPlayerHit(
  skill: Skill,
  attacker: Fighter,
  target: Fighter,
  ctx: CombatContext,
  random: () => number,
): number {
  return rollSkillDamage(
    getEffectivePlayer(ctx.player, attacker.statuses),
    skill,
    getEquippedWeapon(ctx.player),
    ctx.enemy.resistances,
    random,
    getDamageMultiplier(attacker.statuses) *
      getGuardMultiplier(target.statuses),
  );
}

// Enemies have no attributes: their own min-max roll, times the skill's
// multiplier, times buffs, reduced by your Försvar.
function rollEnemyHit(
  skill: Skill | null,
  attacker: Fighter,
  target: Fighter,
  ctx: CombatContext,
  random: () => number,
): number {
  const damage = skill?.damage;

  const base =
    damage?.kind === "spell"
      ? rollInt(damage.min, damage.max, random)
      : rollInt(ctx.enemy.minDamage, ctx.enemy.maxDamage, random) *
        (damage?.kind === "weapon" ? damage.multiplier : 1);

  const reduction = getDefenseReduction(getDefense(ctx.player));

  return Math.max(
    1,
    Math.round(
      base *
        getDamageMultiplier(attacker.statuses) *
        (1 - reduction) *
        getGuardMultiplier(target.statuses),
    ),
  );
}

// ---------------------------------------------------------------------
// One action: hit -> tick the other side -> own countdown -> new
// statuses -> ONE death check
// ---------------------------------------------------------------------

function performAction(
  state: CombatState,
  ctx: CombatContext,
  actor: Side,
  action: Action,
  random: () => number,
): CombatState {
  const defender: Side = actor === "player" ? "enemy" : "player";
  const subject = (side: Side) => (side === "player" ? "Du" : ctx.enemy.name);
  const log = [...state.log];
  const say = (text: string, tone: LogEntry["tone"] = actor) =>
    log.push({ text, tone });

  let attacker = { ...state[actor] };
  let target = { ...state[defender] };

  const skill = action.kind === "skill" ? action.skill : null;
  const targetsOpponent = action.kind === "basic" || skill?.target === "enemy";
  const dealsDamage = action.kind === "basic" || skill?.damage !== undefined;

  // Costs
  if (skill) {
    if (actor === "player" && skill.manaCost) {
      attacker.mana = Math.max(0, attacker.mana - skill.manaCost);
    }

    if (skill.cooldown) {
      attacker.cooldowns = {
        ...attacker.cooldowns,
        [skill.id]: skill.cooldown,
      };
    }
  }

  // 1. The hit
  let missed = false;

  if (action.kind === "skip") {
    say(
      actor === "player"
        ? "Du är bedövad och förlorar din tur!"
        : `${ctx.enemy.name} är bedövad och förlorar sin tur!`,
      "info",
    );
  } else {
    const used = `${subject(actor)} ${skill ? `använder ${skill.name}` : "anfaller"}`;

    if (targetsOpponent) {
      const dodge =
        defender === "player"
          ? getDodgeChance(getEffectivePlayer(ctx.player, target.statuses).Dex)
          : 0;

      missed = random() < getAvoidChance(dodge, target.statuses);

      if (missed) {
        say(
          actor === "player"
            ? `${used}, men missar!`
            : `${used}, men du undviker attacken!`,
        );
      } else if (dealsDamage) {
        const damage =
          actor === "player" && skill
            ? rollPlayerHit(skill, attacker, target, ctx, random)
            : rollEnemyHit(skill, attacker, target, ctx, random);

        target = { ...target, hp: target.hp - damage };
        say(
          actor === "player"
            ? `${used} och gör ${damage} skada.`
            : `${used} och du tar ${damage} skada.`,
        );
      } else {
        say(`${used}.`);
      }
    } else {
      say(`${used}.`);
    }
  }

  // 2. The other side's statuses tick (burn damage, countdowns)
  const tick = tickFighter(target, defender, ctx);
  target = tick.fighter;

  if (tick.burnDamage > 0) {
    say(
      `${subject(defender)} tar ${tick.burnDamage} skada av brännskada.`,
      "info",
    );
  }

  // 3. The actor's own damage buffs count down (not on a skipped turn)
  if (action.kind !== "skip") {
    attacker = tickOwnClock(attacker);
  }

  // 4. New statuses and healing from the skill, applied after the tick
  if (skill?.effects && !missed && target.hp > 0) {
    const recipientSide: Side = skill.target === "self" ? actor : defender;
    const who = subject(recipientSide);

    const applied = applyEffects(
      recipientSide === actor ? attacker : target,
      skill.effects,
    );

    if (recipientSide === actor) {
      attacker = applied.fighter;
    } else {
      target = applied.fighter;
    }

    for (const effect of skill.effects) {
      if (effect.type === "burn") {
        say(`${who} fattar eld!`, "info");
      }

      if (effect.type === "stun") {
        say(`${who} bedövas!`, "info");
      }
    }

    if (applied.healed > 0) {
      say(`${who} återfår ${applied.healed} hälsa.`, "info");
    }
  }

  // 5. One death check
  const player = actor === "player" ? attacker : target;
  const enemy = actor === "enemy" ? attacker : target;

  const next: CombatState = {
    ...state,
    player: { ...player, hp: Math.max(0, player.hp) },
    enemy: { ...enemy, hp: Math.max(0, enemy.hp) },
    log,
  };

  if (next.enemy.hp <= 0) {
    log.push({ text: `${ctx.enemy.name} faller!`, tone: "info" });
    return { ...next, phase: "won" };
  }

  if (next.player.hp <= 0) {
    log.push({ text: "Du faller...", tone: "info" });
    return { ...next, phase: "lost" };
  }

  if (actor === "player") {
    return { ...next, phase: "enemyTurn" };
  }

  return startPlayerTurn({ ...next, round: next.round + 1 }, ctx, random);
}

function startPlayerTurn(
  state: CombatState,
  ctx: CombatContext,
  random: () => number,
): CombatState {
  const prepared: CombatState = {
    ...state,
    phase: "playerTurn",
    player: {
      ...state.player,
      cooldowns: decrementCooldowns(state.player.cooldowns),
    },
  };

  if (isStunned(prepared.player)) {
    return performAction(prepared, ctx, "player", { kind: "skip" }, random);
  }

  return prepared;
}

// The strongest usable skill (highest cooldown) first, ties at random.
// With nothing usable the enemy attacks normally.
function chooseEnemySkill(
  state: CombatState,
  ctx: CombatContext,
  random: () => number,
): Skill | null {
  const usable = ctx.enemy.skills
    .map(getSkill)
    .filter((skill): skill is Skill => skill !== undefined)
    .filter((skill) => (state.enemy.cooldowns[skill.id] ?? 0) === 0);

  if (usable.length === 0) {
    return null;
  }

  const highest = Math.max(...usable.map((skill) => skill.cooldown ?? 0));
  const best = usable.filter((skill) => (skill.cooldown ?? 0) === highest);

  return best[Math.floor(random() * best.length)] ?? null;
}

// ---------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------

export function createCombat(ctx: CombatContext): CombatState {
  const maxHp = getMaxHP(ctx.player);

  return {
    phase: "playerTurn",
    round: 1,
    player: {
      hp: ctx.player.HP,
      maxHp,
      mana: ctx.player.Mana,
      cooldowns: {},
      statuses: [],
    },
    enemy: {
      hp: ctx.enemy.hp,
      maxHp: ctx.enemy.hp,
      mana: 0,
      cooldowns: {},
      statuses: [],
    },
    log: [{ text: `Striden mot ${ctx.enemy.name} börjar!`, tone: "info" }],
  };
}

export type SkillAvailability = {
  usable: boolean;
  cooldownLeft: number;
  enoughMana: boolean;
};

// For the skill buttons: disabled, and why.
export function getSkillAvailability(
  state: CombatState,
  skill: Skill,
): SkillAvailability {
  const cooldownLeft = state.player.cooldowns[skill.id] ?? 0;
  const enoughMana = state.player.mana >= (skill.manaCost ?? 0);

  return {
    usable: state.phase === "playerTurn" && cooldownLeft === 0 && enoughMana,
    cooldownLeft,
    enoughMana,
  };
}

export function playerUseSkill(
  state: CombatState,
  ctx: CombatContext,
  skillId: string,
  random: () => number = Math.random,
): CombatState {
  if (state.phase !== "playerTurn") {
    return state;
  }

  const { granted, chosen } = getBattleSkills(ctx.player);
  const skill = [...granted, ...chosen].find((entry) => entry?.id === skillId);

  if (!skill || !getSkillAvailability(state, skill).usable) {
    return state;
  }

  return performAction(state, ctx, "player", { kind: "skill", skill }, random);
}

export function playerFlee(
  state: CombatState,
  ctx: CombatContext,
): CombatState {
  if (state.phase !== "playerTurn" || ctx.enemy.isBoss) {
    return state;
  }

  return {
    ...state,
    phase: "fled",
    log: [
      ...state.log,
      { text: `Du flyr från ${ctx.enemy.name}!`, tone: "player" },
    ],
  };
}

export function enemyAct(
  state: CombatState,
  ctx: CombatContext,
  random: () => number = Math.random,
): CombatState {
  if (state.phase !== "enemyTurn") {
    return state;
  }

  const prepared: CombatState = {
    ...state,
    enemy: {
      ...state.enemy,
      cooldowns: decrementCooldowns(state.enemy.cooldowns),
    },
  };

  if (isStunned(prepared.enemy)) {
    return performAction(prepared, ctx, "enemy", { kind: "skip" }, random);
  }

  const skill = chooseEnemySkill(prepared, ctx, random);

  return performAction(
    prepared,
    ctx,
    "enemy",
    skill ? { kind: "skill", skill } : { kind: "basic" },
    random,
  );
}

// Call once, when the fight is over: it rolls the loot.
export function getCombatResult(
  state: CombatState,
  ctx: CombatContext,
  random: () => number = Math.random,
): CombatResult | null {
  const outcome: CombatOutcome | null =
    state.phase === "won"
      ? "win"
      : state.phase === "lost"
        ? "lose"
        : state.phase === "fled"
          ? "flee"
          : null;

  if (!outcome) {
    return null;
  }

  const won = outcome === "win";

  return {
    outcome,
    hp: Math.max(0, state.player.hp),
    mana: state.player.mana,
    exp: won ? ctx.enemy.exp : 0,
    gold: won ? ctx.enemy.gold : 0,
    loot: won ? rollLoot(ctx.enemy, ctx.encounter.extraLoot, random) : [],
  };
}

// ---------------------------------------------------------------------
// Dev helper for balancing: plays many fights automatically, always using
// the usable skill with the highest cooldown.
// ---------------------------------------------------------------------

export function simulateFights(player: Player, enemy: Enemy, count = 100) {
  const ctx: CombatContext = {
    player,
    enemy,
    encounter: {
      enemyId: enemy.id as EnemyId,
      winNodeId: "",
      loseNodeId: "",
    },
  };

  const { granted, chosen } = getBattleSkills(player);
  const skills = [
    ...granted,
    ...chosen.filter((skill): skill is Skill => skill !== null),
  ];

  let wins = 0;
  let losses = 0;
  let rounds = 0;

  for (let fight = 0; fight < count; fight++) {
    let state = createCombat(ctx);
    let safety = 0;

    while (
      (state.phase === "playerTurn" || state.phase === "enemyTurn") &&
      safety++ < 500
    ) {
      if (state.phase === "enemyTurn") {
        state = enemyAct(state, ctx);
        continue;
      }

      const pick = skills
        .filter((skill) => getSkillAvailability(state, skill).usable)
        .sort((a, b) => (b.cooldown ?? 0) - (a.cooldown ?? 0))[0];

      if (!pick) {
        break;
      }

      state = playerUseSkill(state, ctx, pick.id);
    }

    rounds += state.round;

    if (state.phase === "won") {
      wins++;
    } else {
      losses++;
    }
  }

  return { wins, losses, averageRounds: Math.round(rounds / count) };
}
