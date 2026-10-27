import { getSkill } from "./skills";

export type AttributeName = "Str" | "Dex" | "Con" | "Int";

export type TreeNode = {
  id: string; // saved in the player's file: don't rename after players have saves
  kind: "attribute" | "skill";
  branch: AttributeName; // which of the four trees it sits in
  attribute?: AttributeName;
  attributeAmount?: number;
  skillId?: string; // skill nodes: the skill they teach
  requires: TreeNode[]; // needs ANY ONE of these first. None = the branch root
  cost: number; // skill points
};

export const SKILL_TREE_BRANCHES: {
  attribute: AttributeName;
  icon: string;
}[] = [
  { attribute: "Str", icon: "⚔️" },
  { attribute: "Dex", icon: "🏹" },
  { attribute: "Con", icon: "🛡️" },
  { attribute: "Int", icon: "🔮" },
];

const DEFAULT_COST = 1;
const nodes: TreeNode[] = [];

type NodeOptions = { cost?: number; amount?: number };

// A +1 attribute node. With no `requires` it is the root of its branch.
function attr(
  id: string,
  attribute: AttributeName,
  requires: TreeNode[] = [],
  options: NodeOptions = {},
): TreeNode {
  const node: TreeNode = {
    id,
    kind: "attribute",
    branch: requires[0]?.branch ?? attribute,
    attribute,
    attributeAmount: options.amount ?? 1,
    requires,
    cost: options.cost ?? DEFAULT_COST,
  };

  nodes.push(node);
  return node;
}

// Skills follow a parent, or use an explicit branch when starting a tree.
function skill(
  skillId: string,
  branch: AttributeName,
  options?: NodeOptions,
): TreeNode;
function skill(
  skillId: string,
  requires: [TreeNode, ...TreeNode[]],
  options?: NodeOptions,
): TreeNode;
function skill(
  skillId: string,
  branchOrRequires: AttributeName | [TreeNode, ...TreeNode[]],
  options: NodeOptions = {},
): TreeNode {
  const requires = typeof branchOrRequires === "string" ? [] : branchOrRequires;
  const branch =
    typeof branchOrRequires === "string"
      ? branchOrRequires
      : branchOrRequires[0].branch;
  const node: TreeNode = {
    id: skillId, // a skill can only appear once in the whole tree
    kind: "skill",
    branch,
    skillId,
    requires,
    cost: options.cost ?? DEFAULT_COST,
  };

  nodes.push(node);
  return node;
}

// =====================================================================
// THE TREE
//
//   attr("id", "Str")                   a branch root (+1 Str)
//   attr("id", "Str", [parent])         +1 Str, after `parent`
//   attr("id", "Str", [parent], { amount: 3, cost: 3 })  +3 Str
//   skill("skill_id", [parent])         teaches a skill, after `parent`
//   skill("skill_id", [a, b])           needs a OR b first
//   skill("skill_id", [parent], { cost: 2 })
//   skill("skill_id", "Int")            skill root of the Int branch
//
// A node can only follow nodes written ABOVE it. The order you write
// nodes in is their left-to-right order in a row.
// Nobody needs a name? Don't assign it: just call attr(...) / skill(...).
// =====================================================================

// ---- Styrka ----
const warcry = skill("warcry", "Str");
const str3 = attr("str-3", "Str", [warcry]);
const str4 = attr("str-4", "Str", [warcry]);
const tackle = skill("tackle", [str3]);
const kick = skill("kick", [str4]);
attr("str-5", "Str", [tackle], { amount: 3, cost: 3 });
attr("str-6", "Str", [kick], { amount: 3, cost: 3 });

// ---- Smidighet ----
const speed = skill("speed", "Dex");
const dex2 = attr("dex-2", "Dex", [speed]);
const dex3 = attr("dex-3", "Dex", [dex2]);
skill("rend", [dex3]);
const quickStep = skill("quick_step", [dex3]);
skill("deep_cut", [dex3]);
attr("dex-4", "Dex", [quickStep], { amount: 3, cost: 3 });

// ---- Fysik ----
const ironSkin = skill("iron_skin", "Con");
const con2 = attr("con-2", "Con", [ironSkin]);
const con3 = attr("con-3", "Con", [con2]);
const healLight = skill("heal_light", [con3]);
const firstAid = skill("first_aid", [con3]);
skill("second_wind", [con3]);
attr("con-4", "Con", [healLight]);
attr("con-5", "Con", [firstAid], { amount: 3, cost: 3 });

// ---- Intelligens ----
const manashield = skill("mana_shield", "Int");
const BigInt = attr("Int", "Int", [manashield], { amount: 3, cost: 1 });
const meditate = skill("meditate", [BigInt]);
const fire = attr("fire", "Int", [meditate]);
const light = attr("light", "Int", [meditate]);
const dark = attr("dark", "Int", [meditate]);

const firebolt = skill("fire_bolt", [fire]);
const fireInt = attr("fire", "Int", [firebolt]);
const inferno = skill("inferno", [fireInt]);

const healQuick = skill("heal_quick", [light]);
const lightInt = attr("light", "Int", [healQuick]);
const holySpear = skill("holy_spear", [lightInt]);

const curse = skill("shadow_bolt", [dark]);
const darkInt = attr("dark", "Int", [curse]);
const curseStrong = skill("curse_strong", [darkInt]);

attr("int-fire-3", "Int", [inferno], { amount: 3, cost: 3 });
attr("int-light-3", "Int", [holySpear], { amount: 3, cost: 3 });
attr("int-end", "Int", [curseStrong], { amount: 3, cost: 3 });
// =====================================================================

export const SKILL_TREE_NODES: readonly TreeNode[] = nodes;

// Dev-only: catches typos and mistakes while you edit the tree above.
if (import.meta.env.DEV) {
  const ids = new Set<string>();

  for (const node of nodes) {
    if (ids.has(node.id)) {
      console.error(`Skill tree: duplicate node id "${node.id}"`);
    }

    ids.add(node.id);

    if (node.skillId && !getSkill(node.skillId)) {
      console.error(`Skill tree: unknown skill "${node.skillId}"`);
    }

    for (const required of node.requires) {
      if (required.branch !== node.branch) {
        console.error(
          `Skill tree: "${node.id}" is connected to another branch. Branches must stay separate.`,
        );
      }
    }
  }

  for (const { attribute } of SKILL_TREE_BRANCHES) {
    const roots = nodes.filter(
      (node) => node.branch === attribute && node.requires.length === 0,
    );

    if (roots.length !== 1) {
      console.error(
        `Skill tree: the ${attribute} branch should have exactly one root, found ${roots.length}`,
      );
    }
  }
}
