import type { Trader, TraderDefinition } from "./tradersTypes";
import { addItemToTraderInventory } from "../../game/inventory";
import { innkeeper } from "./innkeeper";
import { witch } from "./witch";
import { blacksmith } from "./blacksmith";

const traderDefinitions: TraderDefinition[] = [innkeeper, witch, blacksmith];

function createTrader(definition: TraderDefinition): Trader {
  const { stock, ...trader } = definition;
  let initializedTrader: Trader = { ...trader, inventory: [] };

  for (const itemId of stock) {
    initializedTrader = addItemToTraderInventory(initializedTrader, itemId);
  }

  return initializedTrader;
}

export function createTraders(): Trader[] {
  return traderDefinitions.map(createTrader);
}

export const traders: Trader[] = createTraders();

export function getTrader(traderId: string): Trader | undefined {
  return traders.find((trader) => trader.id === traderId);
}
