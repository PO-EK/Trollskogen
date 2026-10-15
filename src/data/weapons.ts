import oldAxeImage from "../assets/items/oldaxe.png";
import ironSwordImage from "../assets/items/shortsword.png";
import type { WeaponItem, WeaponStats } from "./itemTypes";
import woodtorchImage from "../assets/items/fakla.png";
import battleAxeImage from "../assets/items/battleaxe.png";
// In the old_axe entry:
//   skills: ["slash"],

export const weapons: WeaponItem[] = [
  {
    id: "iron_sword",
    category: "weapon",
    slot: "mainHand",
    name: "Svärd",
    description: "Ett enkelt svärd gjort av billigt stål.",
    image: ironSwordImage,
    shape: [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: 2 },
    ],
    baseValue: 55,
    minDamage: 12,
    maxDamage: 18,
    stat: "Str",
    skills: ["slash_quick", "stab_quick"],
  },
  {
    id: "wood_torch",
    category: "weapon",
    slot: "offHand",
    name: "Fakla",
    description: "Lyser upp världen och gör monster rädda.",
    image: woodtorchImage,
    shape: [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: 2 },
    ],
    baseValue: 6,
    minDamage: 4,
    maxDamage: 8,
    stat: "Str",
    skills: ["torch_bash"],
  },
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
    maxDamage: 15,
    stat: "Str",
    imageOffsetX: 10,
    imageOffsetY: -5,
    skills: ["slash_quick"],
  },
  {
    id: "battle_axe",
    category: "weapon",
    slot: "mainHand",
    name: "Krigsyxa",
    description: "En stor stål yxa.",
    image: battleAxeImage,
    shape: [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 1, y: 1 },
      { x: 1, y: 2 },
      { x: 1, y: 3 },
    ],
    baseValue: 225,
    minDamage: 22,
    maxDamage: 28,
    stat: "Str",
    skills: ["slash_quick", "slash_area", "slash_hard"],
  },
];
// Below the weapons array. Not an item, just the unarmed fallback.
export const FISTS: WeaponStats = {
  minDamage: 1,
  maxDamage: 3,
  stat: "Str",
};
