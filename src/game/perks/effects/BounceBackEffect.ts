import { RunPerkManager } from "../RunPerkManager";
import { BounceBackConfig } from "../data/BounceBack";

export class BounceBackEffect {
  private bonusActive = false;

  constructor(
    private readonly runPerkManager: RunPerkManager,
  ) {}

  activateAfterLoss(): void {
    const bounceBack =
      this.runPerkManager.getPerk("bounce_back");

    if (!bounceBack) {
      return;
    }

    this.bonusActive = true;
  }

  consumeOnMultiplierIncrease(): number {
    const bounceBack =
      this.runPerkManager.getPerk("bounce_back");

    if (!bounceBack || !this.bonusActive) {
      return 0;
    }

    const config =
      bounceBack.variant.config as BounceBackConfig;

    this.bonusActive = false;

    return config.multiplierGrowthBonus;
  }

  resetFight(): void {
    this.bonusActive = false;
  }
}