export type ItemShape = {
  x: number;
  y: number;
};

export type BaseItem = {
  id: string;
  name: string;
  description: string;
  image: string;
  shape: ItemShape[];
  imageOffsetX?: number;
  imageOffsetY?: number;
  baseValue: number;
  imageScale?: number;
};

// Everything that is not a weapon or armour (potions, materials, quest items...).
// category is optional, so none of your existing items need editing.
export type GeneralItem = BaseItem & {
  category?: "general";
};

export type WeaponSlot = "mainHand" | "offHand";

export type WeaponStat = "Str" | "Dex" | "Int";

export type WeaponItem = BaseItem & {
  category: "weapon";
  slot: WeaponSlot;
  minDamage: number;
  maxDamage: number;
  stat: WeaponStat;
  scaling?: number;
  skills: string[]; // skill ids from data/skills.ts, 1 to 3 of them
};

// The part of a weapon that damage calculation needs. Fists and spells
// use this without being real items.
export type WeaponStats = Pick<
  WeaponItem,
  "minDamage" | "maxDamage" | "stat" | "scaling"
>;

export type ArmourSlot = "head" | "body" | "feet" | "hands";

export type ArmourItem = BaseItem & {
  category: "armour";
  slot: ArmourSlot;
  defense: number;
  skills?: string[];
  attackBonus?: number;
};

export type EquipmentSlot = WeaponSlot | ArmourSlot;

export type GameItem = GeneralItem | WeaponItem | ArmourItem;

export function isWeapon(item: GameItem): item is WeaponItem {
  return item.category === "weapon";
}

export function isArmour(item: GameItem): item is ArmourItem {
  return item.category === "armour";
}
