import { RunPerkManager } from "../RunPerkManager";
import { GreedConfig } from "../data/Greed";
import { roundMoney } from "../../util/MoneyUtils";

export interface GreedResult {
  triggered: boolean;
  baseWinAmount: number;
  bonusAmount: number;
  finalWinAmount: number;
  payoutMultiplier: number;
}

export class GreedEffect {
  constructor(private readonly runPerkManager: RunPerkManager) {}

  apply(winAmount: number): GreedResult {
    const greed = this.runPerkManager.getPerk("greed");

    if (!greed) {
      return {
        triggered: false,
        baseWinAmount: winAmount,
        bonusAmount: 0,
        finalWinAmount: winAmount,
        payoutMultiplier: 1,
      };
    }

    const config = greed.variant.config as GreedConfig;
    const payoutMultiplier = 1 + config.winningsBonus;
    const finalWinAmount = roundMoney(winAmount * payoutMultiplier);
    const bonusAmount = roundMoney(finalWinAmount - winAmount);

    return {
      triggered: true,
      baseWinAmount: winAmount,
      bonusAmount,
      finalWinAmount,
      payoutMultiplier,
    };
  }

  getMultiplierGrowthReduction(): number {
    const greed = this.runPerkManager.getPerk("greed");

    if (!greed) {
      return 0;
    }

    const config = greed.variant.config as GreedConfig;

    return config.multiplierGrowthReduction;
  }
}