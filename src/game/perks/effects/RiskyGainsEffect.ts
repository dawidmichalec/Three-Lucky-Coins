import { RunPerkManager } from "../RunPerkManager";
import {
  RiskyGainsConfig,
  RISKY_GAINS_THRESHOLDS,
} from "../data/RiskyGains";
import { roundMoney } from "../../util/MoneyUtils";

export interface RiskyGainsResult {
  triggered: boolean;
  baseWinAmount: number;
  bonusAmount: number;
  finalWinAmount: number;
}

export class RiskyGainsEffect {
  private gambleForMoreWins = 0;

  constructor(
    private readonly runPerkManager: RunPerkManager,
  ) {}

  recordGambleForMoreWin(): void {
    if (!this.runPerkManager.getPerk("risky_gains")) {
      return;
    }

    this.gambleForMoreWins++;
  }

  apply(winAmount: number): RiskyGainsResult {
    const riskyGains = this.runPerkManager.getPerk("risky_gains");

    let winningsBonus = 0;

    if (riskyGains) {
      const config = riskyGains.variant.config as RiskyGainsConfig;

      for (let i = 0; i < RISKY_GAINS_THRESHOLDS.length; i++) {
        if (this.gambleForMoreWins < RISKY_GAINS_THRESHOLDS[i]) {
          break;
        }

        winningsBonus = config.winningsBonuses[i];
      }
    }

    const bonusAmount = roundMoney(winAmount * winningsBonus);

    return {
      triggered: winningsBonus > 0,
      baseWinAmount: winAmount,
      bonusAmount,
      finalWinAmount: roundMoney(winAmount + bonusAmount),
    };
  }

  resetFight(): void {
    this.gambleForMoreWins = 0;
  }
}