import type { ReactNode } from "react";
import { usePlayer } from "../../context/usePlayer";
import type { Skill, SkillEffect } from "../../data/skillTypes";
import { getSkillDamageRange } from "../../game/battleSkills";
import { getEquippedWeapon } from "../../game/characterStats";
import { ATTRIBUTE_LABELS, DAMAGE_TYPE_LABELS } from "../../game/labels";
import { getSkillGroup } from "../../game/skillLoadout";
import "../inventory/ItemCard.css";
import "./SkillCard.css";

function describeEffect(effect: SkillEffect): string {
  switch (effect.type) {
    case "buff":
      return `+${effect.amount} ${ATTRIBUTE_LABELS[effect.stat]} i ${effect.turns} rundor`;
    case "heal":
      return `Läker ${effect.amount} hälsa`;
    case "status":
      return `${effect.stat} i ${effect.turns} rundor`;
  }
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="item-card-row">
      <span className="item-card-label">{label}</span>
      <span className="item-card-value">{value}</span>
    </div>
  );
}

type SkillCardProps = {
  skill: Skill;
  source?: string; // e.g. the name of the item that grants it
  action?: ReactNode; // shown top right, next to the name (the Utrusta button)
  compact?: boolean; // smaller text and tighter spacing
  // Shows the damage range with the current weapon and stats applied.
  // Off by default, since it depends on what you have equipped.
  showDamage?: boolean;
};

function SkillCard({
  skill,
  source,
  action,
  compact = false,
  showDamage = false,
}: SkillCardProps) {
  const { player } = usePlayer();
  const damage = skill.damage;

  const range = showDamage
    ? getSkillDamageRange(player, skill, getEquippedWeapon(player))
    : null;

  return (
    <div
      className={`item-card skill-card${compact ? " skill-card--compact" : ""}`}
      data-group={getSkillGroup(skill)}
    >
      <div className="item-card-header">
        <h3 className="item-card-name">{skill.name}</h3>
        {action && <div className="skill-card-action">{action}</div>}
      </div>

      <div className="item-card-divider" />

      {source && <Row label="Från" value={source} />}

      <Row
        label="Mål"
        value={skill.target === "enemy" ? "Fienden" : "Dig själv"}
      />
      {range && (
        <div className="item-card-row">
          <span className="item-card-label">Din skada</span>
          <span className="item-card-value item-card-value--big">
            {range.min}–{range.max}
          </span>
        </div>
      )}

      {damage?.kind === "weapon" && (
        <Row label="Skada" value={`×${damage.multiplier} av vapnet`} />
      )}
      {damage?.kind === "spell" && (
        <Row label="Skada" value={`${damage.min}–${damage.max}`} />
      )}

      {skill.damageType && (
        <Row label="Typ" value={DAMAGE_TYPE_LABELS[skill.damageType]} />
      )}

      <Row
        label="Kostnad"
        value={skill.manaCost ? `${skill.manaCost} magi` : "Gratis"}
      />
      {skill.cooldown ? (
        <Row label="Väntetid" value={`${skill.cooldown} rundor`} />
      ) : null}
      {skill.effects?.map((effect, index) => (
        <Row key={index} label="Effekt" value={describeEffect(effect)} />
      ))}

      <p className="item-card-description">{skill.description}</p>
    </div>
  );
}

export default SkillCard;
