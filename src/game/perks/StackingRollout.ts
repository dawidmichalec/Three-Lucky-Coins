
import { PerkData } from "./PerkData";

const STACKING_ENABLED_PERK_IDS: ReadonlySet<string> =
  new Set([
    "casino_bonus",
  ]);

export function isStackingEnabledFor(
  perk: PerkData,
): boolean {
  return (
    perk.isStackable &&
    STACKING_ENABLED_PERK_IDS.has(perk.id)
  );
}