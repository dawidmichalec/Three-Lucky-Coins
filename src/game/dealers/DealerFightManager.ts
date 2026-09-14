import { DealerData } from "./DealerData";
import { ObjectiveType } from "../objectives/ObjectiveTypes";
import { DealerSkillId } from "./DealerSkill";

export interface DealerFightState {
  targetBalance?: number;
  targetWins?: number;
  targetMultiplier?: number;
  targetGambleForMoreWins?: number;
  targetGoldenCoins?: number;
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

  private previousBet: number | null = null;
  private previousCombination: string | null = null;

  private previousKirkCombination: string | null = null;

  private fightGoldenCoins = 0;
  private fightTargetGoldenCoins = 0;

  private forcedDealer?: DealerData;

  private previousAndyCombination: string | null = null;

  private previousTracyBet: number | null = null;

  private previousCharlieBet: number | null = null;
  private previousCharlieCombination: string | null = null;

  private previousJessicaBet: number | null = null;
  private jessicaRepeatedBetCount = 0;

  private previousTedCombination: string | null = null;
  private tedRepeatedCombinationCount = 0;

  private delayedDecayRoundCounter = 0;
  private static readonly DELAYED_DECAY_GRACE_ROUNDS = 10;

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
    return (
      this.forcedDealer ??
      this.dealerOrder[
        this.currentDealerIndex
      ]
    );
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

    this.previousBet = null;
    this.previousCombination = null;

    this.previousKirkCombination = null;

    this.fightGoldenCoins = 0;
    this.fightTargetGoldenCoins = 0;

    this.previousAndyCombination = null;

    this.previousTracyBet = null;

    this.previousCharlieBet = null;
    this.previousCharlieCombination = null;

    this.previousJessicaBet = null; 
    this.jessicaRepeatedBetCount = 0;

    this.previousTedCombination = null;
    this.tedRepeatedCombinationCount = 0;

    this.delayedDecayRoundCounter = 0;

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

      case ObjectiveType.COLLECT_GOLDEN_COINS:
        this.fightTargetGoldenCoins =
          dealer.objectiveValue;

        return {
          targetGoldenCoins:
            this.fightTargetGoldenCoins,
        };

