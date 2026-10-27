import type { ItemUse } from "../data/itemTypes";
import type { SkillEffect, StatusKind } from "../data/skillTypes";
import { CURE_LABELS } from "./labels";

type AttributeName = "Str" | "Dex" | "Con" | "Int";

export type Status =
  | { kind: "stat"; stat: AttributeName; amount: number; turnsLeft: number }
  | { kind: "damageMod"; percent: number; turnsLeft: number }
  | { kind: "guard"; multiplier: number; turnsLeft: number }
  | { kind: "evade"; chance: number; turnsLeft: number }
  | {
      kind: "burn";
      damage: number; // per layer
      turnsLeft: number;
      stacks: number;
      maxStacks: number;
    }
  | {
      kind: "bleed";
      damage: number; // per layer
      turnsLeft: number;
      stacks: number;
      maxStacks: number;
    }
  | { kind: "stun"; turnsLeft: number };

// Anything effects can act on: a fighter in combat, or the player outside it.
export type Vitals = {
  hp: number;
  maxHp: number;
  mana: number;
  maxMana: number;
  statuses: Status[];
};

export type StackableStatus = Extract<Status, { kind: "burn" | "bleed" }>;

export function isStackable(status: Status): status is StackableStatus {
  return status.kind === "burn" || status.kind === "bleed";
}

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
  const existing = statuses.find((candidate) => statusKey(candidate) === key);
  const others = statuses.filter((candidate) => statusKey(candidate) !== key);

  if (
    existing &&
    isStackable(existing) &&
    isStackable(status) &&
    existing.kind === status.kind
  ) {
    return [
      ...others,
      { ...status, stacks: Math.min(existing.stacks + 1, status.maxStacks) },
    ];
  }

  return [...others, status];
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
      return {
        kind: "burn",
        damage: effect.damage,
        turnsLeft: effect.turns,
        stacks: 1,
        maxStacks: effect.maxStacks ?? 1,
      };
    case "bleed":
      return {
        kind: "bleed",
        damage: effect.damage,
        turnsLeft: effect.turns,
        stacks: 1,
        maxStacks: effect.maxStacks ?? 1,
      };
    case "stun":
      return { kind: "stun", turnsLeft: effect.turns };
    case "heal":
    case "restoreMana":
    case "cure":
      return null;
    default:
      return null;
  }
}

function scaledAmount(
  amount: number | undefined,
  percentOfMax: number | undefined,
  max: number,
): number {
  return (amount ?? 0) + Math.round(((percentOfMax ?? 0) / 100) * max);
}

export type ApplyResult<T extends Vitals> = {
  fighter: T; // the target after the effects (a combat fighter, or the player's vitals)
  healed: number;
  manaRestored: number;
  cured: StatusKind[];
  applied: SkillEffect[]; // the effects that took hold, after the chance rolls
};

export function applyEffects<T extends Vitals>(
  fighter: T,
  effects: SkillEffect[],
  random: () => number = Math.random,
): ApplyResult<T> {
  let next = fighter;
  let healed = 0;
  let manaRestored = 0;
  const cured: StatusKind[] = [];
  const applied: SkillEffect[] = [];

  for (const effect of effects) {
    if (effect.applyChance !== undefined && random() >= effect.applyChance) {
      continue;
    }

    applied.push(effect);

    if (effect.type === "heal") {
      const hp = Math.min(
        next.maxHp,
        next.hp + scaledAmount(effect.amount, effect.percentOfMax, next.maxHp),
      );

      healed += hp - next.hp;
      next = { ...next, hp };
      continue;
    }

    if (effect.type === "restoreMana") {
      const mana = Math.min(
        next.maxMana,
        next.mana +
          scaledAmount(effect.amount, effect.percentOfMax, next.maxMana),
      );

      manaRestored += mana - next.mana;
      next = { ...next, mana };
      continue;
    }

    if (effect.type === "cure") {
      for (const kind of effect.statuses) {
        if (
          next.statuses.some((status) => status.kind === kind) &&
          !cured.includes(kind)
        ) {
          cured.push(kind);
        }
      }

      next = {
        ...next,
        statuses: next.statuses.filter(
          (status) => !effect.statuses.includes(status.kind),
        ),
      };
      continue;
    }

    const status = effectToStatus(effect);

    if (status) {
      next = { ...next, statuses: addStatus(next.statuses, status) };
    }
  }

  return { fighter: next, healed, manaRestored, cured, applied };
}

// "läkte för 100 hp och botade branden"
export function describeItemResult(result: {
  healed: number;
  manaRestored: number;
  cured: StatusKind[];
}): string {
  const parts: string[] = [];

  if (result.healed > 0) {
    parts.push(`läkte för ${result.healed} hp`);
  }

  if (result.manaRestored > 0) {
    parts.push(`återfick ${result.manaRestored} magi`);
  }

  if (result.cured.length > 0) {
    parts.push(
      `botade ${result.cured.map((kind) => CURE_LABELS[kind]).join(" och ")}`,
    );
  }

  return parts.join(" och ");
}

// Why an item would do nothing for these vitals, or null if it would help.
// Outside combat (inCombat = false) only healing and mana make sense:
// buffs and the like have nothing to last through.
export function getUseBlockReason(
  vitals: Vitals,
  use: ItemUse,
  inCombat = true,
): string | null {
  const { hp, maxHp, mana, maxMana, statuses } = vitals;
  let reason: string | null = null;

  for (const effect of use.effects) {
    if (effect.type === "heal") {
      if (hp < maxHp) {
        return null;
      }

      reason = reason ?? "Du har full hälsa.";
    } else if (effect.type === "restoreMana") {
      if (mana < maxMana) {
        return null;
      }

      reason = reason ?? "Du har full magi.";
    } else if (effect.type === "cure") {
      if (statuses.some((status) => effect.statuses.includes(status.kind))) {
        return null;
      }

      reason = reason ?? "Det finns inget att bota.";
    } else if (inCombat) {
      return null; // anything else always does something in a fight
    } else {
      reason = reason ?? "Det går bara att använda i strid.";
    }
  }

  return reason;
}
