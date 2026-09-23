import { RunPerkManager } from "../RunPerkManager";
import { UnderdogConfig } from "../data/Underdog";

export class UnderdogEffect {
  constructor(private readonly runPerkManager: RunPerkManager) {}

  getWinningsBonus(currentBalance: number, startingBalance: number): number {
    const activePerk = this.runPerkManager.getPerk("underdog");

    if (!activePerk) {
      return 0;
    }

    const config = activePerk.variant.config as UnderdogConfig;
    const balanceRatio = currentBalance / startingBalance;

    if (balanceRatio < 0.25) {
      return config.criticalBalanceBonus;
    }

    if (balanceRatio <= 0.5) {
      return config.lowBalanceBonus;
    }

    return 0;
  }
}