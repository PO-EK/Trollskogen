import type { EnemyId, LootDrop } from "../data/enemy";

// What a startCombat effect describes.
export type CombatEncounter = {
  enemyId: EnemyId;
  extraLoot?: LootDrop[]; // drops for this fight only, e.g. a quest item
  winNodeId: string;
  loseNodeId: string;
  fleeNodeId?: string; // if missing, you stay on the node you started from
};

export type CombatOutcome = "win" | "lose" | "flee";

// What the fight hands back to the story.
export type CombatResult = {
  outcome: CombatOutcome;
  hp: number; // what the player has left
  mana: number;
  exp: number; // only set on a win
  gold: number;
  loot: string[]; // item ids that dropped (rolled once, on a win)
};
