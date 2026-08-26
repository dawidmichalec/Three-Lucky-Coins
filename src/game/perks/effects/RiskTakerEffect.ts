import { RunPerkManager } from "../RunPerkManager";
import { RiskTakerConfig } from "../data/RiskTaker";
import { roundMoney } from "../../util/MoneyUtils";

export interface RiskTakerResult {
  triggered: boolean;
  baseWinAmount: number;
  bonusAmount: number;
  finalWinAmount: number;
  payoutMultiplier: number;
}

export class RiskTakerEffect {
  constructor(
    private readonly runPerkManager: RunPerkManager,
  ) {}

  getPayoutMultiplier(
    currentBet: number,
    highestAffordableBet: number,
  ): number | undefined {
    const riskTaker =
      this.runPerkManager.getPerk("risk_taker");

    if (!riskTaker) {
      return undefined;
    }

    if (currentBet !== highestAffordableBet) {
      return undefined;
    }

    const config =
      riskTaker.variant.config as RiskTakerConfig;

    return config.payoutMultiplier;
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
      };
    }

    const finalWinAmount = roundMoney(
      winAmount * payoutMultiplier,
    );

    const bonusAmount = roundMoney(
      finalWinAmount - winAmount,
    );

    return {
      triggered: true,
      baseWinAmount: winAmount,
      bonusAmount,
      finalWinAmount,
      payoutMultiplier,
    };
  }
}