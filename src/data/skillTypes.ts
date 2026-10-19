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
  | { type: "heal"; amount: number }
  | {
      type: "status";
      stat: "Bleed" | "Burn" | "Stunned" | "Poisoned";
      turns: number;
    };

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
