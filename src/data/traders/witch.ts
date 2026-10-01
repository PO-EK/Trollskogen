import type { Trader } from "./tradersTypes";

export const witch: Trader = {
  id: "witch",
  name: "Häxan",
  description: "En mystisk kvinna som säljer märkliga drycker och föremål.",
  inventoryWidth: 5,
  inventoryHeight: 3,
  inventory: [
    {
      containerItemId: "witch_potion_1",
      itemId: "health_potion",
      x: 0,
      y: 0,
    },
  ],
};
