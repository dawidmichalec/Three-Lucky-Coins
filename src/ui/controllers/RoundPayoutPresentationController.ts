import { GameUI } from "../GameUI";
import { PerkEffectMessageOverlay, PerkEffectMessageType } from "../overlays/PerkEffectOverlay";
import type { CoinSenseResult } from "../../game/perks/effects/CoinSenseEffect";
import type { RiskTakerResult } from "../../game/perks/effects/RiskTakerEffect";
import type { GamblerResult } from "../../game/perks/effects/GamblerEffect";
import type { LuckyHandResult } from "../../game/perks/effects/LuckyHandEffect";
import { roundMoney } from "../../game/util/MoneyUtils";

export class RoundPayoutPresentationController {
  constructor(
    private gameUI: GameUI,
    private perkEffectMessageOverlay: PerkEffectMessageOverlay,
  ) {}

  async present(
    resolvedWinAmount: number,
    coinSenseResult: CoinSenseResult,
    riskTakerResult: RiskTakerResult,
    gamblerResult: GamblerResult,
    luckyHandResult: LuckyHandResult,
  ): Promise<void> {
    /*
        Najpierw pokazujemy wygraną po efektach dealera,
        ale przed perkami payoutowymi gracza.
    */

    this.gameUI.updateWon(resolvedWinAmount);

    /*
        COIN SENSE
    */

    if (coinSenseResult.triggered && coinSenseResult.bonusAmount < 0) {
      const reductionPercentage = roundMoney(
        (1 - coinSenseResult.payoutMultiplier) * 100,
      );

      await this.perkEffectMessageOverlay.play(
        "winningsReducedBy",
        `${reductionPercentage}%`,
        PerkEffectMessageType.NEGATIVE,
      );

      await this.gameUI.animatePenaltyIntoWon(
        Math.abs(coinSenseResult.bonusAmount),
        coinSenseResult.finalWinAmount,
      );
    }

    /*
        RISK TAKER
    */

    if (riskTakerResult.triggered && riskTakerResult.bonusAmount > 0) {
      await this.gameUI.animateBonusIntoWon(
        riskTakerResult.bonusAmount,
        riskTakerResult.finalWinAmount,
      );
    }

    /*
        GAMBLER
    */

    if (gamblerResult.triggered && gamblerResult.bonusAmount > 0) {
      await this.gameUI.animateBonusIntoWon(
        gamblerResult.bonusAmount,
        gamblerResult.finalWinAmount,
      );
    }

    /*
        LUCKY HAND
    */

    if (luckyHandResult.triggered && luckyHandResult.bonusAmount > 0) {
      await this.perkEffectMessageOverlay.play(
        "payoutDoubled",
        "",
        PerkEffectMessageType.POSITIVE,
      );

      await this.gameUI.animateBonusIntoWon(
        luckyHandResult.bonusAmount,
        luckyHandResult.finalWinAmount,
      );
    }
  }

  async presentBonus(
    bonusAmount: number,
    finalAmount: number,
  ): Promise<void> {
    if (bonusAmount <= 0) {
      return;
    }

    const baseAmount =
      roundMoney(finalAmount - bonusAmount);

    this.gameUI.updateWon(baseAmount);

    await this.gameUI.animateBonusIntoWon(
      bonusAmount,
      finalAmount,
    );
  }

  async presentDealerBonus(
    bonusAmount: number,
    finalAmount: number,
  ): Promise<void> {
    if (bonusAmount <= 0) {
      return;
    }

    await this.gameUI.animateBonusIntoWon(
      bonusAmount,
      finalAmount,
    );
  }
}