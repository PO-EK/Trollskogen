import { usePlayer } from "../../context/usePlayer";
import { items } from "../../data/items";
import { getSkill } from "../../data/skills";
import type {
  ArmourItem,
  EquipmentSlot,
  WeaponItem,
  WeaponStat,
} from "../../data/itemTypes";
import type { Skill } from "../../data/skillTypes";
import { getDamageRange } from "../../game/weaponDamage";
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
  return (
    <div className="item-card-row">
      <span className="item-card-label">Försvar</span>
      <span className="item-card-value item-card-value--big">
        {armour.defense}
      </span>
    </div>
  );
}

type ItemCardProps = {
  itemId: string | null;
  // Overrides the default "Värt X Kronor" line, e.g. a trader's asking price.
  price?: { label: string; amount: number };
};

function ItemCard({ itemId, price }: ItemCardProps) {
  const item = itemId ? items.find((item) => item.id === itemId) : undefined;

  if (!item) {
    return (
      <div className="item-card" data-empty="true">
        <p className="item-card-placeholder"></p>
      </div>
    );
  }

  const category = item.category ?? "general";
  const priceLine = price ?? { label: "Värt", amount: item.baseValue };

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

      {item.category === "weapon" && <WeaponDetails weapon={item} />}
      {item.category === "armour" && <ArmourDetails armour={item} />}

      <div className="item-card-price">
        <span className="item-card-label">{priceLine.label}</span>
        <span className="item-card-value">🪙 {priceLine.amount} Kronor</span>
      </div>
    </div>
  );
}

export default ItemCard;
