import { useState } from "react";
import { usePlayer } from "../context/usePlayer";
import SkillCard from "../components/skills/SkillCard";
import { SKILL_TREE_BRANCHES, SKILL_TREE_NODES } from "../data/skillTree";
import type { AttributeName, TreeNode } from "../data/skillTree";
import { getSkill } from "../data/skills";
import { ATTRIBUTE_LABELS } from "../game/labels";
import { getSkillGroup } from "../game/skillLoadout";
import { getBranchLayout } from "../game/skillTreeLayout";
import {
  /* canLearn, */
  getNodeState,
  isLearned,
  learnNode,
} from "../game/skillTreeRules";
import "./SkillTree.css";

function getIcon(attribute: AttributeName): string {
  return SKILL_TREE_BRANCHES.find((b) => b.attribute === attribute)?.icon ?? "";
}

function getNodeLabel(node: TreeNode): string {
  if (node.skillId) {
    return getSkill(node.skillId)?.name ?? node.skillId;
  }

  return node.attribute ? `+1 ${ATTRIBUTE_LABELS[node.attribute]}` : node.id;
}

type SkillTreeProps = {
  onClose: () => void;
};

function SkillTree({ onClose }: SkillTreeProps) {
  const { player, setPlayer } = usePlayer();
  const [branch, setBranch] = useState<AttributeName>("Str");
  const [selected, setSelected] = useState<TreeNode | null>(null);

  const layout = getBranchLayout(branch);
  const placed = new Map(layout.nodes.map((entry) => [entry.node, entry]));

  const edges = layout.nodes.flatMap((child) =>
    child.node.requires.flatMap((required) => {
      const parent = placed.get(required);

      return parent ? [{ parent, child }] : [];
    }),
  );

  function handleLearn(node: TreeNode) {
    // Checked again on the latest state, so a double click can't spend twice.
    setPlayer((p) => learnNode(p, node));
  }

  function renderDetails(node: TreeNode) {
    const state = getNodeState(player, node);
    const affordable = player.SkillPoints >= node.cost;
    const skill = node.skillId ? getSkill(node.skillId) : undefined;

    const action =
      state === "available" ? (
        <button
          className="skills-button"
          disabled={!affordable}
          onClick={() => handleLearn(node)}
        >
          Lär dig ({node.cost} p)
        </button>
      ) : undefined;

    let note: string | null = null;

    if (state === "learned") {
      note = node.skillId
        ? "Du kan utrusta den under Färdigheter."
        : "Redan tagen.";
    } else if (state === "locked") {
      note = `Kräver någon av: ${node.requires.map(getNodeLabel).join(", ")}`;
    } else if (!affordable) {
      note = `Du behöver ${node.cost} färdighetspoäng (du har ${player.SkillPoints}).`;
    }

    return (
      <>
        {skill ? (
          <SkillCard skill={skill} action={action} />
        ) : node.attribute ? (
          <div className="item-card skill-card">
            <div className="item-card-header">
              <h3 className="item-card-name">{getNodeLabel(node)}</h3>
              {action && <div className="skill-card-action">{action}</div>}
            </div>
            <div className="item-card-divider" />
            <div className="item-card-row">
              <span className="item-card-label">
                {ATTRIBUTE_LABELS[node.attribute]}
              </span>
              <span className="item-card-value">
                {player[node.attribute]}
                {state === "learned" ? "" : ` → ${player[node.attribute] + 1}`}
              </span>
            </div>
            <div className="item-card-row">
              <span className="item-card-label">Kostnad</span>
              <span className="item-card-value">{node.cost} p</span>
            </div>
          </div>
        ) : null}

        {note && <p className="skilltree-note">{note}</p>}
      </>
    );
  }

  return (
    <div className="skilltree-page">
      <div className="skilltree-header">
        <h1>Färdighetsträd</h1>
        <span className="skilltree-points">
          Färdighetspoäng: <strong>{player.SkillPoints}</strong>
        </span>
        <button className="skills-close" onClick={onClose}>
          Tillbaka
        </button>
      </div>

      <div className="tree-tabs">
        {SKILL_TREE_BRANCHES.map((entry) => {
          const nodes = SKILL_TREE_NODES.filter(
            (node) => node.branch === entry.attribute,
          );
          const learned = nodes.filter((node) =>
            isLearned(player, node),
          ).length;

          return (
            <button
              key={entry.attribute}
              className="tree-tab"
              data-active={branch === entry.attribute}
              onClick={() => {
                setBranch(entry.attribute);
                setSelected(null);
              }}
            >
              <span>
                {entry.icon} {ATTRIBUTE_LABELS[entry.attribute]}
              </span>
              <span className="tree-tab-value">{player[entry.attribute]}</span>
              <span className="tree-tab-count">
                {learned}/{nodes.length}
              </span>
            </button>
          );
        })}
      </div>

      <div className="skilltree-body">
        <div className="skilltree-scroll">
          <div
            className="tree-canvas"
            style={{ width: layout.width, height: layout.height }}
          >
            <svg
              className="tree-lines"
              width={layout.width}
              height={layout.height}
            >
              {edges.map(({ parent, child }) => {
                const x1 = parent.cx;
                const y1 = parent.cy + parent.height / 2;
                const x2 = child.cx;
                const y2 = child.cy - child.height / 2;
                const midY = (y1 + y2) / 2;

                return (
                  <path
                    key={`${parent.node.id}>${child.node.id}`}
                    className="tree-line"
                    data-open={isLearned(player, parent.node)}
                    d={`M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`}
                  />
                );
              })}
            </svg>

            {layout.nodes.map(({ node, cx, cy, width, height }) => {
              const state = getNodeState(player, node);
              const skill = node.skillId ? getSkill(node.skillId) : undefined;

              return (
                <button
                  key={node.id}
                  className="tree-node"
                  data-kind={node.kind}
                  data-state={state}
                  data-group={skill ? getSkillGroup(skill) : undefined}
                  data-attribute={node.attribute}
                  data-selected={selected?.id === node.id}
                  data-affordable={player.SkillPoints >= node.cost}
                  style={{
                    left: cx - width / 2,
                    top: cy - height / 2,
                    width,
                    height,
                  }}
                  title={`${getNodeLabel(node)} (${node.cost} p)`}
                  onClick={() => setSelected(node)}
                >
                  {node.attribute && node.kind === "attribute" ? (
                    <>
                      <span className="tree-attr-icon">
                        {getIcon(node.attribute)}
                      </span>
                      <span className="tree-attr-plus">+1</span>
                    </>
                  ) : (
                    <>
                      <span className="tree-node-name">
                        {getNodeLabel(node)}
                      </span>
                      <span className="tree-node-cost">
                        {state === "learned" ? "✓ Känd" : `${node.cost} p`}
                      </span>
                    </>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <aside className="skilltree-details">
          {selected ? (
            renderDetails(selected)
          ) : (
            <p className="skilltree-note">Välj en nod i trädet.</p>
          )}
        </aside>
      </div>
    </div>
  );
}

export default SkillTree;
