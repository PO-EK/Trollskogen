import type { WeaponItem } from "../data/itemTypes";
import type { DamageType, Skill } from "../data/skillTypes";
import type { Player } from "../data/player";
import { FISTS } from "../data/weapons";
import { getDamageRange, rollDamage } from "./weaponDamage";
import { getFlatAttackBonus } from "./characterStats";

// The damage range shown on a skill card, with your stats applied.
export function getSkillDamageRange(
  player: Player,
  skill: Skill,
  weapon: WeaponItem | null,
): { min: number; max: number } | null {
  const damage = skill.damage;

  if (!damage) {
    return null;
  }

  if (damage.kind === "weapon") {
    const range = getDamageRange(
      player,
      weapon ?? FISTS,
      getFlatAttackBonus(player),
    );

    return {
      min: Math.round(range.min * damage.multiplier),
      max: Math.round(range.max * damage.multiplier),
    };
  }

  return getDamageRange(player, {
    minDamage: damage.min,
    maxDamage: damage.max,
    stat: damage.stat,
  });
}

// Per-type multipliers on the target, e.g. { slashing: 0.5, crushing: 1.25 }.
export type Resistances = Partial<Record<DamageType, number>>;

export function rollSkillDamage(
  player: Player,
  skill: Skill,
  weapon: WeaponItem | null,
  resistances: Resistances = {},
  random: () => number = Math.random,
  extraMultiplier = 1,
): number {
  const damage = skill.damage;

  if (!damage) {
    return 0;
  }

  let base: number;

  if (damage.kind === "weapon") {
    base =
      rollDamage(player, weapon ?? FISTS, random, getFlatAttackBonus(player)) *
      damage.multiplier;
  } else {
    base = rollDamage(
      player,
      { minDamage: damage.min, maxDamage: damage.max, stat: damage.stat },
      random,
    );
  }

  const resistance = skill.damageType
    ? (resistances[skill.damageType] ?? 1)
    : 1;

  // A hit always does at least 1 damage.
  return Math.max(1, Math.round(base * resistance * extraMultiplier));
}
