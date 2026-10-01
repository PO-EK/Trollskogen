import oldAxeImage from "../assets/items/oldaxe.png";
import healthPotionImage from "../assets/items/health_potion.png";
import firewoodImage from "../assets/items/firewood.png";
import woodtorchImage from "../assets/items/fakla.png";
import storageKeyImage from "../assets/items/storageKey.png";
import manaPotionImage from "../assets/items/mana_potion.png";

export type ItemShape = {
  x: number;
  y: number;
};

export type Item = {
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

export const items: Item[] = [
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
  {
    id: "old_axe",
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
    imageOffsetX: 10,
    imageOffsetY: -5,
  },
];
