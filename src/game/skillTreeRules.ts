import type { Player } from "../data/player";
import type { TreeNode } from "../data/skillTree";
import { recalculatePlayerStats } from "./characterStats";

export type NodeState = "learned" | "available" | "locked";

// A skill learned some other way (the story) also counts as taken.
export function isLearned(player: Player, node: TreeNode): boolean {
  return (
    player.LearnedNodes.includes(node.id) ||
    (node.skillId !== undefined && player.KnownSkills.includes(node.skillId))
  );
}

export function getNodeState(player: Player, node: TreeNode): NodeState {
  if (isLearned(player, node)) {
    return "learned";
  }

  const reachable =
    node.requires.length === 0 ||
    node.requires.some((required) => isLearned(player, required));

  return reachable ? "available" : "locked";
}

export function canLearn(player: Player, node: TreeNode): boolean {
  return (
    getNodeState(player, node) === "available" &&
    player.SkillPoints >= node.cost
  );
}

// Returns the player unchanged if the node can't be taken.
export function learnNode(player: Player, node: TreeNode): Player {
  if (!canLearn(player, node)) {
    return player;
  }

  const next: Player = {
    ...player,
    SkillPoints: player.SkillPoints - node.cost,
    LearnedNodes: [...player.LearnedNodes, node.id],
  };

  if (node.attribute) {
    next[node.attribute] =
      next[node.attribute] + (node.attributeAmount ?? 1);
  }

  if (node.skillId && !next.KnownSkills.includes(node.skillId)) {
    next.KnownSkills = [...next.KnownSkills, node.skillId];
  }

  // Recalculate maximum HP and mana after learning the node.
  return recalculatePlayerStats(next);
}
