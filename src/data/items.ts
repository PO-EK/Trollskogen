import type { GameItem, GeneralItem } from "./itemTypes";
import { weapons } from "./weapons";
import { armour } from "./armour";
import { getSkill } from "./skills";
import healthPotionImage from "../assets/items/health_potion.png";
import firewoodImage from "../assets/items/firewood.png";
import woodtorchImage from "../assets/items/fakla.png";
import storageKeyImage from "../assets/items/storageKey.png";
import manaPotionImage from "../assets/items/mana_potion.png";
import clothImage from "../assets/items/cloth.png";
import leatherImage from "../assets/items/leather.png";
import woodlogImage from "../assets/items/woodlog.png";

// Keeps existing imports of these types from "data/items" working.
export type { ItemShape } from "./itemTypes";
export type Item = GameItem;

const generalItems: GeneralItem[] = [
  {
    id: "cloth",
    name: "Tygrulle",
    description: "Råmatrial av bomull.",
    image: clothImage,
    shape: [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
    ],
    baseValue: 18,
  },
  {
    id: "leather",
    name: "Läder",
    description: "Råmatrial av djurskin.",
    image: leatherImage,
    shape: [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
    ],
    baseValue: 20,
  },
  {
    id: "woodlog",
    name: "Stock",
    description: "Råmatrial av trä.",
    image: woodlogImage,
    shape: [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: 2 },
      { x: 1, y: 1 },
      { x: 1, y: 2 },
    ],
    baseValue: 12,
  },
  {
    id: "health_potion",
    name: "Läkande dryck",
    description: "Magisk vätska som snabbt läker sår, smakar som jordgubbar.",
    image: healthPotionImage,
    shape: [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
    ],
    baseValue: 40,
  },
  {
    id: "wood_torch",
    name: "Fakla",
    description: "Lyser upp världen och gör monster rädda.",
    image: woodtorchImage,
    shape: [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: 2 },
    ],
    baseValue: 6,
  },
  {
    id: "mana_potion",
    name: "Magisk dryck",
    description: "Fyller på dina magiska kraft.",
    image: manaPotionImage,
    shape: [{ x: 0, y: 0 }],
    baseValue: 25,
  },
  {
    id: "firewood",
    name: "Vedträd",
    description: "Redo för att elda.",
    image: firewoodImage,
    shape: [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
    ],
    baseValue: 4,
  },
  {
    id: "storageKey",
    name: "Nyckel",
    description: "Öppnar kistan i ditt hus.",
    image: storageKeyImage,
    shape: [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
    ],
    baseValue: 0,
  },
];

export const items: GameItem[] = [...generalItems, ...weapons, ...armour];

// Dev-only: catches duplicate ids now that items live in several files.
if (import.meta.env.DEV) {
  for (const weapon of weapons) {
    if (weapon.skills.length < 1 || weapon.skills.length > 3) {
      console.error(`${weapon.id} must have 1-3 skills`);
    }

    for (const skillId of weapon.skills) {
      if (!getSkill(skillId)) {
        console.error(`${weapon.id} references unknown skill: ${skillId}`);
      }
    }
  }
  const seen = new Set<string>();

  for (const item of items) {
    if (seen.has(item.id)) {
      console.error(`Duplicate item id: ${item.id}`);
    }

    seen.add(item.id);
  }
}
