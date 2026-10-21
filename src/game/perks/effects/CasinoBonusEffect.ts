
import { RunPerkManager } from "../RunPerkManager";
import { CasinoBonusConfig } from "../data/CasinoBonus";

export class CasinoBonusEffect {
  private betsPlacedThisFight = 0;

  constructor(
    private readonly runPerkManager: RunPerkManager,
  ) {}

  private getStackedConfig():
    CasinoBonusConfig | undefined {
    const instances =
      this.runPerkManager.getPerkInstances("casino_bonus");

    if (instances.length === 0) {
      return undefined;
    }

    const configs = instances.map(
      (instance) =>
        instance.variant.config as CasinoBonusConfig,
    );

    return {
      freeBetsPerFight: configs.reduce(
        (total, config) =>
          total + config.freeBetsPerFight,
        0,
      ),

      maximumFreeBet: Math.min(
        ...configs.map(
          (config) => config.maximumFreeBet,
        ),
      ),
    };
  }

  isCurrentBetFree(bet: number): boolean {
    const config = this.getStackedConfig();

    if (!config) {
      return false;
    }

    return (
      this.betsPlacedThisFight <
        config.freeBetsPerFight &&
      bet <= config.maximumFreeBet
    );
  }

  resolveBetCost(bet: number): number {
    return this.isCurrentBetFree(bet) ? 0 : bet;
  }

  recordBet(): void {
    if (!this.runPerkManager.hasPerk("casino_bonus")) {
      return;
    }

    this.betsPlacedThisFight++;
  }

  resetFight(): void {
    this.betsPlacedThisFight = 0;
  }
}
