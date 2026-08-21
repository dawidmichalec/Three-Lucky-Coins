import { PerkData, PerkVariant } from "./PerkData";
import { PerkReward } from "./reward/PerkReward";

export interface ActiveRunPerk {
  perk: PerkData;
  variant: PerkVariant;
}

export class RunPerkManager {
  private activePerks = new Map<string, ActiveRunPerk>();

  addPerk(reward: PerkReward): boolean {
    if (this.activePerks.has(reward.perk.id)) {
      return false;
    }

    this.activePerks.set(reward.perk.id, {
      perk: reward.perk,
      variant: reward.variant,
    });

    return true;
  }

  hasPerk(perkId: string): boolean {
    return this.activePerks.has(perkId);
  }

  getPerk(perkId: string): ActiveRunPerk | undefined {
    return this.activePerks.get(perkId);
  }

  getActivePerks(): readonly ActiveRunPerk[] {
    return Array.from(this.activePerks.values());
  }

  removePerk(perkId: string): boolean {
    return this.activePerks.delete(perkId);
  }

  replacePerk(perkId: string, reward: PerkReward): boolean {
    if (!this.activePerks.has(perkId)) {
      return false;
    }

    if (perkId !== reward.perk.id && this.activePerks.has(reward.perk.id)) {
      return false;
    }

    this.activePerks.delete(perkId);

    this.activePerks.set(reward.perk.id, {
      perk: reward.perk,
      variant: reward.variant,
    });

    return true;
  }

  upgradePerk(perkId: string, variant: PerkVariant): boolean {
    const activePerk = this.activePerks.get(perkId);

    if (!activePerk) {
      return false;
    }

    this.activePerks.set(perkId, {
      perk: activePerk.perk,
      variant,
    });

    return true;
  }

  clear() {
    this.activePerks.clear();
  }
}
