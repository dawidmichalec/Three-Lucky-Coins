import { CoinSide } from "../../../ui/Coin";
import { GameUI } from "../../../ui/GameUI";
import { OddsManager } from "../../probability/OddsManager";
import { OddsTable } from "../../probability/OddsTypes";
import { PerkEffectApplier } from "../PerkEffectApplier";
import { PerkEffectMessageOverlay, PerkEffectMessageType, PerkMilestoneMessage } from "../../../ui/overlays/PerkEffectOverlay";
import { roundMoney } from "../../util/MoneyUtils";
import { GameController } from "../../GameController";
import { Player } from "../../Player";
import { StreakResolution } from "../../streak/StreakResolution";


export class PerkGameplayController {

  private doubleDownActivatedPending = false;
  private doubleDownWasActiveThisRound = false;

  constructor(
    private readonly perkEffectApplier: PerkEffectApplier,
    private readonly oddsManager: OddsManager,
    private readonly gameUI: GameUI,
    private readonly perkEffectMessageOverlay: PerkEffectMessageOverlay,
    private readonly gameController: GameController,
    private readonly player: Player,
  ) {}

  prepareNextRound(): void {
    const safetyNetResult = this.perkEffectApplier.getPreparedSafetyNetResult();

    if (safetyNetResult) {
      const revealedOdds: OddsTable = {
        coin1: this.createRevealedCoinOdds(safetyNetResult[0]),
        coin2: this.createRevealedCoinOdds(safetyNetResult[1]),
        coin3: this.createRevealedCoinOdds(safetyNetResult[2]),
      };

      this.gameUI.updateProbability(revealedOdds);

      console.log("SAFETY NET RESULT:", safetyNetResult.join("-"));

      return;
    }

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


  async handleLoss(
    streakResolution: StreakResolution,
  ): Promise<StreakResolution> {

    this.perkEffectApplier.resetDoubleDownProgress();

    this.doubleDownActivatedPending = false;

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

    const gamblerMultiplier = this.perkEffectApplier.activateGamblerAfterLoss();

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

    this.perkEffectApplier.activateBounceBackAfterLoss();

    return insuranceResult.streakResolution;
  }

  recordRoundResult(
    won: boolean,
  ): {
    luckyHandTriggered: boolean;
  } {
    const luckyHandTriggered =
      this.perkEffectApplier.recordLuckyHandToss(won);

    const doubleDownActivated =
      this.perkEffectApplier.recordDoubleDownSpinResult(
        won,
        this.doubleDownWasActiveThisRound,
      );

    this.doubleDownWasActiveThisRound = false;

    if (doubleDownActivated) {
      this.doubleDownActivatedPending = true;
    }

    this.perkEffectApplier
      .recordSafetyNetRoundResult(
        won,
      );

    return {
      luckyHandTriggered,
    };
  }

  async handleWinCommitted(): Promise<void> {
    if (!this.doubleDownActivatedPending) {
      return;
    }

    this.doubleDownActivatedPending = false;

    await this.perkEffectMessageOverlay.play(
      "nextSpinDoubleDown",
      "",
      PerkEffectMessageType.POSITIVE,
    );
  }

  async handleRoundStart(
    doubleDownActive: boolean,
  ): Promise<void> {
    this.doubleDownWasActiveThisRound =
      doubleDownActive;

    if (!doubleDownActive) {
      return;
    }

    await this.perkEffectMessageOverlay.play(
      "doubleDownActive",
      "",
      PerkEffectMessageType.POSITIVE,
    );
  }

  async tryRecoverFromInsufficientBalance(
    minimumBet: number,
  ): Promise<boolean> {
    const result =
      this.perkEffectApplier.applyPiggyBank(
        this.player.balance,
        minimumBet,
      );

    if (!result.triggered) {
      return false;
    }

    this.player.balance = result.finalBalance;

    this.gameUI.updateBalance(
      this.player.balance,
    );

    await this.perkEffectMessageOverlay.play(
      "piggyBankActivated",
      `+${result.amountGranted.toFixed(2)}`,
      PerkEffectMessageType.POSITIVE,
    );

    if (result.consumed) {
      await this.gameUI.removePerk(
        "piggy_bank",
      );
    }

    return true;
  }

  refreshBetState(): void {
    const bet = this.gameController.getBet();

    const isFree = this.perkEffectApplier.isCurrentBetFree(bet);

    this.gameUI.setFreeBetIndicator(isFree);
  }

  isCombinationBlocked(
    dealerBlocked: boolean,
  ): boolean {
    if (
      this.perkEffectApplier
        .preventsCombinationBlocking()
    ) {
      return false;
    }

    return dealerBlocked;
  }

  shouldApplyFixedCombinationLock(): boolean {
    return !this.perkEffectApplier
      .preventsCombinationBlocking();
  }

  shouldShowCombinationBlockingRule(): boolean {
    return !this.perkEffectApplier
      .preventsCombinationBlocking();
  }

  recordSafetyNetRoundResult(
    win: boolean,
  ): void {
    this.perkEffectApplier
      .recordSafetyNetRoundResult(
        win,
      );
  }

  isSafetyNetReady(): boolean {
    return this.perkEffectApplier
      .isSafetyNetReady();
  }

  consumeSafetyNet(): void {
    this.perkEffectApplier
      .consumeSafetyNet();
  }

  prepareSafetyNetResult(result: CoinSide[]): void {
    this.perkEffectApplier.prepareSafetyNetResult(result);
  }

  consumePreparedSafetyNetResult(): CoinSide[] | undefined {
    return this.perkEffectApplier.consumePreparedSafetyNetResult();
  }

  getPreparedSafetyNetResult(): CoinSide[] | undefined {
    return this.perkEffectApplier.getPreparedSafetyNetResult();
  }

  resetSafetyNet(): void {
    this.perkEffectApplier.resetSafetyNet();
  }

  getUnderdogWinningsBonus(currentBalance: number, startingBalance: number): number {
    return this.perkEffectApplier.getUnderdogWinningsBonus(currentBalance, startingBalance);
  }

  async handleMultiplierChanged(
    multiplier: number,
  ): Promise<void> {
    const hotStreakActivated =
      this.perkEffectApplier.tryActivateHotStreak(
        multiplier,
      );

    const onARollActivation =
      this.perkEffectApplier.tryActivateOnARoll(
        multiplier,
      );

    // Display a summary only when at least
    // one new activation or milestone occurred.

    if (
      !hotStreakActivated &&
      !onARollActivation.triggered
    ) {
      return;
    }

    const messages: PerkMilestoneMessage[] = [];

    const hotStreakBonus =
      this.perkEffectApplier
        .getHotStreakTotalWinningsBonus();

    if (hotStreakBonus > 0) {
      messages.push({
        name: "hotStreakName",
        multiplier: 5,
        bonusPercentage: Number(
          (hotStreakBonus * 100).toFixed(4),
        ),
        appliesFrom: hotStreakActivated
          ? "next"
          : "current",
      });
    }

    const onARollMilestone =
      this.perkEffectApplier
        .getOnARollUnlockedMilestone();

    if (onARollMilestone) {
      messages.push({
        name: "onARollName",
        multiplier: onARollMilestone.multiplier,
        bonusPercentage: Number(
          (
            onARollMilestone.winningsBonus * 100
          ).toFixed(4),
        ),
        appliesFrom: "current",
      });
    }

    await this.perkEffectMessageOverlay
      .playMilestoneSummary(messages);
  }
}