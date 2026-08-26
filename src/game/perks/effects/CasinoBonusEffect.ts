import { RunPerkManager } from "../RunPerkManager";
import { CasinoBonusConfig } from "../data/CasinoBonus";

export class CasinoBonusEffect {
  private betsPlacedThisFight = 0;

  constructor(
    private readonly runPerkManager: RunPerkManager,
  ) {}

  isCurrentBetFree(bet: number): boolean {
    const casinoBonus =
      this.runPerkManager.getPerk("casino_bonus");

    if (!casinoBonus) {
      return false;
    }

    const config =
      casinoBonus.variant.config as CasinoBonusConfig;

    return (
      this.betsPlacedThisFight <
        config.freeBetsPerFight &&
      bet <= config.maximumFreeBet
    );
  }

  resolveBetCost(bet: number): number {
    if (this.isCurrentBetFree(bet)) {
      return 0;
    }

    return bet;
  }

  recordBet(): void {
    const casinoBonus =
      this.runPerkManager.getPerk("casino_bonus");

    if (!casinoBonus) {
      return;
    }

    this.betsPlacedThisFight++;
  }

  resetFight(): void {
    this.betsPlacedThisFight = 0;
  }
}