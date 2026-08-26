import { RunPerkManager } from "../RunPerkManager";
import { DoubleDownConfig } from "../data/DoubleDown";

export class DoubleDownEffect {
  private successfulSpins = 0;

  constructor(
    private readonly runPerkManager: RunPerkManager,
  ) {}

  isActive(): boolean {
    const doubleDown =
      this.runPerkManager.getPerk("double_down");

    if (!doubleDown) {
      return false;
    }

    const config =
      doubleDown.variant.config as DoubleDownConfig;

    return (
      this.successfulSpins >=
      config.requiredSuccessfulSpins
    );
  }

  resolvePayoutBet(bet: number): number {
    const doubleDown =
      this.runPerkManager.getPerk("double_down");

    if (!doubleDown || !this.isActive()) {
      return bet;
    }

    const config =
      doubleDown.variant.config as DoubleDownConfig;

    return bet * config.betMultiplier;
  }

  recordSpinResult(
    won: boolean,
    wasActive: boolean,
  ): boolean {
    const doubleDown =
      this.runPerkManager.getPerk("double_down");

    if (!doubleDown) {
      return false;
    }

    /*
        Właśnie wykorzystaliśmy Double Down.
        Progress zaczyna się od nowa.
    */

    if (wasActive) {
      this.successfulSpins = 0;

      return false;
    }

    /*
        Przegrana przerywa serię.
    */

    if (!won) {
      this.successfulSpins = 0;

      return false;
    }

    this.successfulSpins++;

    const config =
      doubleDown.variant.config as DoubleDownConfig;

    /*
        true tylko w rundzie,
        która właśnie uzbroiła Double Down.
    */

    return (
      this.successfulSpins ===
      config.requiredSuccessfulSpins
    );
  }

  resetProgress(): void {
    this.successfulSpins = 0;
  }
}