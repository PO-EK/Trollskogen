import oldAxeImage from "../assets/items/axe.png";
import healthPotionImage from "../assets/items/potion.png";
import firewoodImage from "../assets/items/firewood.png";

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
  maxStack: number;
  imageScale?: number;
};

export const items: Item[] = [
  {
    id: "health_potion",
    name: "Läkande dryck",
    description: "Magisk vätska som snabbt läker sår, smakar som jordgubbar.",
    image: healthPotionImage,
    shape: [{ x: 0, y: 0 }],
    maxStack: 10,
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
    imageScale: 1.4,
    maxStack: 10,
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
    maxStack: 1,
    imageOffsetX: 10,
    imageOffsetY: -5,
    imageScale: 1.4,
  },
];
