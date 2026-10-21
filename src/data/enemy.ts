import enemyPH from "../assets/enemyPH.png";
import { items } from "./items";
import type { DamageType } from "./skillTypes";
import { getSkill } from "./skills";

export type EnemyType = "human" | "animal" | "fey"; // fey = älvor och vättar etc

// Damage multipliers: 1 = neutral, 0.5 = half damage, 2 = double damage.
export type EnemyResistances = Record<DamageType, number>;

// One possible drop. chance is 0 to 1, where 1 = always.
export type LootDrop = {
  itemId: string;
  chance: number;
};

export type Enemy = {
  id: string;
  type: EnemyType;
  name: string;
  image: string;
  exp: number;
  gold: number;
  loot: LootDrop[];

  // Base combat stats
  hp: number;
  minDamage: number;
  maxDamage: number;
  resistances: EnemyResistances;

  skills: string[];
  isBoss: boolean;
};

const neutralResistances: EnemyResistances = {
  slashing: 1,
  piercing: 1,
  crushing: 1,
  fire: 1,
  dark: 1,
  light: 1,
};

// drop("old_axe", 0.25) = 25% chance. drop("stolen_necklace") = always.
export function drop(itemId: string, chance = 1): LootDrop {
  return { itemId, chance };
}

export const enemies = {
  // ==========================================
  // Mänskliga fiender
  // ==========================================

  bandit: {
    id: "bandit",
    type: "human",
    name: "Rövare",
    image: enemyPH,
    hp: 60,
    minDamage: 18,
    maxDamage: 24,
    skills: ["slash_quick"],
    resistances: { ...neutralResistances, crushing: 0.5, piercing: 1.5 },
    isBoss: false,
    exp: 20,
    gold: 10,
    loot: [drop("old_axe", 0.25)],
  },

  ambusher: {
    id: "ambusher",
    type: "human",
    name: "Spejare",
    image: enemyPH,
    hp: 40,
    minDamage: 20,
    maxDamage: 38,
    skills: ["stab_quick"],
    resistances: { ...neutralResistances, slashing: 1.5 },
    isBoss: false,
    exp: 25,
    gold: 80,
    loot: [drop("wood_torch", 0.3)],
  },

  mercenary: {
    id: "mercenary",
    type: "human",
    name: "Legoknekt",
    image: enemyPH,
    hp: 86,
    minDamage: 32,
    maxDamage: 40,
    skills: ["slash_quick", "stab_hard", "rally"],
    resistances: { ...neutralResistances, crushing: 0.5, piercing: 1.5 },
    isBoss: false,
    exp: 60,
    gold: 50,
    loot: [drop("iron_sword", 0.5)],
  },

  banditChief: {
    id: "banditChief",
    type: "human",
    name: "Rövarhövding",
    image: enemyPH,
    hp: 140,
    minDamage: 50,
    maxDamage: 66,
    skills: ["slash_quick", "stab_hard", "rally", "harden"],
    resistances: {
      ...neutralResistances,
      slashing: 0.75,
      crushing: 0.75,
    },
    isBoss: true,
    exp: 150,
    gold: 500,
    loot: [],
  },

  // ==========================================
  // Djur
  // ==========================================

  wolf: {
    id: "wolf",
    type: "animal",
    name: "Svartvarg",
    image: enemyPH,
    hp: 28,
    minDamage: 14,
    maxDamage: 18,
    skills: ["bite"],
    resistances: {
      ...neutralResistances,
      piercing: 1.5,
    },
    isBoss: false,
    exp: 10,
    gold: 0,
    loot: [drop("leather", 1)],
  },

  wolverine: {
    id: "wolverine",
    type: "animal",
    name: "Järv",
    image: enemyPH,
    hp: 40,
    minDamage: 13,
    maxDamage: 23,
    skills: ["bite", "harden"],
    resistances: {
      ...neutralResistances,
      piercing: 0.75,
      crushing: 1.5,
    },
    isBoss: false,
    exp: 80,
    gold: 0,
    loot: [],
  },

  boar: {
    id: "boar",
    type: "animal",
    name: "Vildgalt",
    image: enemyPH,
    hp: 90,
    minDamage: 6,
    maxDamage: 11,
    skills: ["bite", "tackle", "stab_hard"],
    resistances: {
      ...neutralResistances,
      slashing: 0.75,
      crushing: 0.5,
    },
    isBoss: false,
    exp: 90,
    gold: 0,
    loot: [drop("leather", 0.6)],
  },

  bear: {
    id: "bear",
    type: "animal",
    name: "Trollbjörn",
    image: enemyPH,
    hp: 100,
    minDamage: 12,
    maxDamage: 20,
    skills: ["bite", "slash_hard", "rally"],
    resistances: {
      ...neutralResistances,
      slashing: 0.75,
      crushing: 0.75,
      piercing: 0.75,
      fire: 1.5,
      light: 2,
    },
    isBoss: false,
    exp: 200,
    gold: 0,
    loot: [drop("leather", 0.75)],
  },

  // ==========================================
  // Trollskogen fiender
  // ==========================================

  madcap: {
    id: "madcap",
    type: "fey",
    name: "Vättar",
    image: enemyPH,
    hp: 44,
    minDamage: 4,
    maxDamage: 8,
    skills: ["punch", "curse"],
    resistances: {
      ...neutralResistances,
      dark: 0.5,
      light: 1.5,
    },
    isBoss: false,
    exp: 20,
    gold: 3,
    loot: [],
  },

  drownling: {
    id: "drownling",
    type: "fey",
    name: "Myling",
    image: enemyPH,
    hp: 70,
    minDamage: 5,
    maxDamage: 9,
    skills: ["punch", "curse"],
    resistances: {
      ...neutralResistances,
      fire: 0.5,
      dark: 0.5,
      light: 2,
    },
    isBoss: false,
    exp: 30,
    gold: 0,
    loot: [drop("cloth", 0.5)],
  },

  dryad: {
    id: "dryad",
    type: "fey",
    name: "Skogsrå",
    image: enemyPH,
    hp: 80,
    minDamage: 5,
    maxDamage: 10,
    skills: ["punch", "curse"],
    resistances: {
      ...neutralResistances,
      piercing: 0.5,
      crushing: 0.5,
      slashing: 1.5,
      fire: 2,
      light: 0.75,
    },
    isBoss: false,
    exp: 120,
    gold: 35,
    loot: [drop("cloth", 0.5)],
  },

  troll: {
    id: "troll",
    type: "fey",
    name: "Skogstroll",
    image: enemyPH,
    hp: 200,
    minDamage: 14,
    maxDamage: 24,
    skills: ["punch", "harden", "crush_swing"],
    resistances: {
      ...neutralResistances,
      slashing: 1.25,
      crushing: 0.75,
      piercing: 0.75,
      fire: 1.5,
      dark: 0.5,
      light: 2,
    },
    isBoss: false,
    exp: 350,
    gold: 140,
    loot: [drop("woodlog", 0.5)],
  },
} satisfies Record<string, Enemy>;

