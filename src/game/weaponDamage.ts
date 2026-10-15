import type { WeaponStats } from "../data/itemTypes";
import type { Player } from "../data/player";
import { BASELINE_STAT, DAMAGE_BONUS_PER_POINT } from "./balance";

export function getStatMultiplier(player: Player, weapon: WeaponStats): number {
  const scaling = weapon.scaling ?? DAMAGE_BONUS_PER_POINT;
  const statValue = player[weapon.stat];

  return Math.max(0, 1 + (statValue - BASELINE_STAT) * scaling);
}

export function getDamageRange(
  player: Player,
  weapon: WeaponStats,
  flatBonus = 0,
): { min: number; max: number } {
  const multiplier = getStatMultiplier(player, weapon);

  return {
    min: Math.round((weapon.minDamage + flatBonus) * multiplier),
    max: Math.round((weapon.maxDamage + flatBonus) * multiplier),
  };
}

export function rollDamage(
  player: Player,
  weapon: WeaponStats,
  random: () => number = Math.random,
  flatBonus = 0,
): number {
  const { min, max } = getDamageRange(player, weapon, flatBonus);

  return min + Math.floor(random() * (max - min + 1));
}
