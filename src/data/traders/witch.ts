import type { TraderDefinition } from "./tradersTypes";

export const witch: TraderDefinition = {
  id: "witch",
  name: "Häxan",
  description: "En mystisk kvinna som säljer märkliga drycker och föremål.",
  inventoryWidth: 6,
  inventoryHeight: 6,
  markup: 1.2,
  stock: [
    "wizard_robe",
    "wizard_hat",
    "wizard_shoes",
    "health_potion",
    "health_potion",
    "health_potion",
    "mana_potion",
    "mana_potion",
  ],
};
