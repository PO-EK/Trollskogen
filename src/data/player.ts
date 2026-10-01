export type StoryFlags = Record<string, boolean>;
import type { ContainerItem } from "./containerItems";

/* type Storage = {
  width: number;
  height: number;
  inventory: ContainerItem[];
}; */

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

  // Inventory
  BackpackWidth: 5;
  BackpackHeight: 5;
  Inventory: ContainerItem[];

  StorageWidth: number;
  StorageHeight: number;
  Storage: ContainerItem[];

  // Quest progression
  Quests: QuestState[];
  StoryFlags: Record<string, boolean>;
};

export type QuestState = {
  questId: string;
  completed: boolean;
};

export const createNewPlayer = (): Player => ({
  Name: "Admin",

  Gold: 128,

  Level: 1,
  Exp: 0,
  ExpMax: 100,

  Str: 10,
  Dex: 10,
  Con: 10,
  Int: 10,

  HP: 100,
  HPMax: 100,

  Mana: 50,
  ManaMax: 50,

  BackpackWidth: 5,
  BackpackHeight: 5,

  StorageWidth: 10,
  StorageHeight: 10,
  Storage: [],

  Inventory: [
    {
      containerItemId: "myStorageKey",
      itemId: "storageKey",
      x: 1,
      y: 1,
    },
  ],
  Quests: [],
  StoryFlags: {},
});
