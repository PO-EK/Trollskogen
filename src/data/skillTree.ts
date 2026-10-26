import { getSkill } from "./skills";

export type AttributeName = "Str" | "Dex" | "Con" | "Int";

export type TreeNode = {
  id: string; // saved in the player's file: don't rename after players have saves
  kind: "attribute" | "skill";
  branch: AttributeName; // which of the four trees it sits in
  attribute?: AttributeName; // attribute nodes: what they give +1 in
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

type NodeOptions = { cost?: number };

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
    requires,
    cost: options.cost ?? DEFAULT_COST,
  };

  nodes.push(node);
  return node;
}

// A node that teaches a skill. It needs at least one requirement, and it
// joins the branch of the first one.
function skill(
  skillId: string,
  requires: [TreeNode, ...TreeNode[]],
  options: NodeOptions = {},
): TreeNode {
  const node: TreeNode = {
    id: skillId, // a skill can only appear once in the whole tree
    kind: "skill",
    branch: requires[0].branch,
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
//   skill("skill_id", [parent])         teaches a skill, after `parent`
//   skill("skill_id", [a, b])           needs a OR b first
//   skill("skill_id", [parent], { cost: 2 })
//
// A node can only follow nodes written ABOVE it. The order you write
// nodes in is their left-to-right order in a row.
// Nobody needs a name? Don't assign it: just call attr(...) / skill(...).
// =====================================================================

// ---- Styrka ----
const str1 = attr("str-1", "Str");
const warcry = skill("warcry", [str1]);
const str3 = attr("str-3", "Str", [warcry]);
const str4 = attr("str-4", "Str", [warcry]);
const tackle = skill("tackle", [str3]);
const kick = skill("kick", [str4]);
const str5 = attr("str-5", "Str", [tackle]);
const str6 = attr("str-6", "Str", [kick]);
const str7 = attr("str-7", "Str", [str5, str6]);
attr("str8", "Str", [str7]);

// ---- Smidighet ----
const dex1 = attr("dex-1", "Dex");
const speed = skill("speed", [dex1]);
const dex2 = attr("dex-2", "Dex", [speed]);
const dex3 = attr("dex-3", "Dex", [dex2]);
const rend = skill("rend", [dex3]);
const quickStep = skill("quick_step", [dex3]);
attr("dex-4", "Dex", [rend, quickStep]);

// ---- Fysik ----
const con1 = attr("con-1", "Con");
const firstAid = skill("iron_skin", [con1]);
const con2 = attr("con-2", "Con", [firstAid]);
const con3 = attr("con-3", "Con", [con2]);
const healLight = skill("heal_light", [con3]);
const ironSkin = skill("first_aid", [con3]);
const secondWind = skill("second_wind", [con3]);
attr("con-4", "Con", [healLight, ironSkin, secondWind]);

// ---- Intelligens ----
const int1 = attr("int-1", "Int");
const magicArrow = skill("magicArrow", [int1]);
const meditate = skill("meditate", [magicArrow]);
const light = attr("light", "Int", [meditate]);
const fire = attr("fire", "Int", [meditate]);
const dark = attr("dark", "Int", [meditate]);
const holySpear = skill("holy_spear", [light]);
const firebolt = skill("fire_bolt", [fire]);
const curse = skill("curse_weak", [dark]);
attr("int-end", "Int", [holySpear, firebolt, curse]);
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
