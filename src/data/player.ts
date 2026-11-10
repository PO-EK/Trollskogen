export type StoryFlags = Record<string, boolean>;
import type { ContainerItem } from "./containerItems";
import { chests } from "./Chests";
import type { EquipmentSlot } from "./itemTypes";
import {
  BASELINE_STAT,
  HP_BONUS_PER_CON_POINT,
  HP_PER_CON_POINT,
  MANA_PER_INT_POINT,
  MANA_BONUS_PER_INT_POINT,
  getDodgeChance,
} from "../game/balance";
import { addItemToChest, addItemToInventory } from "../game/inventory";
import { equippedItem } from "../game/equipment";
import { locations } from "./locations";

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

export const DAILY_ACTION_POINTS = 8;

const playerStr = 10;
const playerDex = 10;
const playerCon = 10;
const playerInt = 10;
const maxHP = getMaxHP(playerCon);
const maxMana = getMaxMana(playerInt);

export type Player = {
  Id?: string;

  Name: string;
  day: number;
  ActionPoints: number;

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

  Chests: Record<string, ContainerItem[]>;

  // Quest progression
  Quests: QuestState[];
  StoryFlags: Record<string, boolean>;
  ScheduledStoryFlags: { flag: string; dueDay: number }[];
  UnlockedLocations: string[];
  LockedLocations: string[];
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
    day: 1,
    ActionPoints: DAILY_ACTION_POINTS,

    Gold: 0,

    Level: 1,
    Exp: 14,
    ExpMax: 50,
    SkillPoints: 3,
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

    Chests: Object.fromEntries(
      Object.entries(chests).map(([chestId]) => [chestId, []]),
    ),

    EquippedSkills: [],
    Inventory: [],
    Quests: [],
    StoryFlags: {},
    ScheduledStoryFlags: [],
    UnlockedLocations: locations
      .filter((location) => location.initialState === "unlocked")
      .map((location) => location.id),
    LockedLocations: locations
      .filter((location) => location.initialState === "locked")
      .map((location) => location.id),
    KnownSkills: ["godRay"],
  };

  player = addItemToInventory(player, "bandage", "startBandage");
  player = addItemToInventory(player, "storageKey", "playerKey");
  player = equippedItem(player, "wooden_club", "starterSword");

  for (const [chestId, definition] of Object.entries(chests)) {
    for (const itemId of definition.contents) {
      player = addItemToChest(player, chestId, itemId);
    }
  }

  return player;
};
