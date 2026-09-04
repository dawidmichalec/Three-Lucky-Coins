import { DealerData } from "./DealerData";
import { ObjectiveType } from "../objectives/ObjectiveTypes";
import { DealerSkillId } from "./DealerSkill";

export interface DealerFightState {
  targetBalance?: number;
  targetWins?: number;
  targetMultiplier?: number;
  targetGambleForMoreWins?: number;
}

export class DealerFightManager {
  private currentDealerIndex = 0;

  private fightStartingBalance = 0;
  private fightTargetBalance = 0;

  private fightWins = 0;
  private fightTargetWins = 0;

  private mandatoryTipWinCounter = 0;

  private multiplierKnockoutBlockedRounds = 0;

  private mandatoryGambleForMoreRoundCounter = 0;
  private mandatoryGambleForMorePending = false;

  private fightGambleForMoreWins = 0;
  private fightTargetGambleForMoreWins = 0;

  private skipNextMandatoryGambleForMoreRoundRecord = false;

  constructor(
    private readonly dealerOrder: readonly DealerData[],
  ) {
    if (dealerOrder.length === 0) {
      throw new Error(
        "DealerFightManager requires at least one dealer.",
      );
    }
  }

  getCurrentDealer(): DealerData {
    return this.dealerOrder[this.currentDealerIndex];
  }

  startFight(playerBalance: number): DealerFightState {
    const dealer = this.getCurrentDealer();

    this.fightStartingBalance = playerBalance;

    this.fightTargetBalance = 0;
    this.fightWins = 0;
    this.fightTargetWins = 0;
    this.mandatoryTipWinCounter = 0;

    this.multiplierKnockoutBlockedRounds = 3;

    this.mandatoryGambleForMoreRoundCounter = 0;
    this.mandatoryGambleForMorePending = false;

    this.fightGambleForMoreWins = 0;
    this.fightTargetGambleForMoreWins = 0;

    this.skipNextMandatoryGambleForMoreRoundRecord = false;

    switch (dealer.objectiveType) {
      case ObjectiveType.INCREASE_BALANCE:
        this.fightTargetBalance =
          this.fightStartingBalance +
          dealer.objectiveValue;

        return {
          targetBalance: this.fightTargetBalance,
        };

      case ObjectiveType.WIN_BETS:
        this.fightTargetWins =
          dealer.objectiveValue;

        return {
          targetWins: this.fightTargetWins,
        };

      case ObjectiveType.REACH_MULTIPLIER:
        return {
          targetMultiplier: dealer.objectiveValue,
        };

      case ObjectiveType.WIN_GAMBLE_FOR_MORE:
        this.fightTargetGambleForMoreWins =
          dealer.objectiveValue;

        return {};

      default:
        throw new Error(
          `Unsupported objective type: ${dealer.objectiveType}`,
        );
    }
  }

  recordGambleForMoreWin(): void {
    const dealer = this.getCurrentDealer();

    if (
      dealer.objectiveType !==
      ObjectiveType.WIN_GAMBLE_FOR_MORE
    ) {
      return;
    }

    this.fightGambleForMoreWins++;
  }

  recordMandatoryGambleForMoreRound(): void {
    const dealer = this.getCurrentDealer();

    const hasMandatoryGambleForMore =
      dealer.skills.some(
        (skill) =>
          skill.id ===
          DealerSkillId.MANDATORY_GAMBLE_FOR_MORE,
      );

    console.log(
      "MANDATORY GFM ROUND:",
      {
        dealer: dealer.name,
        hasSkill: hasMandatoryGambleForMore,
        counter: this.mandatoryGambleForMoreRoundCounter,
        pending: this.mandatoryGambleForMorePending,
      },
    );

    if (!hasMandatoryGambleForMore) {
      return;
    }

    if (this.skipNextMandatoryGambleForMoreRoundRecord) {
      this.skipNextMandatoryGambleForMoreRoundRecord = false;

      return;
    }

    if (this.mandatoryGambleForMorePending) {
      return;
    }

    this.mandatoryGambleForMoreRoundCounter++;

    if (
      this.mandatoryGambleForMoreRoundCounter >= 5
    ) {
      this.mandatoryGambleForMorePending = true;
    }
  }

