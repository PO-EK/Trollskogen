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
    id: "crush_swing",
    name: "Klubbsving",
    description: "Svinga ditt vapen som en klubba.",
    target: "enemy",
    damageType: "crushing",
    damage: { kind: "weapon", multiplier: 1 },
  },
  {
    id: "torch_bash",
    name: "Eld klubba",
    description: "Tänd eld på dina fiender.",
    target: "enemy",
    damageType: "fire",
    damage: { kind: "weapon", multiplier: 1 },
  },
  {
    id: "slash_quick",
    name: "Snabbhugg",
    description: "Ett snabbt hugg som gör måttlig skada.",
    target: "enemy",
    damageType: "slashing",
    damage: { kind: "weapon", multiplier: 1 },
  },
  {
    id: "slash_area",
    name: "Virvelhugg",
    description: "En roterande attack som sveper över ett område.",
    target: "enemy",
    damageType: "slashing",
    damage: { kind: "weapon", multiplier: 1.5 },
    cooldown: 1,
  },
  {
    id: "slash_hard",
    name: "Klyvhugg",
    description: "Ett kraftfullt hugg riktat uppifrån och ned.",
    target: "enemy",
    damageType: "slashing",
    damage: { kind: "weapon", multiplier: 1.8 },
    cooldown: 2,
  },
  {
    id: "sweep_cut",
    name: "Sidsnitt",
    description: "Ett välplacerat hugg som gör mer skada.",
    target: "enemy",
    damageType: "slashing",
    damage: { kind: "weapon", multiplier: 2 },
    cooldown: 3,
  },
  {
    id: "stab_quick",
    name: "Framåtstick",
    description:
      "En attack där svärdet förs framåt med spetsen först för att tränga in i målet.",
    target: "enemy",
    damageType: "piercing",
    damage: { kind: "weapon", multiplier: 1 },
  },
  {
    id: "stab_hard",
    name: "Genomborrning",
    description: "Ett kraftfullt stick avsett att tränga igenom rustning.",
    target: "enemy",
    damageType: "piercing",
    damage: { kind: "weapon", multiplier: 1.5 },
    cooldown: 1,
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
