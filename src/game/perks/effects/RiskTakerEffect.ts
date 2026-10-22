import { RunPerkManager } from "../RunPerkManager";
import { RiskTakerConfig } from "../data/RiskTaker";
import { PerkRarity } from "../PerkRarity";
import { roundMoney } from "../../util/MoneyUtils";

export interface RiskTakerBonusStep {
  instanceId: string;
  rarity: PerkRarity;
  percentage: number;
  bonusAmount: number;
  finalWinAmount: number;
}

export interface RiskTakerResult {
  triggered: boolean;
  baseWinAmount: number;
  bonusAmount: number;
  finalWinAmount: number;
  payoutMultiplier: number;
  bonusSteps: readonly RiskTakerBonusStep[];
}

export class RiskTakerEffect {
  constructor(
    private readonly runPerkManager: RunPerkManager,
  ) {}

  getPayoutMultiplier(
    currentBet: number,
    highestAffordableBet: number,
  ): number | undefined {
    const instances =
      this.runPerkManager.getPerkInstances("risk_taker");

    if (
      instances.length === 0 ||
      currentBet !== highestAffordableBet
    ) {
      return undefined;
    }

    const totalBonus = instances.reduce(
      (total, instance) => {
        const config =
          instance.variant.config as RiskTakerConfig;

        return total + (config.payoutMultiplier - 1);
      },
      0,
    );

    // Preserve fractional bonuses such as 12.5%.
    // roundMoney() would incorrectly round 1.125 to 1.13.

    return Number((1 + totalBonus).toFixed(6));
  }

  apply(
    winAmount: number,
    currentBet: number,
    highestAffordableBet: number,
  ): RiskTakerResult {
    const payoutMultiplier = this.getPayoutMultiplier(
      currentBet,
      highestAffordableBet,
    );

    if (payoutMultiplier === undefined) {
      return {
        triggered: false,
        baseWinAmount: winAmount,
        bonusAmount: 0,
        finalWinAmount: winAmount,
        payoutMultiplier: 1,
        bonusSteps: [],
      };
    }

    const instances =
      this.runPerkManager.getPerkInstances("risk_taker");

    let accumulatedBonus = 0;
    let previousAmount = winAmount;

    const bonusSteps: RiskTakerBonusStep[] =
      instances.map((instance) => {
        const config =
          instance.variant.config as RiskTakerConfig;

        const bonusRate =
          config.payoutMultiplier - 1;

        accumulatedBonus += bonusRate;

        // Calculate the cumulative payout from the
        // ORIGINAL win amount, not from previousAmount.

        const finalWinAmount = roundMoney(
          winAmount * (1 + accumulatedBonus),
        );

        // Difference between cumulative payout steps.
        // Their sum will equal the total payout bonus.

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
      payoutMultiplier,
      bonusSteps,
    };
  }
}