      default:
        throw new Error(
          `Unsupported objective type: ${dealer.objectiveType}`,
        );
    }
  }

  isDelayedDecayActive(): boolean {
    const dealer = this.getCurrentDealer();

    const hasDelayedDecay =
      dealer.skills.some(
        (skill) =>
          skill.id ===
          DealerSkillId.DELAYED_DECAY,
      );

    if (!hasDelayedDecay) {
      return false;
    }

    return (
      this.delayedDecayRoundCounter >=
      DealerFightManager.DELAYED_DECAY_GRACE_ROUNDS
    );
  }

  getDelayedDecayRoundsRemaining(): number | null {
    const dealer = this.getCurrentDealer();

    const hasDelayedDecay =
      dealer.skills.some(
        (skill) =>
          skill.id === DealerSkillId.DELAYED_DECAY,
      );

    if (!hasDelayedDecay) {
      return null;
    }

    return Math.max(
      0,
      DealerFightManager.DELAYED_DECAY_GRACE_ROUNDS -
        this.delayedDecayRoundCounter,
    );
  }

  recordDelayedDecayRound(): {
    remainingRounds: number;
    shouldDecay: boolean;
  } | null {
    const dealer = this.getCurrentDealer();

    const hasDelayedDecay =
      dealer.skills.some(
        (skill) =>
          skill.id === DealerSkillId.DELAYED_DECAY,
      );

    if (!hasDelayedDecay) {
      return null;
    }

    this.delayedDecayRoundCounter++;

    const remainingRounds = Math.max(
      0,
      DealerFightManager.DELAYED_DECAY_GRACE_ROUNDS -
        this.delayedDecayRoundCounter,
    );

    return {
      remainingRounds,
      shouldDecay:
        this.delayedDecayRoundCounter >
        DealerFightManager.DELAYED_DECAY_GRACE_ROUNDS,
    };
  }

  recordCombinationForDejaVu(
    combination: readonly string[],
  ): number {
    const dealer = this.getCurrentDealer();

    const hasDejaVu =
      dealer.skills.some(
        (skill) =>
          skill.id ===
          DealerSkillId.DEJA_VU,
      );

    if (!hasDejaVu) {
      return 0;
    }

    const combinationKey =
      combination.join("-");

    if (
      this.previousTedCombination ===
      combinationKey
    ) {
      this.tedRepeatedCombinationCount++;
    } else {
      this.tedRepeatedCombinationCount = 1;
    }

    this.previousTedCombination =
      combinationKey;

    return this.tedRepeatedCombinationCount;
  }

  recordBetForPatternBreaker(
    bet: number,
  ): number {
    const dealer = this.getCurrentDealer();

    const hasPatternBreaker =
      dealer.skills.some(
        (skill) =>
          skill.id ===
          DealerSkillId.PATTERN_BREAKER,
      );

    if (!hasPatternBreaker) {
      return 0;
    }

    if (this.previousJessicaBet === bet) {
      this.jessicaRepeatedBetCount++;
    } else {
      this.jessicaRepeatedBetCount = 1;
    }

    this.previousJessicaBet = bet;

    return this.jessicaRepeatedBetCount;
  }

  recordSetupForHabitBreaker(
    bet: number,
    combination: readonly string[],
  ): boolean {
    const dealer = this.getCurrentDealer();

    const hasHabitBreaker = dealer.skills.some(
      (skill) =>
        skill.id === DealerSkillId.HABIT_BREAKER,
    );

    if (!hasHabitBreaker) {
      return false;
    }

    const combinationKey =
      combination.join("-");

    const repeatedSetup =
      this.previousCharlieBet === bet &&
      this.previousCharlieCombination ===
        combinationKey;

    this.previousCharlieBet = bet;
    this.previousCharlieCombination =
      combinationKey;

    return repeatedSetup;
  }

  recordBetForSwitchItUp(
    bet: number,
  ): boolean {
    const dealer = this.getCurrentDealer();

    const hasSwitchItUp = dealer.skills.some(
      (skill) =>
        skill.id === DealerSkillId.SWITCH_IT_UP,
    );

    if (!hasSwitchItUp) {
      return false;
    }

    const changedBet =
      this.previousTracyBet !== null &&
      this.previousTracyBet !== bet;

    this.previousTracyBet = bet;

    return changedBet;
  }

  recordCombinationForBetterPay(
    combination: readonly string[],
  ): boolean {
    const dealer = this.getCurrentDealer();

    const hasBetterPay = dealer.skills.some(
      (skill) =>
        skill.id ===
        DealerSkillId.BETTER_PAY_FOR_NOT_THE_SAME,
    );

    if (!hasBetterPay) {
      return false;
    }

    const combinationKey = combination.join("-");

    const changedCombination =
      this.previousAndyCombination !== null &&
      this.previousAndyCombination !== combinationKey;

    this.previousAndyCombination = combinationKey;

    return changedCombination;
  }

  resolveHouseCut(
    bet: number,
  ): {
    amount: number;
    skillId?: DealerSkillId;
  } {
    const dealer = this.getCurrentDealer();

    const skill = dealer.skills.find(
      (skill) =>
        skill.id === DealerSkillId.SMALL_HOUSE_CUT ||
        skill.id === DealerSkillId.HOUSE_CUT,
    );

    if (!skill) {
      return {
        amount: 0,
      };
    }

    const cutPercentage =
      skill.id === DealerSkillId.HOUSE_CUT
        ? 0.5
        : 0.25;

    return {
      amount: bet * cutPercentage,
      skillId: skill.id,
    };
  }

  recordGoldenCoins(amount: number): void {
    const dealer = this.getCurrentDealer();

    if (
      dealer.objectiveType !==
      ObjectiveType.COLLECT_GOLDEN_COINS
    ) {
      return;
    }

    this.fightGoldenCoins += amount;
  }

  recordCombinationForNoDuplicates(
    combination: readonly string[],
  ): boolean {
    const dealer = this.getCurrentDealer();

    const hasNoDuplicates = dealer.skills.some(
      (skill) =>
        skill.id === DealerSkillId.NO_DUPLICATES,
    );

    if (!hasNoDuplicates) {
      return false;
    }

    const combinationKey =
      combination.join("-");

    const repeated =
      this.previousKirkCombination === combinationKey;

    this.previousKirkCombination =
      combinationKey;

    return repeated;
  }

  recordCombinationForNoRepeats(
    combination: readonly string[],
  ): boolean {
    const dealer = this.getCurrentDealer();

    const hasNoRepeats = dealer.skills.some(
      (skill) =>
        skill.id === DealerSkillId.NO_REPEATS,
    );

    if (!hasNoRepeats) {
      return false;
    }

    const combinationKey = combination.join("-");

    const repeatedCombination =
      this.previousCombination === combinationKey;

    this.previousCombination = combinationKey;

    return repeatedCombination;
  }

  recordBetForVariety(bet: number): boolean {
    const dealer = this.getCurrentDealer();

    const hasBetVariety = dealer.skills.some(
      (skill) =>
        skill.id === DealerSkillId.BET_VARIETY,
    );

    if (!hasBetVariety) {
      return false;
    }

    const repeatedBet =
      this.previousBet === bet;

    this.previousBet = bet;

    return repeatedBet;
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

      case ObjectiveType.COLLECT_GOLDEN_COINS:
        return (
          this.fightGoldenCoins >=
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

  forceCurrentDealer(
    dealer: DealerData,
  ): void {
    this.forcedDealer = dealer;
  }

  advanceToNextDealer(): DealerData | null {
    this.forcedDealer = undefined;

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

  getFightGoldenCoins(): number {
    return this.fightGoldenCoins;
  }

  getFightTargetGoldenCoins(): number {
    return this.fightTargetGoldenCoins;
  }
}