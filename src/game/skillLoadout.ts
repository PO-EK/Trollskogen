import { items } from "../data/items";
import type { EquipmentSlot, GameItem } from "../data/itemTypes";
import type { Player } from "../data/player";
import type { Skill, SkillGroup } from "../data/skillTypes";
import { getSkill } from "../data/skills";
import { getEquippedWeapon } from "./characterStats";
import { SLOT_LABELS } from "./equipment";

export const SKILL_SLOT_COUNT = 4;

export type SkillSlots = (string | null)[];
export type GrantedSkill = { skill: Skill; sourceName: string };

export function getSkillGroup(skill: Skill): SkillGroup {
  if (skill.damage?.kind === "weapon") {
    return "weapon";
  }

  if (skill.damage?.kind === "spell") {
    return "spell";
  }

  return "support";
}

function getItemSkillIds(definition: GameItem): string[] {
  if (definition.category === "weapon") {
    return definition.skills;
  }

  if (definition.category === "armour") {
    return definition.skills ?? [];
  }

  return [];
}

// Row 1: skills from everything equipped, in slot order, without duplicates.
// With no weapon in the main hand you get the unarmed "punch".
export function getGrantedSkills(player: Player): GrantedSkill[] {
  const result: GrantedSkill[] = [];
  const seen = new Set<string>();

  function add(skillId: string, sourceName: string) {
    const skill = getSkill(skillId);

    if (!skill || seen.has(skillId)) {
      return;
    }

    seen.add(skillId);
    result.push({ skill, sourceName });
  }

  const slotOrder = Object.keys(SLOT_LABELS) as EquipmentSlot[];

  for (const slot of slotOrder) {
    const equipped = player.Equipment[slot];

    if (!equipped) {
      continue;
    }

    const definition = items.find((item) => item.id === equipped.itemId);

    if (!definition) {
      continue;
    }

    for (const skillId of getItemSkillIds(definition)) {
      add(skillId, definition.name);
    }
  }

  if (!getEquippedWeapon(player)) {
    add("punch", "Nävar");
  }

  return result;
}

// Row 2: always exactly SKILL_SLOT_COUNT entries. Old saves and unknown
// skills are padded or blanked out here.
export function getSkillSlots(player: Player): SkillSlots {
  return Array.from({ length: SKILL_SLOT_COUNT }, (_, index) => {
    const skillId = player.EquippedSkills[index];

    return skillId && player.KnownSkills.includes(skillId) ? skillId : null;
  });
}

export function canSlotSkill(player: Player, skillId: string): boolean {
  return (
    player.KnownSkills.includes(skillId) &&
    !getGrantedSkills(player).some((granted) => granted.skill.id === skillId)
  );
}

export function firstEmptySlot(slots: SkillSlots): number | null {
  const index = slots.indexOf(null);

  return index === -1 ? null : index;
}

// A skill can only sit in one slot: placing it somewhere else moves it.
export function placeSkill(
  slots: SkillSlots,
  skillId: string,
  index: number,
): SkillSlots {
  const next = slots.map((id) => (id === skillId ? null : id));
  next[index] = skillId;

  return next;
}

export function swapSlots(slots: SkillSlots, a: number, b: number): SkillSlots {
  const next = [...slots];
  [next[a], next[b]] = [next[b], next[a]];

  return next;
}

export function clearSlot(slots: SkillSlots, index: number): SkillSlots {
  const next = [...slots];
  next[index] = null;

  return next;
}

// The two rows combat will show.
export function getBattleSkills(player: Player): {
  granted: Skill[];
  chosen: (Skill | null)[];
} {
  const granted = getGrantedSkills(player).map((entry) => entry.skill);
  const grantedIds = new Set(granted.map((skill) => skill.id));

  return {
    granted,
    // A slotted skill that equipment now grants too is not shown twice.
    chosen: getSkillSlots(player).map((id) =>
      id && !grantedIds.has(id) ? (getSkill(id) ?? null) : null,
    ),
  };
}
