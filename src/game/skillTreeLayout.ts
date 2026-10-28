import { SKILL_TREE_NODES } from "../data/skillTree";
import type { TreeNode } from "../data/skillTree";

// Pixel sizes of the two node shapes.
export const NODE_SIZE = {
  attribute: { width: 46, height: 46 },
  attributeLarge: { width: 64, height: 64 },
  skill: { width: 122, height: 54 },
};

const SLOT_WIDTH = 140; // horizontal space for one node
const ROW_HEIGHT = 92; // vertical space for one level
const PADDING = 24;

export type PlacedNode = {
  node: TreeNode;
  cx: number; // center
  cy: number;
  width: number;
  height: number;
};

export type BranchLayout = {
  nodes: PlacedNode[];
  width: number;
  height: number;
};

const mean = (values: number[]) =>
  values.reduce((sum, value) => sum + value, 0) / values.length;

function layoutBranch(nodes: TreeNode[]): BranchLayout {
  if (nodes.length === 0) {
    return { nodes: [], width: 0, height: 0 };
  }

  // Depth = steps from the root. Nodes are always written after their
  // requirements, so one pass is enough.
  const depths = new Map<TreeNode, number>();

  for (const node of nodes) {
    depths.set(
      node,
      node.requires.length === 0
        ? 0
        : 1 + Math.max(...node.requires.map((r) => depths.get(r) ?? 0)),
    );
  }

  const rows: TreeNode[][] = [];

  for (const node of nodes) {
    const depth = depths.get(node) ?? 0;
    rows[depth] = rows[depth] ?? [];
    rows[depth].push(node);
  }

  // Horizontal position per row, in slots.
  const xs = new Map<TreeNode, number>();

  for (const row of rows) {
    const desired = row.map((node, index) =>
      node.requires.length === 0
        ? index
        : mean(node.requires.map((required) => xs.get(required) ?? 0)),
    );

    const placed: number[] = [];

    desired.forEach((x) => {
      const previous = placed[placed.length - 1];
      placed.push(previous === undefined ? x : Math.max(x, previous + 1));
    });

    const shift = mean(desired) - mean(placed);

    row.forEach((node, index) => xs.set(node, (placed[index] ?? 0) + shift));
  }

  const allX = [...xs.values()];
  const minX = Math.min(...allX);
  const maxX = Math.max(...allX);
  const rowBox = Math.max(
    ...nodes.map(
      (node) =>
        (node.kind === "attribute" && (node.attributeAmount ?? 1) > 1
          ? NODE_SIZE.attributeLarge
          : NODE_SIZE[node.kind]
        ).height,
    ),
  );

  return {
    nodes: nodes.map((node) => {
      const size =
        node.kind === "attribute" && (node.attributeAmount ?? 1) > 1
          ? NODE_SIZE.attributeLarge
          : NODE_SIZE[node.kind];

      return {
        node,
        cx:
          PADDING + ((xs.get(node) ?? 0) - minX) * SLOT_WIDTH + SLOT_WIDTH / 2,
        cy: PADDING + (depths.get(node) ?? 0) * ROW_HEIGHT + rowBox / 2,
        width: size.width,
        height: size.height,
      };
    }),
    width: PADDING * 2 + (maxX - minX + 1) * SLOT_WIDTH,
    height: PADDING * 2 + (rows.length - 1) * ROW_HEIGHT + rowBox,
  };
}

const cache = new Map<string, BranchLayout>();

export function getBranchLayout(treeId: string): BranchLayout {
  let layout = cache.get(treeId);

  if (!layout) {
    layout = layoutBranch(
      SKILL_TREE_NODES.filter((node) => node.treeId === treeId),
    );
    cache.set(treeId, layout);
  }

  return layout;
}

export function getCombinedBranchLayout(treeIds: string[]): BranchLayout {
  const gap = SLOT_WIDTH;
  const nodes: PlacedNode[] = [];
  let width = 0;
  let height = 0;

  for (const treeId of treeIds) {
    const layout = getBranchLayout(treeId);

    nodes.push(
      ...layout.nodes.map((entry) => ({
        ...entry,
        cx: entry.cx + width,
      })),
    );
    width += layout.width + gap;
    height = Math.max(height, layout.height);
  }

  return {
    nodes,
    width: Math.max(0, width - gap),
    height,
  };
}
