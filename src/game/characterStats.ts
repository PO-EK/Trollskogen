import { items } from "../data/items";
import type { WeaponItem } from "../data/itemTypes";
import type { Player } from "../data/player";
import { FISTS } from "../data/weapons";
import {
  BASELINE_STAT,
  HP_BONUS_PER_CON_POINT,
  HP_PER_CON_POINT,
} from "./balance";
import { getStatMultiplier } from "./weaponDamage";

export type CharacterStats = {
  attack: number; // average damage per hit, rounded up
  defense: number;
  maxHP: number;
  weaponName: string | null;
};

function getEquippedWeapon(player: Player): WeaponItem | null {
  const equipped = player.Equipment.mainHand;

  if (!equipped) {
    return null;
  }

  const definition = items.find((item) => item.id === equipped.itemId);

  return definition?.category === "weapon" ? definition : null;
}

export function getDefense(player: Player): number {
  let total = 0;

  for (const equipped of Object.values(player.Equipment)) {
    if (!equipped) {
      continue;
    }

    const definition = items.find((item) => item.id === equipped.itemId);

    if (definition?.category === "armour") {
      total += definition.defense;
    }
  }

  return total;
}

// Flat damage added to the weapon before the attribute multiplier:
// bonuses from equipment now, temporary buffs later.
export function getFlatAttackBonus(player: Player): number {
  let total = 0;

  for (const equipped of Object.values(player.Equipment)) {
    if (!equipped) {
      continue;
    }

    const definition = items.find((item) => item.id === equipped.itemId);

    if (definition?.category === "armour") {
      total += definition.attackBonus ?? 0;
    }
  }

  // Buffs like Warcry will be added here once combat tracks them.

  return total;
}

// (weapon average + flat bonuses) x attribute multiplier, rounded up.
export function getAttack(player: Player): number {
  const weapon = getEquippedWeapon(player) ?? FISTS;
  const average = (weapon.minDamage + weapon.maxDamage) / 2;

  return Math.ceil(
    (average + getFlatAttackBonus(player)) * getStatMultiplier(player, weapon),
  );
}

// 10 HP per Fysik point, then a percentage bonus per point above baseline.
export function getMaxHP(player: Player): number {
  const flat = HP_PER_CON_POINT * player.Con;
  const multiplier = Math.max(
    0,
    1 + HP_BONUS_PER_CON_POINT * (player.Con - BASELINE_STAT),
  );

  return Math.max(1, Math.ceil(flat * multiplier));
}

export function getCharacterStats(player: Player): CharacterStats {
  return {
    attack: getAttack(player),
    defense: getDefense(player),
    maxHP: getMaxHP(player),
    weaponName: getEquippedWeapon(player)?.name ?? null,
  };
}
