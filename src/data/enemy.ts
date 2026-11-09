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
  description: string;
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
  electric: 1,
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
    description:
      "En härjad rövare med slitet läder och ett vasst vapen i handen.",
    hp: 120,
    minDamage: 12,
    maxDamage: 15,
    skills: ["bandit_slash", "bandit_stab"],
    resistances: { ...neutralResistances },
    isBoss: false,
    exp: 44,
    gold: 14,
    loot: [drop("ruby", 0.5), drop("sapphire", 0.3), drop("diamond", 0.1)],
  },

  ambusher: {
    id: "ambusher",
    type: "human",
    name: "Spejare",
    description:
      "En vaksam spejare som rör sig lätt och väntar på rätt tillfälle att anfalla.",
    hp: 40,
    minDamage: 20,
    maxDamage: 38,
    skills: ["stab_quick"],
    resistances: { ...neutralResistances, slashing: 1.2 },
    isBoss: false,
    exp: 65,
    gold: 80,
    loot: [drop("health_potion", 0.5)],
  },

  mercenary: {
    id: "mercenary",
    type: "human",
    name: "Legoknekt",
    description:
      "En välutrustad legoknekt med stadig hållning och vana av strid.",
    hp: 220,
    minDamage: 22,
    maxDamage: 25,
    skills: ["slash_quick", "stab_hard", "rally"],
    resistances: { ...neutralResistances, piercing: 1.4 },
    isBoss: false,
    exp: 155,
    gold: 80,
    loot: [drop("battle_axe", 0.2)],
  },

  banditChief: {
    id: "banditChief",
    type: "human",
    name: "Rövarhövding",
    description:
      "Rövarnas hårdföra ledare, märkt av många strider och redo att försvara sitt byte.",
    hp: 140,
    minDamage: 50,
    maxDamage: 66,
    skills: ["slash_quick", "rally", "harden"],
    resistances: {
      ...neutralResistances,
      slashing: 0.75,
      crushing: 0.75,
    },
    isBoss: true,
    exp: 125,
    gold: 212,
    loot: [],
  },

  // ==========================================
  // Djur
  // ==========================================

  wolf: {
    id: "wolf",
    type: "animal",
    name: "Gråvarg",
    description:
      "En mager gråvarg blottar tänderna och cirklar rastlöst omkring dig.",
    hp: 58,
    minDamage: 5,
    maxDamage: 8,
    skills: ["bite", "claws", "watch"],
    resistances: {
      ...neutralResistances,
    },
    isBoss: false,
    exp: 42,
    gold: 6,
    loot: [drop("wolfMeat", 0.8), drop("wolfPelt", 0.5)],
  },

  wolverine: {
    id: "wolverine",
    type: "animal",
    name: "Järv",
    description: "En kompakt järv fräser ilsket och visar sina kraftiga klor.",
    hp: 40,
    minDamage: 13,
    maxDamage: 23,
    skills: ["bite", "dodge"],
    resistances: {
      ...neutralResistances,
      piercing: 0.75,
      crushing: 1.3,
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
    description:
      "En stor vildgalt stampar i marken med sänkt huvud och blottade betar.",
    hp: 90,
    minDamage: 6,
    maxDamage: 11,
    skills: ["bite", "stab_hard"],
    resistances: {
      ...neutralResistances,
      slashing: 0.75,
      crushing: 0.5,
    },
    isBoss: false,
    exp: 90,
    gold: 0,
    loot: [],
  },

  bear: {
    id: "bear",
    type: "animal",
    name: "Trollbjörn",
    description: "En väldig trollbjörn reser sig på bakbenen och ryter djupt.",
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
    description: "Små vättar med illvilliga leenden flockas omkring dig.",
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
    description:
      "En blek myling tycks drypa av mörkt vatten och viskar olycksbådande.",
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
    description:
      "Skogsrået står stilla mellan träden, vackert och hotfullt på samma gång.",
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
    description:
      "Ett massivt skogstroll höjer sina knotiga nävar och spärrar vägen.",
    hp: 200,
    minDamage: 14,
    maxDamage: 24,
    skills: ["punch", "harden", "crush_hard"],
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
