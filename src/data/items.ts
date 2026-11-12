import type { GameItem, GeneralItem } from "./itemTypes";
import { weapons } from "./weapons";
import { armour } from "./armour";
import { getSkill } from "./skills";
import healthPotionImage from "../assets/items/health_potion.png";
import firewoodImage from "../assets/items/firewood.png";

import storageKeyImage from "../assets/items/storageKey.png";
import manaPotionImage from "../assets/items/mana_potion.png";
import clothImage from "../assets/items/cloth.png";
import clothBandage from "../assets/items/bandage.png";
import leatherImage from "../assets/items/leather.png";
import woodlogImage from "../assets/items/woodlog.png";
import smedenToolsImage from "../assets/items/smedenTools.png";

import sandwichImage from "../assets/items/macka.png";
import soupVegImage from "../assets/items/gryta.png";
import teaImage from "../assets/items/tea.png";
import beerImage from "../assets/items/beer.png";
import blueMushroomImage from "../assets/items/blueMushroom.png";
import wolfMeatImage from "../assets/items/wolfMeat.png";
import wolfPeltImage from "../assets/items/wolfPelt.png";
import orangeMushroomsImage from "../assets/items/orangeMushrooms.png";
import rubyImage from "../assets/items/ruby.png";
import sapphireImage from "../assets/items/sapphire.png";
import diamondImage from "../assets/items/diamond.png";
import silverRingImage from "../assets/items/silverRing.png";
import goldRingImage from "../assets/items/goldRing.png";
import diamondRingImage from "../assets/items/diamondRing.png";

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
    baseValue: 13,
  },
  {
    id: "beerMug",
    name: "Värdshusets Öl",
    description: "Bryggt lokalt.",
    image: beerImage,
    shape: [{ x: 0, y: 0 }],
    baseValue: 9,
    use: {
      verb: "drack en öl",
      effects: [{ type: "restoreMana", amount: 40 }],
    },
  },
  {
    id: "sandwich",
    name: "Smörgås",
    description: "Bröd med kött och grönsaker",
    image: sandwichImage,
    shape: [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
    ],
    baseValue: 6,
    use: {
      verb: "åt en smörgås",
      effects: [{ type: "heal", amount: 40 }],
    },
  },
  {
    id: "soupVeg",
    name: "Grönsaksgryta",
    description: "Krämig gryta full med olika grönsaker.",
    image: soupVegImage,
    shape: [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
    ],
    baseValue: 20,
    use: {
      verb: "åt en grönsaksgryta",
      effects: [
        { type: "heal", amount: 50 },
        { type: "restoreMana", amount: 50 },
      ],
    },
  },
  {
    id: "teaStar",
    name: "Stjärn Te",
    description: "En stark dryck som piggar upp sinnet.",
    image: teaImage,
    shape: [{ x: 0, y: 0 }],
    baseValue: 18,
    use: {
      verb: "drack stjärnte",
      effects: [{ type: "restoreMana", amount: 80 }],
    },
  },
  {
    id: "smedenTools",
    name: "Gjutverktyg",
    description: "Smedens verktyg inlindat i djurskin.",
    image: smedenToolsImage,
    shape: [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
    ],
    imageScale: 1.2,
    baseValue: 0,
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
    baseValue: 14,
  },
  {
    id: "wolfMeat",
    name: "Vargkött",
    description: "Rått kött från en varg.",
    image: wolfMeatImage,
    shape: [{ x: 0, y: 0 }],
    baseValue: 9,
  },
  {
    id: "wolfPelt",
    name: "Vargskinn",
    description: "En varm, gråbrun vargpäls.",
    image: wolfPeltImage,
    shape: [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
    ],
    baseValue: 34,
  },
  {
    id: "ruby",
    name: "Rubin",
    description: "En klar, röd ädelsten.",
    image: rubyImage,
    shape: [{ x: 0, y: 0 }],
    baseValue: 63,
  },
  {
    id: "sapphire",
    name: "Safir",
    description: "En djupblå ädelsten med slipade fasetter.",
    image: sapphireImage,
    shape: [{ x: 0, y: 0 }],
    baseValue: 70,
  },
  {
    id: "diamond",
    name: "Diamant",
    description: "En gnistrande, klar ädelsten.",
    image: diamondImage,
    shape: [{ x: 0, y: 0 }],
    baseValue: 126,
  },
  {
    id: "silverRing",
    name: "Silverring",
    description: "En enkel ring av polerat silver.",
    image: silverRingImage,
    shape: [{ x: 0, y: 0 }],
    baseValue: 49,
  },
  {
    id: "goldRing",
    name: "Guldring",
    description: "En vacker ring av rent guld.",
    image: goldRingImage,
    shape: [{ x: 0, y: 0 }],
    baseValue: 88,
  },
  {
    id: "diamondRing",
    name: "Diamantring",
    description: "En guldring prydd med en gnistrande diamant.",
    image: diamondRingImage,
    shape: [{ x: 0, y: 0 }],
    baseValue: 210,
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
    baseValue: 9,
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
    baseValue: 3,
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
  {
    id: "health_potion",
    name: "Läkande dryck",
    description: "Magisk vätska som snabbt läker sår, smakar som jordgubbar.",
    image: healthPotionImage,
    shape: [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
    ],
    baseValue: 28,
    use: {
      verb: "drack en läkande dryck",
      effects: [{ type: "heal", percentOfMax: 100 }],
    },
  },
  {
    id: "mana_potion",
    name: "Magisk dryck",
    description: "Fyller på din magi.",
    image: manaPotionImage,
    shape: [{ x: 0, y: 0 }],
    baseValue: 18,
    use: {
      verb: "drack en magisk dryck",
      effects: [{ type: "restoreMana", percentOfMax: 100 }],
    },
  },
  {
    id: "magicMushroom",
    name: "Magisk Svamp",
    description: "En blå svamp med magiska egenskaper.",
    image: blueMushroomImage,
    shape: [{ x: 0, y: 0 }],
    baseValue: 17,
    use: {
      verb: "åt en magisk svamp",
      effects: [{ type: "restoreMana", amount: 12 }],
    },
  },
  {
    id: "healingMushroom",
    name: "Läkande Svamp",
    description: "En liten klase orange svampar som läker 12 hälsa.",
    image: orangeMushroomsImage,
    shape: [{ x: 0, y: 0 }],
    baseValue: 9,
    use: {
      verb: "åt en läkande svamp",
      effects: [{ type: "heal", amount: 12 }],
    },
  },
  {
    id: "bandage",
    name: "Bandage",
    description: "Lindar sår och brännskador.",
    image: clothBandage,
    shape: [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
    ],
    baseValue: 11,
    use: {
      verb: "lindade dig med ett bandage",
      effects: [{ type: "cure", statuses: ["bleed", "burn"] }],
    },
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
