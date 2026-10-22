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

// The kinds of status a fighter can have. Cures refer to these.
export type StatusKind =
  | "stat"
  | "damageMod"
  | "guard"
  | "evade"
  | "burn"
  | "bleed"
  | "stun";

// Added to every effect: the chance (0 to 1) that it takes hold when the
// skill hits. Without it the effect always applies.
type EffectChance = { applyChance?: number };

export type SkillEffect = EffectChance &
  (
    | {
        type: "buff";
        stat: "Str" | "Dex" | "Con" | "Int";
        amount: number;
        turns: number;
      }
    | { type: "heal"; amount?: number; percentOfMax?: number }
    | { type: "restoreMana"; amount?: number; percentOfMax?: number }
    | { type: "cure"; statuses: StatusKind[] }
    | { type: "damageMod"; percent: number; turns: number }
    | { type: "guard"; multiplier: number; turns: number }
    | { type: "evade"; chance: number; turns: number }
    // damage is per layer; maxStacks > 1 lets repeated hits stack
    | { type: "burn"; damage: number; turns: number; maxStacks?: number }
    | { type: "bleed"; damage: number; turns: number; maxStacks?: number }
    | { type: "stun"; turns: number }
  );

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
