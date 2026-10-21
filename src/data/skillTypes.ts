import type { WeaponStat } from "./itemTypes";

export type DamageType =
  | "slashing"
  | "piercing"
  | "crushing"
  | "fire"
  | "dark"
  | "light";
// Derived from a skill's damage, never stored: weapon skills scale off the
// equipped weapon, spells have their own damage, support skills do no damage.
export type SkillGroup = "weapon" | "spell" | "support";
export type SkillDamage =
  // Rolls the equipped weapon's damage and multiplies it.
  | { kind: "weapon"; multiplier: number }
  // Own damage range, scaled by a player stat (spells).
  | { kind: "spell"; min: number; max: number; stat: WeaponStat };

export type SkillEffect =
  | {
      type: "buff";
      stat: "Str" | "Dex" | "Con" | "Int";
      amount: number;
      turns: number;
    }
  | { type: "heal"; amount?: number; percentOfMax?: number } // percentOfMax: 25 = 25%
  | { type: "damageMod"; percent: number; turns: number } // damage you deal, +/- %
  | { type: "guard"; multiplier: number; turns: number } // damage you take x this
  | { type: "evade"; chance: number; turns: number } // 0.5 = 50% of hits against you miss
  | { type: "burn"; damage: number; turns: number }
  | { type: "stun"; turns: number };

export type Skill = {
  id: string;
  name: string;
  description: string;
  target: "enemy" | "self";
  damage?: SkillDamage;
  damageType?: DamageType;
  effects?: SkillEffect[];
  manaCost?: number;
  cooldown?: number; // turns before it can be used again
};
