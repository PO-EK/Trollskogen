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
      x: 0,
      y: 0,
      buyPrice: 40,
    },
    {
      containerItemId: "blacksmithIronBody",
      itemId: "iron_body",
      x: 6,
      y: 0,
      buyPrice: 140,
    },
    {
      containerItemId: "blacksmithIronBoots",
      itemId: "iron_boots",
      x: 4,
      y: 3,
      buyPrice: 80,
    },
    {
      containerItemId: "blacksmith-wood-torch-1",
      itemId: "wood_torch",
      x: 0,
      y: 1,
      buyPrice: 12,
    },
    {
      containerItemId: "smedenHelm",
      itemId: "iron_helm",
      x: 2,
      y: 0,
      buyPrice: 80,
    },
    {
      containerItemId: "firewood-1",
      itemId: "firewood",
      x: 2,
      y: 2,
      buyPrice: 8,
    },
    {
      containerItemId: "smedenSword",
      itemId: "iron_sword",
      x: 4,
      y: 0,
      buyPrice: 75,
    },
  ],
};
