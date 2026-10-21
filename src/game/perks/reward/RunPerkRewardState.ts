
import { PerkRarity } from "../PerkRarity";

export interface AcquiredPerkInstance {
  readonly instanceId: string;
  readonly perkId: string;

  // Rarity at the moment of acquisition,
  // not the currently upgraded rarity.
  readonly rarity: PerkRarity;
}

export class RunPerkRewardState {
  private readonly shownPerkVariants = new Set<string>();

  private readonly acquiredPerkInstances =
    new Map<string, AcquiredPerkInstance>();

  private readonly acquiredVariantKeys = new Set<string>();

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

  markAsAcquired(instance: AcquiredPerkInstance): void {
    const key = this.createKey(
      instance.perkId,
      instance.rarity,
    );

    if (this.acquiredPerkInstances.has(instance.instanceId)) {
      throw new Error(
        `Perk instance "${instance.instanceId}" already registered.`,
      );
    }

    if (this.acquiredVariantKeys.has(key)) {
      throw new Error(
        `Perk reward "${key}" was already acquired.`,
      );
    }

    this.acquiredPerkInstances.set(
      instance.instanceId,
      { ...instance },
    );

    this.acquiredVariantKeys.add(key);
  }

  hasBeenAcquired(perkId: string): boolean {
    return [...this.acquiredPerkInstances.values()].some(
      (instance) => instance.perkId === perkId,
    );
  }

  hasAcquiredRarity(
    perkId: string,
    rarity: PerkRarity,
  ): boolean {
    return this.acquiredVariantKeys.has(
      this.createKey(perkId, rarity),
    );
  }

  getAcquiredInstances(
    perkId: string,
  ): readonly AcquiredPerkInstance[] {
    return [...this.acquiredPerkInstances.values()]
      .filter(
        (instance) => instance.perkId === perkId,
      )
      .map(
        (instance) => ({ ...instance }),
      );
  }

  reset(): void {
    this.shownPerkVariants.clear();
    this.acquiredPerkInstances.clear();
    this.acquiredVariantKeys.clear();
  }

  private createKey(
    perkId: string,
    rarity: PerkRarity,
  ): string {
    return `${perkId}:${rarity}`;
  }
}
