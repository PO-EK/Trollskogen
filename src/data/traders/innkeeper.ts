import type { TraderDefinition } from "./tradersTypes";

export const innkeeper: TraderDefinition = {
  id: "innkeeper",
  name: "Värdshusvärden",
  description: "En vänlig man som säljer drycker och andra förnödenheter.",
  inventoryWidth: 5,
  inventoryHeight: 3,
  markup: 1.2,
  stock: ["beerMug", "soupVeg", "teaStar", "sandwich", "bandage"],
};
