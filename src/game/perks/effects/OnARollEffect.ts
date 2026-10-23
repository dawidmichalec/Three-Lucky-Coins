import { RunPerkManager } from "../RunPerkManager";
import {
  OnARollConfig,
  OnARollMilestone,
} from "../data/OnARoll";
import { PerkRarity } from "../PerkRarity";
import { roundMoney } from "../../util/MoneyUtils";

export interface OnARollActivationResult {
  triggered: boolean;
  milestone?: OnARollMilestone;
}

export interface OnARollBonusStep {
  instanceId: string;
  rarity: PerkRarity;
  percentage: number;
  bonusAmount: number;
  finalWinAmount: number;
}

export interface OnARollResult {
  triggered: boolean;
  baseWinAmount: number;
  bonusAmount: number;
  finalWinAmount: number;
  payoutMultiplier: number;
  bonusSteps: readonly OnARollBonusStep[];
}

export class OnARollEffect {
  private unlockedMultiplier = 0;

  constructor(
    private readonly runPerkManager: RunPerkManager,
  ) {}

  tryActivate(
    multiplier: number,
  ): OnARollActivationResult {
    const instances =
      this.runPerkManager.getPerkInstances("on_a_roll");

    if (instances.length === 0) {
      return { triggered: false };
    }

    // All rarities share the same milestone thresholds.
    // Select the highest newly reached threshold.

    const firstConfig =
      instances[0].variant.config as OnARollConfig;

    const milestone = [...firstConfig.milestones]
      .sort((a, b) => b.multiplier - a.multiplier)
      .find(
        (candidate) =>
          multiplier >= candidate.multiplier &&
          candidate.multiplier > this.unlockedMultiplier,
      );

    if (!milestone) {
      return { triggered: false };
    }

    this.unlockedMultiplier = milestone.multiplier;

    // The activation message should show
    // the COMBINED bonus for all instances.

    const totalWinningsBonus = instances.reduce(
      (total, instance) => {
        const config =
          instance.variant.config as OnARollConfig;

        const matchingMilestone =
          config.milestones.find(
            (item) =>
              item.multiplier === milestone.multiplier,
          );

        return total +
          (matchingMilestone?.winningsBonus ?? 0);
      },
      0,
    );

    return {
      triggered: true,
      milestone: {
        multiplier: milestone.multiplier,
        winningsBonus: Number(
          totalWinningsBonus.toFixed(6),
        ),
      },
    };
  }

  apply(winAmount: number): OnARollResult {
    const instances =
      this.runPerkManager.getPerkInstances("on_a_roll");

    if (
      instances.length === 0 ||
      this.unlockedMultiplier === 0
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

    const bonusSteps: OnARollBonusStep[] = [];

    for (const instance of instances) {
      const config =
        instance.variant.config as OnARollConfig;

      const milestone = config.milestones.find(
        (item) =>
          item.multiplier === this.unlockedMultiplier,
      );

      if (!milestone) {
        continue;
      }

      const bonusRate = milestone.winningsBonus;

      accumulatedBonus += bonusRate;

      // Each instance uses the ORIGINAL win amount.
      // The bonuses are additive, not compounded.

      const finalWinAmount = roundMoney(
        winAmount * (1 + accumulatedBonus),
      );

      const bonusAmount = roundMoney(
        finalWinAmount - previousAmount,
      );

      previousAmount = finalWinAmount;

      bonusSteps.push({
        instanceId: instance.instanceId,
        rarity: instance.variant.rarity,
        percentage: Number(
          (bonusRate * 100).toFixed(4),
        ),
        bonusAmount,
        finalWinAmount,
      });
    }

    if (bonusSteps.length === 0) {
      return {
        triggered: false,
        baseWinAmount: winAmount,
        bonusAmount: 0,
        finalWinAmount: winAmount,
        payoutMultiplier: 1,
        bonusSteps: [],
      };
    }

    return {
      triggered: true,
      baseWinAmount: winAmount,
      bonusAmount: roundMoney(
        previousAmount - winAmount,
      ),
      finalWinAmount: previousAmount,
      payoutMultiplier: Number(
        (1 + accumulatedBonus).toFixed(6),
      ),
      bonusSteps,
    };
  }

  resetFight(): void {
    this.unlockedMultiplier = 0;
  }
}
