import type { Skill } from "./skillTypes";

export const skills: Skill[] = [
  {
    id: "punch",
    name: "Slag",
    description: "Ett nävslag. Bättre än ingenting.",
    target: "enemy",
    damageType: "crushing",
    damage: { kind: "weapon", multiplier: 1 },
  },
  {
    id: "slash",
    name: "Hugg",
    description: "Ett enkelt hugg med vapnet.",
    target: "enemy",
    damageType: "slashing",
    damage: { kind: "weapon", multiplier: 1 },
  },
  {
    id: "clean_cut",
    name: "Rent snitt",
    description: "Ett välplacerat hugg som gör mer skada.",
    target: "enemy",
    damageType: "slashing",
    damage: { kind: "weapon", multiplier: 1.5 },
    cooldown: 2,
  },
  {
    id: "stab",
    name: "Stick",
    description: "En stöt som tränger igenom pansar.",
    target: "enemy",
    damageType: "piercing",
    damage: { kind: "weapon", multiplier: 1 },
  },
  {
    id: "fireball",
    name: "Eldklot",
    description: "Ett klot av eld.",
    target: "enemy",
    damageType: "fire",
    damage: { kind: "spell", min: 15, max: 25, stat: "Int" },
    manaCost: 10,
  },
  {
    id: "warcry",
    name: "Stridsrop",
    description: "Ett vrål som ger dig styrka en stund.",
    target: "self",
    effects: [{ type: "buff", stat: "Str", amount: 5, turns: 3 }],
    manaCost: 5,
    cooldown: 4,
  },
];

const skillMap = new Map(skills.map((skill) => [skill.id, skill]));

export function getSkill(id: string): Skill | undefined {
  return skillMap.get(id);
}
