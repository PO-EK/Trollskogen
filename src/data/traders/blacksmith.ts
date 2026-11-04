import type { TraderDefinition } from "./tradersTypes";

export const blacksmith: TraderDefinition = {
  id: "blacksmith",
  name: "Smeden",
  description: "En kraftig smed som säljer vapen och rustningar.",
  inventoryWidth: 8,
  inventoryHeight: 5,
  markup: 1.25,
  stock: [
    "iron_body",
    "iron_boots",
    "wood_torch",
    "iron_helm",
    "iron_sword",
    "iron_dagger",
    "iron_spear",
  ],
};
