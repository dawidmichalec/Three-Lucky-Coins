import { PerkRarity } from "../PerkRarity";

export class RunPerkRewardState {
  private shownPerkVariants = new Set<string>();

  markAsShown(perkId: string, rarity: PerkRarity) {
    this.shownPerkVariants.add(this.createKey(perkId, rarity));
  }

  hasBeenShown(perkId: string, rarity: PerkRarity): boolean {
    return this.shownPerkVariants.has(this.createKey(perkId, rarity));
  }

  reset() {
    this.shownPerkVariants.clear();
  }

  private createKey(perkId: string, rarity: PerkRarity): string {
    return `${perkId}:${rarity}`;
  }
}
