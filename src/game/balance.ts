// The starting value of every attribute. At this value a stat gives no bonus.
export const BASELINE_STAT = 10;

// Each attribute point above the baseline adds this fraction of the base
// damage. Additive: +15% per point is x2.5 at 20, not x4.
export const DAMAGE_BONUS_PER_POINT = 0.15;

// Fysik: flat HP per point, then a percentage on top per point above baseline.
export const HP_PER_CON_POINT = 12;
export const HP_BONUS_PER_CON_POINT = 0.1;
