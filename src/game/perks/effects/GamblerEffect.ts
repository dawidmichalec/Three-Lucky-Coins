import { RunPerkManager } from "../RunPerkManager";
import { GamblerConfig } from "../data/Gambler";
import { roundMoney } from "../../util/MoneyUtils";

export interface GamblerResult {
  triggered: boolean;
  baseWinAmount: number;
  bonusAmount: number;
  finalWinAmount: number;
  payoutMultiplier: number;
}

export class GamblerEffect {
  private bonusActive = false;

  constructor(
    private readonly runPerkManager: RunPerkManager,
  ) {}

  activateAfterLoss(): number | undefined {
    const gambler =
      this.runPerkManager.getPerk("gambler");

    if (!gambler) {
      return undefined;
    }

    const config =
      gambler.variant.config as GamblerConfig;

    this.bonusActive = true;

    return config.payoutMultiplier;
  }

  apply(winAmount: number): GamblerResult {
    const gambler =
      this.runPerkManager.getPerk("gambler");

    if (!gambler || !this.bonusActive) {
      return {
        triggered: false,
        baseWinAmount: winAmount,
        bonusAmount: 0,
        finalWinAmount: winAmount,
        payoutMultiplier: 1,
      };
    }

    const config =
      gambler.variant.config as GamblerConfig;

    const finalWinAmount = roundMoney(
      winAmount * config.payoutMultiplier,
    );

    const bonusAmount = roundMoney(
      finalWinAmount - winAmount,
    );

    /*
        Bonus konsumujemy dopiero
        przy faktycznej wygranej.
    */

    this.bonusActive = false;

    return {
      triggered: true,
      baseWinAmount: winAmount,
      bonusAmount,
      finalWinAmount,
      payoutMultiplier: config.payoutMultiplier,
    };
  }
}