import { RunPerkManager } from "../RunPerkManager";
import { LuckyHandConfig } from "../data/LuckyHand";
import { roundMoney } from "../../util/MoneyUtils";

export interface LuckyHandResult {
  triggered: boolean;
  baseWinAmount: number;
  bonusAmount: number;
  finalWinAmount: number;
  payoutMultiplier: number;
}

export class LuckyHandEffect {
  private tossCount = 0;

  constructor(
    private readonly runPerkManager: RunPerkManager,
  ) {}

  recordToss(won: boolean): boolean {
    const luckyHand =
      this.runPerkManager.getPerk("lucky_hand");

    if (!luckyHand) {
      return false;
    }

    const config =
      luckyHand.variant.config as LuckyHandConfig;

    this.tossCount++;

    if (this.tossCount < config.triggerEvery) {
      return false;
    }

    /*
        Osiągnęliśmy wymagany toss.
        Cykl zaczyna się od nowa
        niezależnie od wyniku.
    */

    this.tossCount = 0;

    return won;
  }

  apply(
    winAmount: number,
    triggered: boolean,
  ): LuckyHandResult {
    const luckyHand =
      this.runPerkManager.getPerk("lucky_hand");

    if (!luckyHand || !triggered) {
      return {
        triggered: false,
        baseWinAmount: winAmount,
        bonusAmount: 0,
        finalWinAmount: winAmount,
        payoutMultiplier: 1,
      };
    }

    const config =
      luckyHand.variant.config as LuckyHandConfig;

    const finalWinAmount = roundMoney(
      winAmount * config.payoutMultiplier,
    );

    const bonusAmount = roundMoney(
      finalWinAmount - winAmount,
    );

    return {
      triggered: true,
      baseWinAmount: winAmount,
      bonusAmount,
      finalWinAmount,
      payoutMultiplier: config.payoutMultiplier,
    };
  }
}