import { items } from "../data/items";
import type { WeaponItem } from "../data/itemTypes";
import type { Player } from "../data/player";
import { FISTS } from "../data/weapons";
import {
  BASELINE_STAT,
  HP_BONUS_PER_CON_POINT,
  HP_PER_CON_POINT,
  HP_PER_LEVEL,
  MANA_BONUS_PER_INT_POINT,
  MANA_PER_INT_POINT,
  MANA_PER_LEVEL,
} from "./balance";
import { getStatMultiplier } from "./weaponDamage";

export type CharacterStats = {
  attack: number;
  defense: number;
  maxHP: number;
  maxMana: number;
  weaponName: string | null;
};

export type AttributeBonus = {
  attribute: "Str" | "Dex" | "Con" | "Int";
  amount: number;
};

export function getEquippedWeapon(player: Player): WeaponItem | null {
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

export function getMaxHP(player: Player): number {
  const flat = HP_PER_CON_POINT * player.Con;

  const multiplier = Math.max(
    0,
    1 + HP_BONUS_PER_CON_POINT * (player.Con - BASELINE_STAT),
  );

  const attributeHP = Math.max(1, Math.ceil(flat * multiplier));

  return attributeHP + (player.Level - 1) * HP_PER_LEVEL;
}

export function getMaxMana(player: Player): number {
  const flat = MANA_PER_INT_POINT * player.Int;

  const multiplier = Math.max(
    0,
    1 + MANA_BONUS_PER_INT_POINT * (player.Int - BASELINE_STAT),
  );

  const attributeMana = Math.max(1, Math.ceil(flat * multiplier));

  return attributeMana + (player.Level - 1) * MANA_PER_LEVEL;
}

export function getCharacterStats(player: Player): CharacterStats {
  return {
    attack: getAttack(player),
    defense: getDefense(player),
    maxHP: getMaxHP(player),
    maxMana: getMaxMana(player),
    weaponName: getEquippedWeapon(player)?.name ?? null,
  };
}

export function recalculatePlayerStats(player: Player): Player {
  const maxHP = getMaxHP(player);
  const maxMana = getMaxMana(player);

  return {
    ...player,
    HPMax: maxHP,
    ManaMax: maxMana,
    HP: Math.min(player.HP, maxHP),
    Mana: Math.min(player.Mana, maxMana),
  };
}

export function restorePlayerResources(player: Player): Player {
  const updated = recalculatePlayerStats(player);

  return {
    ...updated,
    HP: updated.HPMax,
    Mana: updated.ManaMax,
  };
}

export function applyAttributeBonuses(
  player: Player,
  bonuses: readonly AttributeBonus[],
): Player {
  const updated = { ...player };

  for (const bonus of bonuses) {
    updated[bonus.attribute] += bonus.amount;
  }

  return restorePlayerResources(updated);
}
