
import { RunPerkManager } from "../RunPerkManager";
import { BounceBackConfig } from "../data/BounceBack";

export class BounceBackEffect {
  private bonusActive = false;

  constructor(
    private readonly runPerkManager: RunPerkManager,
  ) {}

  activateAfterLoss(): void {
    const instances =
      this.runPerkManager.getPerkInstances("bounce_back");

    if (instances.length === 0) {
      return;
    }

    // All Bounce Back instances become active
    // after the same loss.

    this.bonusActive = true;
  }

  consumeOnMultiplierIncrease(): number {
    const bonus = this.peekOnMultiplierIncrease();

    this.bonusActive = false;

    return bonus;
  }

  resetFight(): void {
    this.bonusActive = false;
  }

  
  peekOnMultiplierIncrease(): number {
    if (!this.bonusActive) {
      return 0;
    }

    const instances =
      this.runPerkManager.getPerkInstances("bounce_back");

    const totalBonus = instances.reduce(
      (total, instance) => {
        const config =
          instance.variant.config as BounceBackConfig;

        return total + config.multiplierGrowthBonus;
      },
      0,
    );

    return Math.round(totalBonus * 100) / 100;
  }

}
