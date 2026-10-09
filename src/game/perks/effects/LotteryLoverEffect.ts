import { RunPerkManager } from "../RunPerkManager";
import { LotteryLoverConfig } from "../data/LotteryLover";
import { roundMoney } from "../../util/MoneyUtils";

export interface LotteryLoverResult {
  triggered: boolean;
  baseWinAmount: number;
  bonusAmount: number;
  finalWinAmount: number;
}

export class LotteryLoverEffect {
  private gambleForMoreWins = 0;
  private activeThisFight = false;

  constructor(private readonly runPerkManager: RunPerkManager) {}

  recordGambleForMoreWin(): boolean {
    const lotteryLover = this.runPerkManager.getPerk("lottery_lover");

    if (!lotteryLover || this.activeThisFight) {
      return false;
    }

    const config = lotteryLover.variant.config as LotteryLoverConfig;

    this.gambleForMoreWins++;

    if (this.gambleForMoreWins < config.requiredWins) {
      return false;
    }

    this.activeThisFight = true;
    return true;
  }

  apply(winAmount: number): LotteryLoverResult {
    const lotteryLover = this.runPerkManager.getPerk("lottery_lover");

    if (!lotteryLover || !this.activeThisFight) {
      return {
        triggered: false,
        baseWinAmount: winAmount,
        bonusAmount: 0,
        finalWinAmount: winAmount,
      };
    }

    const config = lotteryLover.variant.config as LotteryLoverConfig;
    const bonusAmount = roundMoney(winAmount * config.winningsBonus);

    return {
      triggered: true,
      baseWinAmount: winAmount,
      bonusAmount,
      finalWinAmount: roundMoney(winAmount + bonusAmount),
    };
  }

  resetFight(): void {
    this.gambleForMoreWins = 0;
    this.activeThisFight = false;
  }
}