  consumeMandatoryGambleForMore(): void {
    this.mandatoryGambleForMorePending = false;
    this.mandatoryGambleForMoreRoundCounter = 0;
    this.skipNextMandatoryGambleForMoreRoundRecord = true;
  }

  shouldTriggerMandatoryGambleForMore(): boolean {
    console.log(
      "CHECK MANDATORY GFM:",
      {
        counter: this.mandatoryGambleForMoreRoundCounter,
        pending: this.mandatoryGambleForMorePending,
      },
    );

    const dealer = this.getCurrentDealer();

    const hasMandatoryGambleForMore =
      dealer.skills.some(
        (skill) =>
          skill.id ===
          DealerSkillId.MANDATORY_GAMBLE_FOR_MORE,
      );

    if (!hasMandatoryGambleForMore) {
      return false;
    }

    if (this.mandatoryGambleForMorePending) {
      return true;
    }

    return (
      this.mandatoryGambleForMoreRoundCounter === 4
    );
  }

  recordWonBet(): void {
    const dealer = this.getCurrentDealer();

    if (
      dealer.objectiveType !==
      ObjectiveType.WIN_BETS
    ) {
      return;
    }

    this.fightWins++;
  }

  recordMandatoryTipWin(): boolean {
    const dealer = this.getCurrentDealer();

    const hasMandatoryTip = dealer.skills.some(
      (skill) =>
        skill.id ===
        DealerSkillId.MANDATORY_TIP,
    );

    if (!hasMandatoryTip) {
      return false;
    }

    this.mandatoryTipWinCounter++;

    if (this.mandatoryTipWinCounter < 3) {
      return false;
    }

    this.mandatoryTipWinCounter = 0;

    return true;
  }

  rollMultiplierKnockout(
    currentMultiplier: number,
  ): boolean {
    const dealer = this.getCurrentDealer();

    const skill = dealer.skills.find(
      (skill) =>
        skill.id === DealerSkillId.MULTIPLIER_KNOCKOUT,
    );

    if (!skill) {
      return false;
    }

    if (this.multiplierKnockoutBlockedRounds > 0) {
      this.multiplierKnockoutBlockedRounds--;

      return false;
    }

    if (currentMultiplier <= 1) {
      return false;
    }

    if (Math.random() >= (skill.triggerChance ?? 0)) {
      return false;
    }

    this.multiplierKnockoutBlockedRounds = 3;

    return true;
  }

  isCurrentDealerDefeated(
    playerBalance: number,
    currentMultiplier: number,
  ): boolean {
    const dealer = this.getCurrentDealer();

    switch (dealer.objectiveType) {
      case ObjectiveType.INCREASE_BALANCE:
        return (
          playerBalance >=
          this.fightTargetBalance
        );

      case ObjectiveType.WIN_BETS:
        return (
          this.fightWins >=
          this.fightTargetWins
        );

      case ObjectiveType.REACH_MULTIPLIER:
        return (
          currentMultiplier >=
          dealer.objectiveValue
        );

      case ObjectiveType.WIN_GAMBLE_FOR_MORE:
        return (
          this.fightGambleForMoreWins >=
          dealer.objectiveValue
        );

      default:
        console.warn(
          "Unsupported objective type:",
          dealer.objectiveType,
        );

        return false;
    }
  }

  advanceToNextDealer(): DealerData | null {
    const nextIndex =
      this.currentDealerIndex + 1;

    if (nextIndex >= this.dealerOrder.length) {
      return null;
    }

    this.currentDealerIndex = nextIndex;

    return this.getCurrentDealer();
  }

  getFightTargetBalance(): number {
    return this.fightTargetBalance;
  }

  getFightStartingBalance(): number {
    return this.fightStartingBalance;
  }

  getFightWins(): number {
    return this.fightWins;
  }

  getFightTargetWins(): number {
    return this.fightTargetWins;
  }

  getFightGambleForMoreWins(): number {
    return this.fightGambleForMoreWins;
  }

  getFightTargetGambleForMoreWins(): number {
    return this.fightTargetGambleForMoreWins;
  }
}