// "bandit" | "wolf" | ... : a typo like enemyId: "banit" in an adventure
// becomes a compile error.
export type EnemyId = keyof typeof enemies;

export function getEnemy(id: EnemyId): Enemy {
  return enemies[id];
}

// Rolls every drop independently. extraLoot is for one specific fight
// (the startCombat effect). Returns the ids of the items that dropped.
export function rollLoot(
  enemy: Enemy,
  extraLoot: LootDrop[] = [],
  random: () => number = Math.random,
): string[] {
  return [...enemy.loot, ...extraLoot]
    .filter((lootDrop) => random() < lootDrop.chance)
    .map((lootDrop) => lootDrop.itemId);
}

// Dev-only: catches typos now that skills and items live in other files.
if (import.meta.env.DEV) {
  for (const [key, enemy] of Object.entries<Enemy>(enemies)) {
    if (key !== enemy.id) {
      console.error(`Enemy key "${key}" does not match its id "${enemy.id}"`);
    }

    for (const skillId of enemy.skills) {
      if (!getSkill(skillId)) {
        console.error(`${enemy.id} uses unknown skill: ${skillId}`);
      }
    }

    for (const { itemId, chance } of enemy.loot) {
      if (!items.some((item) => item.id === itemId)) {
        console.error(`${enemy.id} drops unknown item: ${itemId}`);
      }

      if (chance < 0 || chance > 1) {
        console.error(`${enemy.id}: drop chance for ${itemId} must be 0 to 1`);
      }
    }
  }
}
