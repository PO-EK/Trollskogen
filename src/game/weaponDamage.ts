import type { WeaponStats } from "../data/itemTypes";
import type { Player } from "../data/player";

const BASELINE_STAT = 10;
const DEFAULT_SCALING = 0.03;

export function getStatMultiplier(player: Player, weapon: WeaponStats): number {
  const scaling = weapon.scaling ?? DEFAULT_SCALING;
  const statValue = player[weapon.stat];

  return Math.max(0, 1 + (statValue - BASELINE_STAT) * scaling);
}

// What the equipment screen shows: the real range with your stats applied.
export function getDamageRange(
  player: Player,
  weapon: WeaponStats,
): { min: number; max: number } {
  const multiplier = getStatMultiplier(player, weapon);

  return {
    min: Math.round(weapon.minDamage * multiplier),
    max: Math.round(weapon.maxDamage * multiplier),
  };
}

// What combat uses each turn. `random` is injectable so you can test it.
export function rollDamage(
  player: Player,
  weapon: WeaponStats,
  random: () => number = Math.random,
): number {
  const { min, max } = getDamageRange(player, weapon);

  return min + Math.floor(random() * (max - min + 1));
}
