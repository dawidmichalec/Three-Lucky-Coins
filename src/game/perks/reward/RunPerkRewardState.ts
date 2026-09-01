import { PerkRarity } from "../PerkRarity";

export class RunPerkRewardState {
  private shownPerkVariants = new Set<string>();
  private acquiredPerkIds = new Set<string>();

  markAsShown(
    perkId: string,
    rarity: PerkRarity,
  ): void {
    this.shownPerkVariants.add(
      this.createKey(perkId, rarity),
    );
  }

  hasBeenShown(
    perkId: string,
    rarity: PerkRarity,
  ): boolean {
    return this.shownPerkVariants.has(
      this.createKey(perkId, rarity),
    );
  }

  markAsAcquired(perkId: string): void {
    this.acquiredPerkIds.add(perkId);
  }

  hasBeenAcquired(perkId: string): boolean {
    return this.acquiredPerkIds.has(perkId);
  }

  reset(): void {
    this.shownPerkVariants.clear();
    this.acquiredPerkIds.clear();
  }

  private createKey(
    perkId: string,
    rarity: PerkRarity,
  ): string {
    return `${perkId}:${rarity}`;
  }
}