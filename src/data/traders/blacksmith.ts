import type { Trader } from "./tradersTypes";

export const blacksmith: Trader = {
  id: "blacksmith",
  name: "Smeden",
  description: "En kraftig smed som säljer vapen och rustningar.",
  inventoryWidth: 8,
  inventoryHeight: 4,

  inventory: [
    {
      containerItemId: "blacksmith-old-axe-1",
      itemId: "old_axe",
      x: 6,
      y: 1,
      buyPrice: 40,
    },
    {
      containerItemId: "blacksmith-wood-torch-1",
      itemId: "wood_torch",
      x: 0,
      y: 1,
      buyPrice: 12,
    },
    {
      containerItemId: "firewood-1",
      itemId: "firewood",
      x: 2,
      y: 0,
      buyPrice: 8,
    },
    {
      containerItemId: "mana-1",
      itemId: "mana_potion",
      x: 4,
      y: 0,
      buyPrice: 45,
    },
    {
      containerItemId: "health_potion1",
      itemId: "health_potion",
      x: 2,
      y: 2,
      buyPrice: 60,
    },
  ],
};
