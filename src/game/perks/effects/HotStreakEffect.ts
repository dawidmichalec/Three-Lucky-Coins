import { RunPerkManager } from "../RunPerkManager";
import { HotStreakConfig } from "../data/HotStreak";
import { PerkRarity } from "../PerkRarity";
import { roundMoney } from "../../util/MoneyUtils";

export interface HotStreakBonusStep {
  instanceId: string;
  rarity: PerkRarity;
  percentage: number;
  bonusAmount: number;
  finalWinAmount: number;
}

export interface HotStreakResult {
  triggered: boolean;
  baseWinAmount: number;
  bonusAmount: number;
  finalWinAmount: number;
  payoutMultiplier: number;
  bonusSteps: readonly HotStreakBonusStep[];
}

export class HotStreakEffect {
  private activeThisFight = false;

  constructor(
    private readonly runPerkManager: RunPerkManager,
  ) {}

  tryActivate(multiplier: number): boolean {
    if (this.activeThisFight) {
      return false;
    }

    const instances =
      this.runPerkManager.getPerkInstances("hot_streak");

    if (instances.length === 0) {
      return false;
    }

    // All variants currently require x5.
    // Activate the entire family at once.

    const requirementsMet = instances.every(
      (instance) => {
        const config =
          instance.variant.config as HotStreakConfig;

        return multiplier >= config.requiredMultiplier;
      },
    );

    if (!requirementsMet) {
      return false;
    }

    this.activeThisFight = true;

    return true;
  }

  apply(winAmount: number): HotStreakResult {
    const instances =
      this.runPerkManager.getPerkInstances("hot_streak");

    if (
      !this.activeThisFight ||
      instances.length === 0
    ) {
      return {
        triggered: false,
        baseWinAmount: winAmount,
        bonusAmount: 0,
        finalWinAmount: winAmount,
        payoutMultiplier: 1,
        bonusSteps: [],
      };
    }

    let accumulatedBonus = 0;
    let previousAmount = winAmount;

    const bonusSteps: HotStreakBonusStep[] =
      instances.map((instance) => {
        const config =
          instance.variant.config as HotStreakConfig;

        const bonusRate = config.winningsBonus;

        accumulatedBonus += bonusRate;

        // All bonuses use the same original
        // win amount. No compound percentages.

        const finalWinAmount = roundMoney(
          winAmount * (1 + accumulatedBonus),
        );

        const bonusAmount = roundMoney(
          finalWinAmount - previousAmount,
        );

        previousAmount = finalWinAmount;

        return {
          instanceId: instance.instanceId,
          rarity: instance.variant.rarity,
          percentage: Number(
            (bonusRate * 100).toFixed(4),
          ),
          bonusAmount,
          finalWinAmount,
        };
      });

    const finalWinAmount = previousAmount;

    return {
      triggered: true,
      baseWinAmount: winAmount,
      bonusAmount: roundMoney(
        finalWinAmount - winAmount,
      ),
      finalWinAmount,
      payoutMultiplier: Number(
        (1 + accumulatedBonus).toFixed(6),
      ),
      bonusSteps,
    };
  }

  isActive(): boolean {
    return this.activeThisFight;
  }

  resetFight(): void {
    this.activeThisFight = false;
  }

  
  getTotalWinningsBonus(): number {
    if (!this.activeThisFight) {
      return 0;
    }

    const instances =
      this.runPerkManager.getPerkInstances("hot_streak");

    const total = instances.reduce(
      (sum, instance) => {
        const config =
          instance.variant.config as HotStreakConfig;

        return sum + config.winningsBonus;
      },
      0,
    );

    return Number(total.toFixed(6));
  }

}
