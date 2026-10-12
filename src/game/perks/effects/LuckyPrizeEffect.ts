import { RunPerkManager } from "../RunPerkManager";
import {
  LuckyPrizeConfig,
  LUCKY_PRIZE_THRESHOLDS,
} from "../data/LuckyPrize";

export class LuckyPrizeEffect {
  private gambleForMoreWins = 0;

  constructor(
    private readonly runPerkManager: RunPerkManager,
  ) {}

  recordGambleForMoreWin(): boolean {
    if (!this.runPerkManager.getPerk("lucky_prize")) {
      return false;
    }

    const previousBonus = this.getMultiplierGrowthBonus();

    this.gambleForMoreWins++;

    return this.getMultiplierGrowthBonus() !== previousBonus;
  }

  getMultiplierGrowthBonus(): number {
    const luckyPrize = this.runPerkManager.getPerk("lucky_prize");

    if (!luckyPrize) {
      return 0;
    }

    const config = luckyPrize.variant.config as LuckyPrizeConfig;

    let multiplierGrowthBonus = 0;

    for (let i = 0; i < LUCKY_PRIZE_THRESHOLDS.length; i++) {
      if (this.gambleForMoreWins < LUCKY_PRIZE_THRESHOLDS[i]) {
        break;
      }

      multiplierGrowthBonus = config.multiplierGrowthBonuses[i];
    }

    return multiplierGrowthBonus;
  }

  resetFight(): void {
    this.gambleForMoreWins = 0;
  }
}