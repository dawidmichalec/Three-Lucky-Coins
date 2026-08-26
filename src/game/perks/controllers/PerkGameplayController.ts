import { CoinSide } from "../../../ui/Coin";
import { GameUI } from "../../../ui/GameUI";
import { OddsManager } from "../../probability/OddsManager";
import { OddsTable } from "../../probability/OddsTypes";
import { PerkEffectApplier } from "../PerkEffectApplier";
import { PerkEffectMessageOverlay, PerkEffectMessageType, } from "../../../ui/overlays/PerkEffectOverlay";
import { roundMoney } from "../../util/MoneyUtils";
import { GameController } from "../../GameController";
import { Player } from "../../Player";
import { StreakResolution } from "../../streak/StreakResolution";


export class PerkGameplayController {

  constructor(
    private readonly perkEffectApplier: PerkEffectApplier,
    private readonly oddsManager: OddsManager,
    private readonly gameUI: GameUI,
    private readonly perkEffectMessageOverlay: PerkEffectMessageOverlay,
    private readonly gameController: GameController,
    private readonly player: Player,
  ) {}

  prepareNextRound(): void {
    if (!this.perkEffectApplier.isCoinSenseAvailable()) {
      return;
    }

    const result = this.oddsManager.rollResult();

    this.perkEffectApplier.prepareCoinSenseResult(result);

    const revealedOdds: OddsTable = {
      coin1: this.createRevealedCoinOdds(result[0]),
      coin2: this.createRevealedCoinOdds(result[1]),
      coin3: this.createRevealedCoinOdds(result[2]),
    };

    this.gameUI.updateProbability(revealedOdds);

    console.log("COIN SENSE RESULT:", result.join("-"));
  }

  private createRevealedCoinOdds(side: CoinSide) {
    return {
      heads: side === CoinSide.Heads ? 1 : 0,
      tails: side === CoinSide.Tails ? 1 : 0,
    };
  }

  onBetChanged(bet: number): void {

    console.log("RISK TAKER BET CHANGE", {
      bet,
      balance: this.player.balance,
      highestAffordableBet:
        this.gameController.getHighestAffordableBet(
          this.player.balance,
        ),
      payoutMultiplier:
        this.perkEffectApplier.getRiskTakerPayoutMultiplier(
          bet,
          this.gameController.getHighestAffordableBet(
            this.player.balance,
          ),
        ),
    });

    const highestAffordableBet =
      this.gameController.getHighestAffordableBet(
        this.player.balance,
      );

    const payoutMultiplier =
      this.perkEffectApplier.getRiskTakerPayoutMultiplier(
        bet,
        highestAffordableBet,
      );

    if (payoutMultiplier === undefined) {
      return;
    }

    const increasePercentage = roundMoney(
      (payoutMultiplier - 1) * 100,
    );

    void this.perkEffectMessageOverlay.play(
      "winningsIncreasedBy",
      `${increasePercentage}%`,
      PerkEffectMessageType.POSITIVE,
    );
  }


  async handleLoss(
    streakResolution: StreakResolution,
  ): Promise<StreakResolution> {
    const insuranceResult =
      this.perkEffectApplier.resolveLossStreakResolution(
        streakResolution,
      );

    if (insuranceResult.triggered) {
      await this.perkEffectMessageOverlay.play(
        "streakMultiplierProtected",
        "",
        PerkEffectMessageType.POSITIVE,
      );
    }

    const gamblerMultiplier =
      this.perkEffectApplier.activateGamblerAfterLoss();

    if (gamblerMultiplier !== undefined) {
      const increasePercentage = roundMoney(
        (gamblerMultiplier - 1) * 100,
      );

      await this.perkEffectMessageOverlay.play(
        "nextWinIncreasedBy",
        `${increasePercentage}%`,
        PerkEffectMessageType.POSITIVE,
      );
    }

    return insuranceResult.streakResolution;
  }
}