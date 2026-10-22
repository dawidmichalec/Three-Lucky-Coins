
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
    if (!this.bonusActive) {
      return 0;
    }

    const instances =
      this.runPerkManager.getPerkInstances("bounce_back");

    if (instances.length === 0) {
      this.bonusActive = false;
      return 0;
    }

    const totalBonus = instances.reduce(
      (total, instance) => {
        const config =
          instance.variant.config as BounceBackConfig;

        return total + config.multiplierGrowthBonus;
      },
      0,
    );

    // Consume the entire stacked bonus at once.
    // Perk instances themselves remain active.

    this.bonusActive = false;

    return Math.round(totalBonus * 100) / 100;
  }

  resetFight(): void {
    this.bonusActive = false;
  }
}
