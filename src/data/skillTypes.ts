import type { WeaponStat } from "./itemTypes";

export type DamageType = "slashing" | "piercing" | "crushing" | "fire";

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
  | { type: "heal"; amount: number };

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
