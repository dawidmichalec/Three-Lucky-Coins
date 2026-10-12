import { RunPerkManager } from "../RunPerkManager";
import { GoldenBoyConfig } from "../data/GoldenBoy";
import { roundMoney } from "../../util/MoneyUtils";

export interface GoldenBoyResult {
  triggered: boolean;
  baseWinAmount: number;
  bonusAmount: number;
  finalWinAmount: number;
}

export class GoldenBoyEffect {
  private goldenCoinsCollected = 0;

  constructor(
    private readonly runPerkManager: RunPerkManager,
  ) {}

  recordGoldenCoins(amount: number): void {
    if (!this.runPerkManager.getPerk("golden_boy")) {
      return;
    }

    this.goldenCoinsCollected += amount;
  }

  apply(winAmount: number): GoldenBoyResult {
    const goldenBoy = this.runPerkManager.getPerk("golden_boy");

    let winningsBonus = 0;

    if (goldenBoy && this.goldenCoinsCollected > 0) {
      const config =
        goldenBoy.variant.config as GoldenBoyConfig;

      const bonusIndex = Math.min(
        this.goldenCoinsCollected,
        config.winningsBonuses.length,
      ) - 1;

      winningsBonus = config.winningsBonuses[bonusIndex];
    }

    const bonusAmount = roundMoney(
      winAmount * winningsBonus,
    );

    return {
      triggered: winningsBonus > 0,
      baseWinAmount: winAmount,
      bonusAmount,
      finalWinAmount: roundMoney(
        winAmount + bonusAmount,
      ),
    };
  }

  resetFight(): void {
    this.goldenCoinsCollected = 0;
  }
}