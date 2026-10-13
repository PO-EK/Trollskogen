import oldAxeImage from "../assets/items/oldaxe.png";
import type { WeaponItem, WeaponStats } from "./itemTypes";

// In the old_axe entry:
//   skills: ["slash"],

export const weapons: WeaponItem[] = [
  {
    id: "old_axe",
    category: "weapon",
    slot: "mainHand",
    name: "Järn Yxa",
    description: "En gammal yxa gjort av järn och ek.",
    image: oldAxeImage,
    shape: [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 1, y: 2 },
    ],
    baseValue: 25,
    minDamage: 8,
    maxDamage: 14,
    stat: "Str",
    imageOffsetX: 10,
    imageOffsetY: -5,
    skills: ["slash"],
  },
];
// Below the weapons array. Not an item, just the unarmed fallback.
export const FISTS: WeaponStats = {
  minDamage: 1,
  maxDamage: 3,
  stat: "Str",
};
