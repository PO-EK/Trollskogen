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
import {
  addItemToChest,
  addItemToContainer,
  addItemToInventory,
} from "../game/inventory";
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

export const PLAYER_SAVE_VERSION = 1;

type PlayerSave = {
  version: number;
  savedAt: string;
  player: Player;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function serializePlayerSave(player: Player): string {
  const save: PlayerSave = {
    version: PLAYER_SAVE_VERSION,
    savedAt: new Date().toISOString(),
    player,
  };
  return JSON.stringify(save, null, 2);
}

export function deserializePlayerSave(json: string): Player {
  const parsed: unknown = JSON.parse(json);
  if (!isRecord(parsed) || parsed.version !== PLAYER_SAVE_VERSION) {
    throw new Error("Save-filen har ett ogiltigt eller gammalt format.");
  }
  if (!isRecord(parsed.player)) {
    throw new Error("Save-filen innehåller ingen giltig spelardata.");
  }

  const player = parsed.player;
  const requiredNumbers = [
    "day",
    "ActionPoints",
    "Gold",
    "Level",
    "Exp",
    "ExpMax",
    "SkillPoints",
    "Str",
    "Dex",
    "DodgeChance",
    "Con",
    "Int",
    "HP",
    "HPMax",
    "Mana",
    "ManaMax",
    "BackpackWidth",
    "BackpackHeight",
  ];

  if (
    typeof player.Name !== "string" ||
    requiredNumbers.some((key) => typeof player[key] !== "number") ||
    !Array.isArray(player.LearnedNodes) ||
    !Array.isArray(player.EquippedSkills) ||
    !Array.isArray(player.Inventory) ||
    !isRecord(player.Equipment) ||
    !isRecord(player.Chests) ||
    !Array.isArray(player.Quests) ||
    !isRecord(player.StoryFlags) ||
    !Array.isArray(player.ScheduledStoryFlags) ||
    !Array.isArray(player.UnlockedLocations) ||
    !Array.isArray(player.LockedLocations) ||
    !Array.isArray(player.KnownSkills)
  ) {
    throw new Error("Save-filen saknar obligatorisk spelardata.");
  }

  return player as unknown as Player;
}

export type QuestState = {
  questId: string;
  completed: boolean;
};

export const createNewPlayer = (): Player => {
  let player: Player = {
    Name: "Soldaten",
    day: 1,
    ActionPoints: DAILY_ACTION_POINTS,

    Gold: 42,

    Level: 1,
    Exp: 0,
    ExpMax: 100,
    SkillPoints: 0,
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
    BackpackWidth: 5,
    BackpackHeight: 4,

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
    KnownSkills: [],
  };

  player = addItemToInventory(player, "bandage", "startBandage");
  player = addItemToChest(
    player,
    "playerStorage",
    "iron_sword",
    "starterSword",
  );
  for (const [chestId, definition] of Object.entries(chests)) {
    for (const itemId of definition.contents) {
      player = addItemToChest(player, chestId, itemId);
    }
  }

  return player;
};
