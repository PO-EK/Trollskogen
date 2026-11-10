import { usePlayer } from "../../context/usePlayer";
import { items } from "../../data/items";
import { getSkill } from "../../data/skills";
import type {
  ArmourItem,
  EquipmentSlot,
  WeaponItem,
  WeaponStat,
} from "../../data/itemTypes";
import type { Skill, SkillEffect } from "../../data/skillTypes";
import { getDamageRange } from "../../game/weaponDamage";
import { ATTRIBUTE_LABELS, CURE_LABELS } from "../../game/labels";
import "./ItemCard.css";

// Record<...> makes TypeScript complain if you add a new slot, stat or
// damage type later and forget its label.
const SLOT_LABELS: Record<EquipmentSlot, string> = {
  mainHand: "Huvudhand",
  offHand: "Andra handen",
  head: "Huvud",
  body: "Kropp",
  feet: "Fötter",
  hands: "Händer",
};

const STAT_LABELS: Record<WeaponStat, string> = {
  Str: "Styrka",
  Dex: "Smidighet",
  Con: "Fysik",
  Int: "Intelligens",
};

/* const DAMAGE_TYPE_LABELS: Record<DamageType, string> = {
  slashing: "Skärande",
  piercing: "Stickande",
  crushing: "Krossande",
  fire: "Eld",
}; */

const CATEGORY_LABELS = {
  general: "Föremål",
  weapon: "Vapen",
  armour: "Rustning",
} as const;

function describeUseEffect(effect: SkillEffect): string {
  switch (effect.type) {
    case "heal":
      return effect.percentOfMax
        ? `Läker ${effect.percentOfMax}% av max hälsa`
        : `Läker ${effect.amount ?? 0} hälsa`;
    case "restoreMana":
      return effect.percentOfMax
        ? `Återställer ${effect.percentOfMax}% av max magi`
        : `Återställer ${effect.amount ?? 0} magi`;
    case "cure":
      return `Botar ${effect.statuses.map((status) => CURE_LABELS[status]).join(", ")}`;
    case "buff":
      return `${effect.amount > 0 ? "+" : ""}${effect.amount} ${ATTRIBUTE_LABELS[effect.stat]} i ${effect.turns} rundor`;
    case "lifesteal":
      return `Läker ${effect.percentOfDamage}% av skadan som hälsa`;
    case "manaLeech":
      return `Återställer ${effect.percentOfDamage}% av skadan som magi`;
    case "damageMod":
      return `${effect.percent > 0 ? "+" : ""}${effect.percent}% skada i ${effect.turns} rundor`;
    case "weak":
      return `${effect.percent}% mindre skada i ${effect.turns} rundor`;
    case "guard":
      return `Tar ${effect.percent}% mindre skada i ${effect.turns} rundor`;
    case "offguard":
      return `Tar ${effect.percent}% mer skada i ${effect.turns} rundor`;
    case "evade":
      return `${Math.round(effect.chance)}% chans att undvika attacker i ${effect.turns} rundor`;
    case "burn":
      return `Brand: ${effect.damage} skada per runda`;
    case "bleed":
      return `Blödning: ${effect.damage} skada per runda`;
    case "healOverTime":
      return `Läker ${effect.amount} hälsa per runda`;
    case "stun":
      return `Bedövar i ${effect.turns} rundor`;
  }
}

/* function getSkillMeta(skill: Skill): string {
  const parts: string[] = [];

  if (skill.damage?.kind === "weapon") {
    parts.push(`×${skill.damage.multiplier}`);
  }

  if (skill.damageType) {
    parts.push(DAMAGE_TYPE_LABELS[skill.damageType]);
  }

  if (skill.cooldown) {
    parts.push(`Cooldown ${skill.cooldown}`);
  }

  return parts.join(" · ");
} */

