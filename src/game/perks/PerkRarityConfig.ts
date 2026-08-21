import { PerkRarity } from "./PerkRarity";

export const PERK_RARITY_WEIGHTS: Record<PerkRarity, number> = {
  [PerkRarity.COMMON]: 50,
  [PerkRarity.UNCOMMON]: 30,
  [PerkRarity.RARE]: 15,
  [PerkRarity.EPIC]: 4,
  [PerkRarity.LEGENDARY]: 1,
};
