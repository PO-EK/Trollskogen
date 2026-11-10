import type { TraderDefinition } from "./tradersTypes";

export const blacksmith: TraderDefinition = {
  id: "blacksmith",
  name: "Smeden",
  description: "En kraftig smed som säljer vapen och rustningar.",
  inventoryWidth: 8,
  inventoryHeight: 10,
  markup: 1.35,
  stock: [
    "leather_body",
    "leather_boots",
    "leather_helm",
    "iron_body",
    "iron_boots",
    "iron_helm",
    "tower_shield",
    "bronze_buckler",
    "holy_shield",
  ],
};
