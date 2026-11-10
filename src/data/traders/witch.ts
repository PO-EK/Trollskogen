import type { TraderDefinition } from "./tradersTypes";

export const witch: TraderDefinition = {
  id: "witch",
  name: "Häxan",
  description: "En mystisk kvinna som säljer märkliga drycker och föremål.",
  inventoryWidth: 6,
  inventoryHeight: 7,
  markup: 1.4,
  stock: [
    "wizard_robe",
    "wizard_hat",
    "wizard_shoes",
    "ember_wand",
    "wood_wand",
    "black_wand",
    "health_potion",
    "health_potion",
    "mana_potion",
    "mana_potion",
  ],
};
