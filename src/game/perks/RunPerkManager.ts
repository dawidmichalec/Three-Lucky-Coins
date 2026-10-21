
import { PerkData, PerkVariant } from "./PerkData";
import { PerkReward } from "./reward/PerkReward";
import { PerkRarity } from "./PerkRarity";

export interface ActiveRunPerk {
  readonly instanceId: string;
  readonly perk: PerkData;
  readonly variant: PerkVariant;
}

export class RunPerkManager {
  // Key: instanceId, not perk.id.
  private readonly activePerks = new Map<string, ActiveRunPerk>();

  // History of rewards granted during the run.
  private readonly awardedVariantKeys = new Set<string>();
  private readonly awardedFamilyIds = new Set<string>();

  private nextInstanceId = 1;

  addPerk(reward: PerkReward): ActiveRunPerk | undefined {
    const perk = reward.perk;

    const variant = perk.variants.find(
      (candidate) => candidate.rarity === reward.variant.rarity,
    );

    if (!variant) {
      return undefined;
    }

    // A non-stackable family can be acquired only once per run,
    // even if its original instance was subsequently removed.
    if (
      !perk.isStackable &&
      this.awardedFamilyIds.has(perk.id)
    ) {
      return undefined;
    }

    const rewardKey = this.createVariantKey(
      perk.id,
      variant.rarity,
    );

    // A reward variant cannot be acquired twice,
    // including after upgrading or removing its instance.
    if (this.awardedVariantKeys.has(rewardKey)) {
      return undefined;
    }

    // A reward cannot create two active instances of the
    // same rarity. Only upgrading may do that.
    if (
      this.getPerkInstances(perk.id).some(
        (instance) => instance.variant.rarity === variant.rarity,
      )
    ) {
      return undefined;
    }

    const instance: ActiveRunPerk = {
      instanceId: `perk-${this.nextInstanceId++}`,
      perk,
      variant,
    };

    this.activePerks.set(instance.instanceId, instance);

    this.awardedVariantKeys.add(rewardKey);
    this.awardedFamilyIds.add(perk.id);

    return instance;
  }

  hasPerk(perkId: string): boolean {
    return this.getPerkInstances(perkId).length > 0;
  }

  hasBeenAwarded(
    perkId: string,
    rarity: PerkRarity,
  ): boolean {
    return this.awardedVariantKeys.has(
      this.createVariantKey(perkId, rarity),
    );
  }

  getPerkInstances(
    perkId: string,
  ): readonly ActiveRunPerk[] {
    return [...this.activePerks.values()].filter(
      (instance) => instance.perk.id === perkId,
    );
  }

  getPerkInstance(
    instanceId: string,
  ): ActiveRunPerk | undefined {
    return this.activePerks.get(instanceId);
  }

  getActivePerks(): readonly ActiveRunPerk[] {
    return [...this.activePerks.values()];
  }

  // Legacy API — safe only when a family has one instance.
  getPerk(perkId: string): ActiveRunPerk | undefined {
    const instances = this.getPerkInstances(perkId);

    if (instances.length > 1) {
      throw new Error(
        `Perk family "${perkId}" has ${instances.length} active instances. Use getPerkInstances().`,
      );
    }

    return instances[0];
  }

  removePerkInstance(instanceId: string): boolean {
    return this.activePerks.delete(instanceId);
  }

  // Legacy API — used by existing effects such as Piggy Bank.
  removePerk(perkId: string): boolean {
    const instance = this.getPerk(perkId);

    return instance
      ? this.removePerkInstance(instance.instanceId)
      : false;
  }

  upgradePerkInstance(
    instanceId: string,
    rarity: PerkRarity,
  ): boolean {
    const instance = this.activePerks.get(instanceId);

    if (!instance) {
      return false;
    }

    const variant = instance.perk.variants.find(
      (candidate) => candidate.rarity === rarity,
    );

    if (!variant) {
      return false;
    }

    // Duplicate active rarities are allowed through upgrades.
    // The originally awarded rarity remains in the history.
    this.activePerks.set(instanceId, {
      ...instance,
      variant,
    });

    return true;
  }

  // Legacy API.
  upgradePerk(
    perkId: string,
    variant: PerkVariant,
  ): boolean {
    const instance = this.getPerk(perkId);

    return instance
      ? this.upgradePerkInstance(
          instance.instanceId,
          variant.rarity,
        )
      : false;
  }

  // This replacement operation is deliberately limited
  // to the same family. Cross-family replacement would
  // require separate acquisition rules.
  replacePerkInstance(
    instanceId: string,
    reward: PerkReward,
  ): boolean {
    const instance = this.activePerks.get(instanceId);

    if (
      !instance ||
      instance.perk.id !== reward.perk.id
    ) {
      return false;
    }

    const variant = instance.perk.variants.find(
      (candidate) => candidate.rarity === reward.variant.rarity,
    );

    if (!variant) {
      return false;
    }

    const conflict = this.getPerkInstances(
      instance.perk.id,
    ).some(
      (other) =>
        other.instanceId !== instanceId &&
        other.variant.rarity === variant.rarity,
    );

    if (conflict) {
      return false;
    }

    this.activePerks.set(instanceId, {
      ...instance,
      variant,
    });

    return true;
  }

  // Legacy API.
  replacePerk(
    perkId: string,
    reward: PerkReward,
  ): boolean {
    const instance = this.getPerk(perkId);

    return instance
      ? this.replacePerkInstance(
          instance.instanceId,
          reward,
        )
      : false;
  }

  clear(): void {
    this.activePerks.clear();
    this.awardedVariantKeys.clear();
    this.awardedFamilyIds.clear();
    this.nextInstanceId = 1;
  }

  private createVariantKey(
    perkId: string,
    rarity: PerkRarity,
  ): string {
    return `${perkId}:${rarity}`;
  }
}
