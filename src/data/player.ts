export type StoryFlags = Record<string, boolean>;
import type { ContainerItem } from "./containerItems";
import type { EquipmentSlot } from "./itemTypes";
import {
  BASELINE_STAT,
  HP_BONUS_PER_CON_POINT,
  HP_PER_CON_POINT,
  MANA_PER_INT_POINT,
  MANA_BONUS_PER_INT_POINT,
  getDodgeChance,
} from "../game/balance";
import { addItemToInventory } from "../game/inventory";
import { equippedItem } from "../game/equipment";

export function getMaxHP(con: number): number {
  const flat = HP_PER_CON_POINT * con;
  const excess = Math.max(0, con - BASELINE_STAT);

  return Math.max(1, Math.ceil(flat + HP_BONUS_PER_CON_POINT * excess ** 2));
}
export function getMaxMana(int: number): number {
  const flat = MANA_PER_INT_POINT * int;
  const excess = Math.max(0, int - BASELINE_STAT);

  return Math.max(1, Math.ceil(flat + MANA_BONUS_PER_INT_POINT * excess ** 2));
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
  DodgeChance: number;
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
    Exp: 4,
    ExpMax: 50,
    SkillPoints: 1,
    LearnedNodes: [],

    Str: playerStr,
    Dex: playerDex,
    DodgeChance: getDodgeChance(playerDex),
    Con: playerCon,
    Int: playerInt,

    HP: maxHP,
    HPMax: maxHP,

    Mana: maxMana,
    ManaMax: maxMana,

    Equipment: {},
    BackpackWidth: 6,
    BackpackHeight: 6,

    StorageWidth: 7,
    StorageHeight: 7,
    Storage: [],

    EquippedSkills: [],
    Inventory: [],
    Quests: [],
    StoryFlags: {},
    UnlockedLocations: [
      "playerHQ",
      "village",
      "mayors",
      "vardshuset",
      "blacksmith",
      "ruins",
      "places",
    ],
    KnownSkills: [],
  };

  player = addItemToInventory(player, "bandage", "startBandage");
  player = addItemToInventory(player, "storageKey", "playerKey");
  player = equippedItem(player, "iron_sword", "starterSword");

  return player;
};
