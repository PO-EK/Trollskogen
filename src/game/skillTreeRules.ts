import type { Player } from "../data/player";
import type { TreeNode } from "../data/skillTree";
import { applyAttributeBonuses } from "./characterStats";
import { ATTRIBUTE_LABELS } from "./labels";

export type NodeState = "learned" | "available" | "locked";

export function isLearned(player: Player, node: TreeNode): boolean {
  return player.LearnedNodes.includes(node.id);
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

// "+1 Styrka, +1 Fysik", for showing what a node gives.
export function describeBonuses(node: TreeNode): string {
  return (node.bonuses ?? [])
    .map(
      (bonus) =>
        `${bonus.amount > 0 ? "+" : ""}${bonus.amount} ${ATTRIBUTE_LABELS[bonus.attribute]}`,
    )
    .join(", ");
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

  if (node.skillId && !next.KnownSkills.includes(node.skillId)) {
    next.KnownSkills = [...next.KnownSkills, node.skillId];
  }

  const bonuses =
    node.bonuses ??
    (node.attribute
      ? [{ attribute: node.attribute, amount: node.attributeAmount ?? 1 }]
      : []);

  if (bonuses.length > 0) {
    return applyAttributeBonuses(next, bonuses);
  }

  return next;
}
