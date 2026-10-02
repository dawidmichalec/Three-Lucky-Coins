import { RunPerkManager } from "../RunPerkManager";
import { HotStreakConfig } from "../data/HotStreak";
import { roundMoney } from "../../util/MoneyUtils";

export interface HotStreakResult {
  triggered: boolean;
  baseWinAmount: number;
  bonusAmount: number;
  finalWinAmount: number;
  payoutMultiplier: number;
}

export class HotStreakEffect {
  private activeThisFight = false;

  constructor(private readonly runPerkManager: RunPerkManager) {}

  tryActivate(multiplier: number): boolean {
    if (this.activeThisFight) {
      return false;
    }

    const hotStreak = this.runPerkManager.getPerk("hot_streak");

    if (!hotStreak) {
      return false;
    }

    const config = hotStreak.variant.config as HotStreakConfig;

    if (multiplier < config.requiredMultiplier) {
      return false;
    }

    this.activeThisFight = true;

    return true;
  }

  apply(winAmount: number): HotStreakResult {
    const hotStreak = this.runPerkManager.getPerk("hot_streak");

    if (!hotStreak || !this.activeThisFight) {
      return {
        triggered: false,
        baseWinAmount: winAmount,
        bonusAmount: 0,
        finalWinAmount: winAmount,
        payoutMultiplier: 1,
      };
    }

    const config = hotStreak.variant.config as HotStreakConfig;
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

  isActive(): boolean {
    return this.activeThisFight;
  }

  resetFight(): void {
    this.activeThisFight = false;
  }
}