import { getSkill } from "./skills";

export type AttributeName = "Str" | "Dex" | "Con" | "Int";

export type AttributeBonus = {
  attribute: AttributeName;
  amount: number;
};

export type SkillTreeDefinition = {
  id: string;
  name: string;
  icon: string;
  lockedAttribute: AttributeName; // the tree's main attribute, used for its tab
};

export type TreeNode = {
  id: string; // "<tree>:<node>", saved in the player's file
  kind: "attribute" | "skill"; // "skill" if it teaches one, otherwise "attribute"
  treeId: string;
  attribute?: AttributeName; // first bonus (kept for older code)
  attributeAmount?: number;
  bonuses?: AttributeBonus[]; // everything the node gives
  skillId?: string;
  requires: TreeNode[]; // needs ANY ONE of these first. None = a starting node
  cost: number | null; // skill points
};

export const SKILL_TREE_TREES: SkillTreeDefinition[] = [];
const nodes: TreeNode[] = [];

const DEFAULT_COST = 1;

// What you write for one node.
type NodeDef<Id extends string> = {
  id: Id; // unique inside its tree
  requires?: NoInfer<Id>[]; // needs ANY ONE of these first. Leave out = a starting node
  skill?: string; // teaches this skill
  attributes?: Partial<Record<AttributeName, number>>; // e.g. { Str: 1, Con: 1 }
  cost?: number | null; // skill points, default 1
};

function tree<Id extends string>(
  id: string,
  meta: { name: string; icon: string; lockedAttribute: AttributeName },
  defs: NodeDef<Id>[],
): void {
  SKILL_TREE_TREES.push({ id, ...meta });

  // 1. Build the nodes.
  const built = new Map<string, TreeNode>();

  for (const def of defs) {
    if (built.has(def.id)) {
      console.error(`Skill tree "${id}": two nodes called "${def.id}"`);
    }

    const bonuses: AttributeBonus[] = Object.entries(def.attributes ?? {})
      .map(([attribute, amount]) => ({
        attribute: attribute as AttributeName,
        amount: amount ?? 0,
      }))
      .filter((bonus) => bonus.amount !== 0);

    built.set(def.id, {
      id: `${id}:${def.id}`,
      kind: def.skill ? "skill" : "attribute",
      treeId: id,
      skillId: def.skill,
      attribute: bonuses[0]?.attribute,
      attributeAmount: bonuses[0]?.amount,
      bonuses,
      requires: [],
      cost: def.cost ?? DEFAULT_COST,
    });
  }

  // 2. Connect them by id.
  for (const def of defs) {
    const node = built.get(def.id);

    if (!node) {
      continue;
    }

    for (const requiredId of def.requires ?? []) {
      const required = built.get(requiredId);

      if (required) {
        node.requires.push(required);
      } else {
        console.error(
          `Skill tree "${id}": "${def.id}" requires unknown node "${requiredId}"`,
        );
      }
    }
  }

  // 3. Order them so every node comes after what it requires (the layout
  // needs that), keeping the order you wrote them in as far as possible.
  const placed = new Set<TreeNode>();
  const remaining = [...built.values()];

  while (remaining.length > 0) {
    const index = remaining.findIndex((node) =>
      node.requires.every((required) => placed.has(required)),
    );

    if (index === -1) {
      console.error(
        `Skill tree "${id}": these nodes require each other in a loop: ${remaining.map((node) => node.id).join(", ")}`,
      );
      nodes.push(...remaining);
      break;
    }

    const next = remaining.splice(index, 1)[0];

    if (!next) {
      break;
    }

    placed.add(next);
    nodes.push(next);
  }
}

// =====================================================================
// THE TREES
//
//   { id: "root", attributes: { Str: 1, Con: 1 } }       a starting node
//   { id: "a", requires: ["root"], skill: "warcry" }      teaches a skill
//   { id: "b", requires: ["a"], attributes: { Str: 3 }, cost: 3 }
//   { id: "c", requires: ["a"], skill: "x", attributes: { Dex: 1 } }  both
//   { id: "d", requires: ["b", "c"] ... }                 any ONE of b, c
//
// Dead ends need no special node: stop writing and the path stops there.
// Left to right in a row follows the order you write them in.
// =====================================================================

