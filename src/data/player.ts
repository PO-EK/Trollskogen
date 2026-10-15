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

  // Mana
  Mana: number;
  ManaMax: number;
  Equipment: Partial<Record<EquipmentSlot, ContainerItem>>;
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
  EquippedSkills: string[]; // chosen for the free slots, in order
};

export type QuestState = {
  questId: string;
  completed: boolean;
};
const maxHP = getMaxHP({ Con: 15 } as Player);
export const createNewPlayer = (): Player => ({
  Name: "Admin",

  Gold: 1280,

  Level: 1,
  Exp: 54,
  ExpMax: 100,

  Str: 22,
  Dex: 17,
  Con: 15,
  Int: 10,

  HP: maxHP,

  Mana: 50,
  ManaMax: 50,
  Equipment: {},
  BackpackWidth: 6,
  BackpackHeight: 6,

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

  Inventory: [
    {
      containerItemId: "yxa1",
      itemId: "battle_axe",
      x: 0,
      y: 0,
    },
  ],
  Quests: [],
  StoryFlags: {},
  UnlockedLocations: ["intro", "playerHQ", "village", "ruins", "blacksmith"],
  KnownSkills: [],
  EquippedSkills: [],
});
