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
  Inventory: InventoryItem[];

  // Quest progression
  Quests: QuestState[];
};

export type InventoryItem = {
  itemId: string;
  quantity: number;

  x: number;
  y: number;
};

export type QuestState = {
  questId: string;
  completed: boolean;
};

export const createNewPlayer = (): Player => ({
  Name: "Admin",

  Gold: 100,

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

  Inventory: [
    {
      itemId: "old_axe",
      quantity: 1,
      x: 0,
      y: 0,
    },
    {
      itemId: "health_potion",
      quantity: 1,
      x: 3,
      y: 0,
    },
    {
      itemId: "firewood",
      quantity: 1,
      x: 3,
      y: 3,
    },
  ],

  Quests: [],
});
