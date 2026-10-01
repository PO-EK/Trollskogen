import type { Trader } from "./tradersTypes";
import { innkeeper } from "./innkeeper";
import { witch } from "./witch";
import { blacksmith } from "./blacksmith";

export const traders: Trader[] = [innkeeper, witch, blacksmith];

export function getTrader(traderId: string): Trader | undefined {
  return traders.find((trader) => trader.id === traderId);
}
