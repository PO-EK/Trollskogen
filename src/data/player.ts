export type StoryFlags = Record<string, boolean>;
import type { ContainerItem } from "./containerItems";
import type { EquipmentSlot } from "./itemTypes";
import {
  BASELINE_STAT,
  HP_BONUS_PER_CON_POINT,
  HP_PER_CON_POINT,
} from "../game/balance";
export function getMaxHP(player: Player): number {
  const flat = HP_PER_CON_POINT * player.Con;
  const multiplier = Math.max(
    0,
    1 + HP_BONUS_PER_CON_POINT * (player.Con - BASELINE_STAT),
  );

  return Math.max(1, Math.ceil(flat * multiplier));
}

export type Player = {
  Id?: string;

  Name: string;

  // Pengar
  Gold: number;

  // Level / Erfarenhet
  Level: number;
  Exp: number;
  ExpMax: number;

  // stats
  Str: number;
  Dex: number;
  Con: number;
  Int: number;

  // HP
  HP: number;
  HPMax: number;
  // Mana
  Mana: number;
  ManaMax: number;
  Equipment: Partial<Record<EquipmentSlot, ContainerItem>>;
  EquippedSkills: (string | null)[]; // was string[]

  // Inventory
  BackpackWidth: number;
  BackpackHeight: number;
  Inventory: ContainerItem[];

  StorageWidth: number;
  StorageHeight: number;
  Storage: ContainerItem[];

  // Quest progression
  Quests: QuestState[];
  StoryFlags: Record<string, boolean>;
  UnlockedLocations: string[];
  // In the Player type:
  KnownSkills: string[]; // spells/skills the player has learned
};

export type QuestState = {
  questId: string;
  completed: boolean;
};
const maxHP = getMaxHP({ Con: 15 } as Player);
export const createNewPlayer = (): Player => ({
  Name: "Admin",

  Gold: 360,

  Level: 1,
  Exp: 54,
  ExpMax: 100,

  Str: 12,
  Dex: 10,
  Con: 15,
  Int: 22,

  HP: maxHP,

  HPMax: maxHP,
  Mana: 50,
  ManaMax: 50,
  Equipment: {},
  BackpackWidth: 5,
  BackpackHeight: 4,

  StorageWidth: 7,
  StorageHeight: 7,
  Storage: [
    {
      containerItemId: "startItem1",
      itemId: "cloth",
      x: 0,
      y: 0,
    },
    {
      containerItemId: "startItem2",
      itemId: "woodlog",
      x: 3,
      y: 0,
    },
    {
      containerItemId: "startItem3",
      itemId: "leather",
      x: 0,
      y: 4,
    },
  ],

  EquippedSkills: ["flamethrower", "cutting_wind"],
  Inventory: [
    { containerItemId: "testPotion", itemId: "health_potion", x: 0, y: 0 },
    { containerItemId: "testMana", itemId: "mana_potion", x: 1, y: 0 },
    { containerItemId: "testBandage", itemId: "bandage", x: 0, y: 2 },
    { containerItemId: "startingWeapon", itemId: "iron_spear", x: 4, y: 0 },
  ],
  Quests: [],
  StoryFlags: {},
  UnlockedLocations: [
    "intro",
    "playerHQ",
    "village",
    "ruins",
    "places",
    "blacksmith",
  ],
  KnownSkills: [
    "firebolt",
    "tackle",
    "warcry",
    "guard",
    "speed",
    "heal_quick",
    "meditate",
    "flamethrower",
    "curse_weak",
    "magic_missle",
    "cutting_wind",
  ],
});
