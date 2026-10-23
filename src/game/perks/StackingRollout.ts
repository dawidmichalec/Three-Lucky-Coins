
import { PerkData } from "./PerkData";

const STACKING_ENABLED_PERK_IDS: ReadonlySet<string> =
  new Set([
    "casino_bonus",
    "multiplier_booster",
    "gambler",
    "risk_taker",
    "damage_control",
    "bounce_back",
    "hot_streak",
    "on_a_roll",
  ]);

export function isStackingEnabledFor(
  perk: PerkData,
): boolean {
  return (
    perk.isStackable &&
    STACKING_ENABLED_PERK_IDS.has(perk.id)
  );
}