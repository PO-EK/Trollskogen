// The starting value of every attribute. At this value a stat gives no bonus.
export const BASELINE_STAT = 10;

// Each attribute point above the baseline adds this fraction of the base
// damage. Additive: +15% per point is x2.5 at 20, not x4.
export const DAMAGE_BONUS_PER_POINT = 0.25;

// Fysik: flat HP per point, then a percentage on top per point above baseline.
export const HP_PER_CON_POINT = 8;
export const HP_BONUS_PER_CON_POINT = 0.1;

// Dodge: 10% at Dex 10, approaching 75%. DODGE_HALF_POINT is how many Dex
// points above 10 give half of the possible bonus.
export const BASE_DODGE = 0.2;
export const MAX_DODGE = 0.75;
export const DODGE_HALF_POINT = 20;

// Försvar at which incoming damage is halved.
export const DEFENSE_HALF_POINT = 40;

export const HP_PER_LEVEL = 6;
export const MANA_PER_LEVEL = 6;

// Mana scaling, independent from HP scaling.
export const MANA_PER_INT_POINT = 5;
export const MANA_BONUS_PER_INT_POINT = 0.1;