tree("warrior", { name: "Krigare", icon: "🛡️", lockedAttribute: "Str" }, [
  {
    id: "str-root",
    skill: "Starkare",
    attributes: { Str: 3 },
  },
  { id: "root", attributes: { Str: 1, Con: 1 } },
  // Styrka
  { id: "warcry", requires: ["root"], skill: "warcry" },
  { id: "str-3", requires: ["warcry"], attributes: { Str: 2 } },
  { id: "str-4", requires: ["warcry"], attributes: { Str: 2 } },
  {
    id: "berserk",
    requires: ["str-3"],
    skill: "berserk",
  },
  {
    id: "takedown",
    requires: ["str-4"],
    skill: "takedown",
  },
  { id: "str-5", requires: ["berserk"], attributes: { Str: 2 }, cost: 1 },
  { id: "str-6", requires: ["takedown"], attributes: { Str: 2 }, cost: 1 },
  {
    id: "str-7",
    requires: ["str-5", "str-6"],
    attributes: { Str: 3 },
    cost: 1,
  },
  {
    id: "power_strike",
    requires: ["str-7"],
    skill: "power_strike",
  },
  {
    id: "str-end",
    requires: ["power_strike"],
    attributes: { Str: 5 },
    cost: 1,
  },
  // Fysik
  {
    id: "iron-skin",
    requires: ["root"],
    skill: "iron_skin",
  },
  { id: "con-2", requires: ["iron-skin"], attributes: { Con: 2 } },
  { id: "con-3", requires: ["iron-skin"], attributes: { Con: 2 } },
  {
    id: "steel_skin",
    requires: ["con-2"],
    skill: "steel_skin",
  },
  {
    id: "first-aid",
    requires: ["con-3"],
    skill: "first_aid",
  },
  {
    id: "con-5",
    requires: ["steel_skin"],
    attributes: { Con: 2 },
    cost: 1,
  },
  {
    id: "con-6",
    requires: ["first-aid"],
    attributes: { Con: 2 },
    cost: 1,
  },
  {
    id: "con-7",
    requires: ["con-5", "con-6"],
    attributes: { Con: 3 },
    cost: 1,
  },
  {
    id: "last_chance",
    requires: ["con-7"],
    skill: "last_chance",
  },
  {
    id: "con-end",
    requires: ["last_chance"],
    attributes: { Con: 5 },
    cost: 1,
  },
  {
    id: "con-root",
    skill: "Hälsosam Kropp",
    attributes: { Con: 3 },
  },
]);

tree("hunter", { name: "Jägare", icon: "🏹", lockedAttribute: "Dex" }, [
  { id: "root", attributes: { Dex: 2, Con: 3 } },

  // Smidighet och undvikande
  //damage
  { id: "speed", requires: ["root"], skill: "mark_target" },
  { id: "dmg-1", requires: ["speed"], attributes: { Dex: 2 } },
  { id: "dmg-2", requires: ["speed"], attributes: { Dex: 2 } },
  { id: "deep-cut", requires: ["dmg-1"], skill: "deep_cut" },
  { id: "molotov", requires: ["dmg-2"], skill: "molotov" },
  { id: "dmg-3", requires: ["deep-cut"], attributes: { Dex: 2 } },
  { id: "dmg-4", requires: ["molotov"], attributes: { Dex: 2 } },
  {
    id: "dmg-5",
    requires: ["dmg-3", "dmg-4"],
    skill: "Öva Smidighet",
    attributes: { Dex: 3 },
  },

  { id: "precise-cut", requires: ["dmg-5"], skill: "precise_cut" },
  { id: "dex-spell", requires: ["dmg-5"], skill: "wind_arrow" },
  {
    id: "dmg-end",
    requires: ["dex-spell", "precise-cut"],
    attributes: { Dex: 5 },
    cost: 1,
  },

  //defense
  { id: "quick-step", requires: ["root"], skill: "quick_step" },
  { id: "def-1", requires: ["quick-step"], attributes: { Dex: 1, Con: 2 } },
  { id: "def-2", requires: ["quick-step"], attributes: { Dex: 1, Con: 2 } },
  { id: "field-aid", requires: ["def-1"], skill: "field_aid" },
  { id: "clear-mind", requires: ["def-2"], skill: "clear_mind" },

  { id: "def-3", requires: ["field-aid"], attributes: { Con: 3 } },
  { id: "def-4", requires: ["clear-mind"], attributes: { Con: 3 } },

  {
    id: "def-5",
    requires: ["def-3", "def-4"],
    skill: "Uthållighet",
    attributes: { Con: 4 },
  },

  { id: "hunter-net", requires: ["def-5"], skill: "hunter_net" },
  { id: "second-wind", requires: ["def-5"], skill: "second_wind" },
  {
    id: "def-end",
    requires: ["hunter-net", "second-wind"],
    attributes: { Con: 5 },
    cost: 1,
  },
]);

