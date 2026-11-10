export type ChestDefinition = {
  name: string;
  width: number;
  height: number;
  contents: string[];
};

export const chests = {
  playerStorage: {
    name: "Din Kista",
    width: 7,
    height: 7,
    contents: [],
  },
  ruinsChest: {
    name: "Moders kista",
    width: 4,
    height: 3,
    contents: ["diamond", "health_potion", "goldRing"],
  },
  banditChest1: {
    name: "Rövarnas kista",
    width: 4,
    height: 4,
    contents: [],
  },
  banditChest2: {
    name: "Rövarnas kista",
    width: 4,
    height: 4,
    contents: [],
  },
  caveChest: {
    name: "Grottkista",
    width: 4,
    height: 4,
    contents: [],
  },
} satisfies Record<string, ChestDefinition>;

export type ChestId = keyof typeof chests;

export function getChestDefinition(chestId: string): ChestDefinition {
  const definition = Object.entries(chests).find(([id]) => id === chestId)?.[1];

  if (!definition) {
    throw new Error(`Unknown chest "${chestId}".`);
  }

  return definition;
}
