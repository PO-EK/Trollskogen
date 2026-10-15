import type { WeaponItem } from "../data/itemTypes";
import type { DamageType, Skill } from "../data/skillTypes";
import type { Player } from "../data/player";
import { getSkill } from "../data/skills";
import { FISTS } from "../data/weapons";
import { rollDamage } from "./weaponDamage";
import { getFlatAttackBonus } from "./characterStats";
export const MAX_SKILL_SLOTS = 6;
const UNARMED_SKILL_IDS = ["punch"];

/*
 * The skills available in battle: the weapon's skills first, then the
 * player's chosen spells/skills, cut off at the slot limit.
 * Computed on demand, so swapping weapons never leaves stale data behind.
 */
export function getBattleSkills(
  weapon: WeaponItem | null,
  equippedSkillIds: string[],
): Skill[] {
  const weaponSkillIds = weapon ? weapon.skills : UNARMED_SKILL_IDS;

  return [...weaponSkillIds, ...equippedSkillIds]
    .slice(0, MAX_SKILL_SLOTS)
    .map(getSkill)
    .filter((skill): skill is Skill => skill !== undefined);
}

// Per-type multipliers on the target, e.g. { slashing: 0.5, crushing: 1.25 }.
export type Resistances = Partial<Record<DamageType, number>>;

export function rollSkillDamage(
  player: Player,
  skill: Skill,
  weapon: WeaponItem | null,
  resistances: Resistances = {},
  random: () => number = Math.random,
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
  return Math.max(1, Math.round(base * resistance));
}