tree("mage", { name: "Trollkarl", icon: "🔮", lockedAttribute: "Int" }, [
  {
    id: "magic-arrow",
    skill: "magicArrow",
    attributes: { Int: 1 },
  },
  { id: "int-boost", requires: ["magic-arrow"], attributes: { Int: 3 } },
  {
    id: "mana-shield",
    requires: ["int-boost"],
    skill: "mana_shield",
    attributes: { Int: 1 },
  },
  {
    id: "meditate",
    requires: ["int-boost"],
    skill: "meditate",
    attributes: { Int: 1 },
  },
  {
    id: "int_boost2",
    requires: ["meditate", "mana-shield"],
    attributes: { Int: 3 },
  },

  {
    id: "electric-shock",
    requires: ["int_boost2"],
    skill: "electric_shock",
    attributes: { Int: 1 },
  },
  { id: "cure", requires: ["int_boost2"], skill: "cure" },
  {
    id: "blood-sigil",
    requires: ["int_boost2"],
    skill: "blood_sigil",
  },

  // Eld
  { id: "fire", requires: ["electric-shock"], attributes: { Int: 2 } },
  {
    id: "fire-bolt",
    requires: ["fire"],
    skill: "fire_bolt",
  },

  { id: "fire-int", requires: ["fire-bolt"], attributes: { Int: 2 } },
  {
    id: "inferno",
    requires: ["fire-int"],
    skill: "inferno",
  },
  { id: "fire-3", requires: ["inferno"], attributes: { Int: 5 }, cost: 1 },

  // Ljus: skill and attribute in the same node
  { id: "light", requires: ["cure"], attributes: { Int: 2 } },
  {
    id: "heal-quick",
    requires: ["light"],
    skill: "heal_quick",
    cost: 1,
  },

  { id: "light-int", requires: ["heal-quick"], attributes: { Int: 2 } },
  {
    id: "holy-spear",
    requires: ["light-int"],
    skill: "holy_spear",
    attributes: { Int: 1 },
    cost: 1,
  },
  { id: "light-3", requires: ["holy-spear"], attributes: { Int: 5 }, cost: 1 },

  // Mörker
  { id: "dark", requires: ["blood-sigil"], attributes: { Int: 2 } },
  {
    id: "shadow_clone",
    requires: ["dark"],
    skill: "shadow_clone",
    attributes: { Int: 1 },
  },
  { id: "dark-int", requires: ["shadow_clone"], attributes: { Int: 2 } },

  {
    id: "curse-strong",
    requires: ["dark-int"],
    skill: "curse_strong",
    attributes: { Int: 1 },
  },
  {
    id: "dark-end",
    requires: ["curse-strong"],
    attributes: { Int: 5 },
    cost: 1,
  },
]);

// =====================================================================

export const SKILL_TREE_NODES: readonly TreeNode[] = nodes;

// Dev-only: catches mistakes while you edit the trees above.
if (import.meta.env.DEV) {
  for (const node of nodes) {
    if (node.skillId && !getSkill(node.skillId)) {
      console.error(
        `Skill tree: "${node.id}" teaches an unknown skill "${node.skillId}"`,
      );
    }

    if (!node.skillId && (node.bonuses?.length ?? 0) === 0) {
      console.error(
        `Skill tree: "${node.id}" gives nothing (no skill, no attributes)`,
      );
    }
  }

  for (const entry of SKILL_TREE_TREES) {
    const inTree = nodes.filter((node) => node.treeId === entry.id);

    if (!inTree.some((node) => node.requires.length === 0)) {
      console.error(
        `Skill tree: "${entry.id}" has no starting node (a node without requires)`,
      );
    }

    const skillIds = inTree.flatMap((node) =>
      node.skillId ? [node.skillId] : [],
    );
    const repeated = skillIds.filter(
      (skillId, index) => skillIds.indexOf(skillId) !== index,
    );

    for (const skillId of repeated) {
      console.error(`Skill tree: "${entry.id}" teaches "${skillId}" twice`);
    }
  }
}
