import type { ArmourItem } from "./itemTypes";
import ironBodyImage from "../assets/items/ironBody.png";
import ironHelmImage from "../assets/items/ironHelm.png";
import ironBootsImage from "../assets/items/ironBoots.png";

export const armour: ArmourItem[] = [
  {
    id: "iron_boots",
    category: "armour",
    slot: "feet",
    name: "Soldatens Stövlar",
    description: "Stövlar för soldater.",
    image: ironBootsImage,
    shape: [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
    ],
    baseValue: 60,
    defense: 10,
  },
  {
    id: "iron_helm",
    category: "armour",
    slot: "head",
    name: "Soldatens Hjälm",
    description: "Hjälm för soldater.",
    image: ironHelmImage,
    shape: [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
    ],
    baseValue: 60,
    defense: 10,
  },
  {
    id: "iron_body",
    category: "armour",
    slot: "body",
    name: "Soldatens Rustning",
    description: "Heltäckande järn rustning för soldater.",
    image: ironBodyImage,
    shape: [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 0, y: 2 },
      { x: 1, y: 2 },
      { x: 0, y: 3 },
      { x: 1, y: 3 },
    ],
    baseValue: 100,
    defense: 20,
  },
];
