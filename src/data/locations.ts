import type { InventoryItem } from "./player";

export type MapLocation = {
  id: string;
  name: string;
  x: number;
  y: number;
  icon: string;
  unlocked: boolean;
  adventureId: string;
  loot?: InventoryItem[];
};

export const locations: MapLocation[] = [
  {
    id: "intro",
    name: "Spela intro igen",
    x: 5,
    y: 90,
    icon: "📜",
    unlocked: true,
    adventureId: "intro",
  },

  {
    id: "village",
    name: "Utforska byn",
    x: 50,
    y: 25,
    icon: "🏘️",
    unlocked: true,
    adventureId: "village",
  },

  {
    id: "gamlahem",
    name: "Nedbränd gård",
    x: 85,
    y: 85,
    icon: "🏚️",
    unlocked: true,
    adventureId: "gamlahem",
    loot: [
      {
        inventoryId: "oldaxe0001",
        itemId: "old_axe",
        quantity: 1,
        x: 0,
        y: 0,
      },
    ],
  },

  {
    id: "forest",
    name: "Utforska Trollskogen",
    x: 50,
    y: 95,
    icon: "🌲",
    unlocked: false,
    adventureId: "trollskogen",
  },
];
