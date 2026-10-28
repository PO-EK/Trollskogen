export type StoryFlags = Record<string, boolean>;
import type { ContainerItem } from "./containerItems";
import type { EquipmentSlot } from "./itemTypes";
import {
  BASELINE_STAT,
  HP_BONUS_PER_CON_POINT,
  HP_PER_CON_POINT,
  MANA_PER_INT_POINT,
  MANA_BONUS_PER_INT_POINT,
} from "../game/balance";
import { addItemToInventory } from "../game/inventory";

export function getMaxHP(con: number): number {
  const flat = HP_PER_CON_POINT * con;
  const multiplier = Math.max(
    0,
    1 + HP_BONUS_PER_CON_POINT * (con - BASELINE_STAT),
  );

  return Math.max(1, Math.ceil(flat * multiplier));
}
export function getMaxMana(int: number): number {
  const flat = MANA_PER_INT_POINT * int;
  const multiplier = Math.max(
    0,
    1 + MANA_BONUS_PER_INT_POINT * (int - BASELINE_STAT),
  );

  return Math.max(1, Math.ceil(flat * multiplier));
}

const playerStr = 10;
const playerDex = 10;
const playerCon = 10;
const playerInt = 10;
const maxHP = getMaxHP(playerCon);
const maxMana = getMaxMana(playerInt);

export type Player = {
  Id?: string;

  Name: string;

  // Pengar
  Gold: number;

  // Level / Erfarenhet
  Level: number;
  Exp: number;
  ExpMax: number;
  SkillPoints: number;
  LearnedNodes: string[];
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

export const createNewPlayer = (): Player => {
  let player: Player = {
    Name: "Admin",

    Gold: 360,

    Level: 1,
    Exp: 0,
    ExpMax: 30,
    SkillPoints: 5,
    LearnedNodes: [],

    Str: playerStr,
    Dex: playerDex,
    Con: playerCon,
    Int: playerInt,

    HP: maxHP,
    HPMax: maxHP,

    Mana: maxMana,
    ManaMax: maxMana,

    Equipment: {},
    BackpackWidth: 6,
    BackpackHeight: 8,

    StorageWidth: 7,
    StorageHeight: 7,
    Storage: [],

    EquippedSkills: [],
    Inventory: [],
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
    KnownSkills: [],
  };

  player = addItemToInventory(player, "old_axe", "startingWeapon");
  player = addItemToInventory(player, "health_potion", "testPotion");
  player = addItemToInventory(player, "mana_potion", "testMana");
  player = addItemToInventory(player, "bandage", "testBandage");

  return player;
};