function WeaponDetails({ weapon }: { weapon: WeaponItem }) {
  const { player } = usePlayer();

  // The range with the player's stats applied, same as combat will use.
  const range = getDamageRange(player, weapon);

  const weaponSkills = weapon.skills
    .map(getSkill)
    .filter((skill): skill is Skill => skill !== undefined);

  return (
    <>
      <div className="item-card-row">
        <span className="item-card-label">Skada</span>
        <span className="item-card-value item-card-value--big">
          {range.min}–{range.max}
        </span>
      </div>
      <p className="item-card-subline">
        Skada ökar med {STAT_LABELS[weapon.stat]}
      </p>

      <h4 className="item-card-section-title">Attacker</h4>
      <ul className="item-card-skills">
        {weaponSkills.map((skill) => (
          <li
            key={skill.id}
            className="item-card-skill"
            data-type={skill.damageType}
            title={skill.description}
          >
            <span className="item-card-skill-name">{skill.name}</span>
            {/* <span className="item-card-skill-meta">{getSkillMeta(skill)}</span> */}
          </li>
        ))}
      </ul>
    </>
  );
}

function ArmourDetails({ armour }: { armour: ArmourItem }) {
  const bonuses = (["Str", "Dex", "Con", "Int"] as const).flatMap(
    (attribute) => {
      const amount = armour.attributeBonuses?.[attribute];

      return amount === undefined ? [] : [{ attribute, amount }];
    },
  );

  return (
    <>
      <div className="item-card-row">
        <span className="item-card-label">Försvar</span>
        <span className="item-card-value item-card-value--big">
          {armour.defense}
        </span>
      </div>
      {bonuses.map(({ attribute, amount }) => (
        <div className="item-card-row" key={attribute}>
          <span className="item-card-label">{STAT_LABELS[attribute]}</span>
          <span className="item-card-value item-card-value--big">
            {amount > 0 ? "+" : ""}
            {amount}
          </span>
        </div>
      ))}
    </>
  );
}

type ItemCardProps = {
  itemId: string | null;
  salePrice?: number;
};

function ItemCard({ itemId, salePrice }: ItemCardProps) {
  const item = itemId ? items.find((item) => item.id === itemId) : undefined;

  if (!item) {
    return (
      <div className="item-card" data-empty="true">
        <p className="item-card-placeholder"></p>
      </div>
    );
  }

  const category = item.category ?? "general";
  const itemUse =
    item.category === "weapon" || item.category === "armour"
      ? undefined
      : item.use;
  return (
    // The key restarts the fade-in animation whenever the item changes.
    <div className="item-card" key={item.id} data-category={category}>
      <div className="item-card-header">
        <h3 className="item-card-name">{item.name}</h3>
        <span className="item-card-tag">{CATEGORY_LABELS[category]}</span>
      </div>

      {(item.category === "weapon" || item.category === "armour") && (
        <p className="item-card-slot">{SLOT_LABELS[item.slot]}</p>
      )}

      <p className="item-card-description">{item.description}</p>
      <div className="item-card-divider" />

      {itemUse && (
        <section className="item-card-use" aria-label="Användning">
          <div className="item-card-use-status">Kan användas</div>
          <ul className="item-card-use-effects">
            {itemUse.effects.map((effect, index) => (
              <li key={`${effect.type}-${index}`}>
                {describeUseEffect(effect)}
              </li>
            ))}
          </ul>
        </section>
      )}

      {item.category === "weapon" && <WeaponDetails weapon={item} />}
      {item.category === "armour" && <ArmourDetails armour={item} />}

      <div className="item-card-price">
        <div className="item-card-price-row">
          <span className="item-card-label">Värde:</span>
          <span className="item-card-value">{item.baseValue} 🪙 Kronor</span>
        </div>
        {salePrice !== undefined && (
          <div className="item-card-price-row">
            <span className="item-card-pricelabel">Pris:</span>
            <span className="item-card-price"> {salePrice} 🪙 Kronor</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default ItemCard;
