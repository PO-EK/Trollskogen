import type { DamageType, Skill, SkillGroup } from "../data/skillTypes";
import type { StatusKind } from "../data/skillTypes";

// Used after "botar" / "botade": "Botar branden"
export const CURE_LABELS: Record<StatusKind, string> = {
  burn: "branden",
  bleed: "blödningen",
  stun: "bedövningen",
  guard: "skyddet",
  evade: "undvikandet",
  damageMod: "försvagningen",
  stat: "effekten",
  weak: "försvagningen",
  offguard: "obalansen",
};

export const ATTRIBUTE_LABELS: Record<"Str" | "Dex" | "Con" | "Int", string> = {
  Str: "Styrka",
  Dex: "Smidighet",
  Con: "Fysik",
  Int: "Intelligens",
};

export const DAMAGE_TYPE_LABELS: Record<DamageType, string> = {
  slashing: "Huggande",
  piercing: "Stickande",
  crushing: "Krossande",
  fire: "Eld",
  dark: "Mörk",
  light: "Helig",
};

export const GROUP_LABELS: Record<SkillGroup, string> = {
  weapon: "Vapen",
  spell: "Magi",
  support: "Stöd",
};

// One-line summary, e.g. "×1.5 · Huggande · Väntetid 2".
export function getSkillSummary(skill: Skill): string {
  const parts: string[] = [];

  /* if (skill.damage?.kind === "weapon") {
    parts.push(`×${skill.damage.multiplier}`);
  } */

  if (skill.damageType) {
    parts.push(DAMAGE_TYPE_LABELS[skill.damageType]);
  }

  if (skill.manaCost) {
    parts.push(`${skill.manaCost} magi`);
  }

  if (skill.cooldown) {
    parts.push(`Väntetid ${skill.cooldown}`);
  }

  return parts.join(" · ");
}
