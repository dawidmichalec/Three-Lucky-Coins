import { BET_LEVELS } from "./data/BetLevels";
import { DealerData } from "./dealers/DealerData";
import { DealerSkillId } from "./dealers/DealerSkill";

export enum BetLimitationMode {
  LOW = "low",
  HIGH = "high",
}

export class BetRestrictionManager {
  private blockedBets = new Set<number>();
  private currentDealer: DealerData | null = null;
  private fixedBet: number | null = null;
  private lastBetSlotMalfunctionBet: number | null = null;
  private lastDynamicBetLock: number | null = null;
  private betIncreaseLocked = false;
  private betIncreaseLockRoundsRemaining = 0;
  private betDecreaseLocked = false;
  private betDecreaseLockRoundsRemaining = 0;
  private runtimeSkills = new Set<DealerSkillId>();
  private betSlotMalfunctionBlockedBet: number | null = null;
  private dynamicBetLockBet: number | null = null;
  private static readonly HIGH_STAKES_MIN_BET = 25;
  private betLimitationMode: BetLimitationMode | null = null;
  private static readonly LOW_STAKES_MAX_BET = 1;
  private betLimitationRoundsRemaining = 0;

  setDealer(
    dealer: DealerData,
    playerBalance: number,
  ): void {
    this.currentDealer = dealer;
    this.reset();

    if (this.hasSkill(DealerSkillId.BET_LIMITATION)) {
      this.startBetLimitationPhase(playerBalance);
    }

    if (this.hasSkill(DealerSkillId.FIXED_BET_LOCK)) {
      this.applyFixedBetLock(playerBalance);
    }

    if (
      this.hasSkill(
        DealerSkillId.BET_INCREASE_LOCK,
      )
    ) {
      this.startBetIncreaseNormalPhase();
    }

    if (
      this.hasSkill(
        DealerSkillId.BET_DECREASE_LOCK,
      )
    ) {
      this.startBetDecreaseNormalPhase();
    }
  }

  advanceBetLimitation(): boolean {
    if (!this.hasSkill(DealerSkillId.BET_LIMITATION)) {
      return false;
    }

    this.betLimitationRoundsRemaining--;

    if (this.betLimitationRoundsRemaining > 0) {
      return false;
    }

    this.betLimitationMode = this.betLimitationMode === BetLimitationMode.LOW
      ? BetLimitationMode.HIGH
      : BetLimitationMode.LOW;

    this.betLimitationRoundsRemaining = this.rollBetLimitationPhaseDuration();

    return true;
  }

  private startBetLimitationPhase(playerBalance: number): void {
    if (playerBalance < BetRestrictionManager.HIGH_STAKES_MIN_BET) {
      this.betLimitationMode = BetLimitationMode.LOW;
    } else {
      this.betLimitationMode = Math.random() < 0.5
        ? BetLimitationMode.LOW
        : BetLimitationMode.HIGH;
    }

    this.betLimitationRoundsRemaining = this.rollBetLimitationPhaseDuration();
  }

  private rollBetLimitationPhaseDuration(): number {
    return Math.floor(Math.random() * 3) + 2;
  }

  private startBetDecreaseNormalPhase(): void {
    this.betDecreaseLocked = false;

    this.betDecreaseLockRoundsRemaining =
      this.rollBetControlPhaseDuration();
  }

  private startBetDecreaseLockPhase(): void {
    this.betDecreaseLocked = true;

    this.betDecreaseLockRoundsRemaining =
      this.rollBetControlPhaseDuration();
  }

  
  setRuntimeSkills(
    skillIds: readonly DealerSkillId[],
    playerBalance?: number,
  ): void {
    const hadRuntimeBetIncreaseLock =
      this.runtimeSkills.has(DealerSkillId.BET_INCREASE_LOCK);

    const hadRuntimeBetDecreaseLock =
      this.runtimeSkills.has(DealerSkillId.BET_DECREASE_LOCK);

    const hadRuntimeFixedBetLock =
      this.runtimeSkills.has(DealerSkillId.FIXED_BET_LOCK);

    this.runtimeSkills = new Set(skillIds);

    const hasRuntimeBetIncreaseLock =
      this.runtimeSkills.has(DealerSkillId.BET_INCREASE_LOCK);

    const hasRuntimeBetDecreaseLock =
      this.runtimeSkills.has(DealerSkillId.BET_DECREASE_LOCK);

    const hasRuntimeFixedBetLock =
      this.runtimeSkills.has(DealerSkillId.FIXED_BET_LOCK);

    // BET INCREASE LOCK

    if (hasRuntimeBetIncreaseLock && !hadRuntimeBetIncreaseLock) {
      this.betIncreaseLocked = true;
      this.betIncreaseLockRoundsRemaining = 0;
    } else if (!this.hasSkill(DealerSkillId.BET_INCREASE_LOCK)) {
      this.betIncreaseLocked = false;
      this.betIncreaseLockRoundsRemaining = 0;
    }

    // BET DECREASE LOCK

    if (hasRuntimeBetDecreaseLock && !hadRuntimeBetDecreaseLock) {
      this.betDecreaseLocked = true;
      this.betDecreaseLockRoundsRemaining = 0;
    } else if (!this.hasSkill(DealerSkillId.BET_DECREASE_LOCK)) {
      this.betDecreaseLocked = false;
      this.betDecreaseLockRoundsRemaining = 0;
    }

    // FIXED BET LOCK

    if (hasRuntimeFixedBetLock && !hadRuntimeFixedBetLock) {
      if (playerBalance === undefined) {
        throw new Error(
          "Player balance is required to activate Fixed Bet Lock.",
        );
      }

      this.applyFixedBetLock(playerBalance);
    } else if (!this.hasSkill(DealerSkillId.FIXED_BET_LOCK)) {
      this.fixedBet = null;
    }
  }


  advanceBetDecreaseLock(): void {
    if (
      !this.hasSkill(
        DealerSkillId.BET_DECREASE_LOCK,
      )
    ) {
      return;
    }

    this.betDecreaseLockRoundsRemaining--;

    if (
      this.betDecreaseLockRoundsRemaining > 0
    ) {
      return;
    }

    if (this.betDecreaseLocked) {
      this.startBetDecreaseNormalPhase();

      return;
    }

    this.startBetDecreaseLockPhase();
  }

  isBetDecreaseLocked(): boolean {
    return this.betDecreaseLocked;
  }

  private startBetIncreaseNormalPhase(): void {
    this.betIncreaseLocked = false;

    this.betIncreaseLockRoundsRemaining = this.rollBetControlPhaseDuration();
  }

  private startBetIncreaseLockPhase(): void {
    this.betIncreaseLocked = true;

    this.betIncreaseLockRoundsRemaining = this.rollBetControlPhaseDuration();
  }

  advanceBetIncreaseLock(): void {
    if (
      !this.hasSkill(
        DealerSkillId.BET_INCREASE_LOCK,
      )
    ) {
      return;
    }

    this.betIncreaseLockRoundsRemaining--;

    if (
      this.betIncreaseLockRoundsRemaining > 0
    ) {
      return;
    }

    if (this.betIncreaseLocked) {
      this.startBetIncreaseNormalPhase();

      return;
    }

    this.startBetIncreaseLockPhase();
  }

  private rollBetControlPhaseDuration(): number {
    return Math.floor(Math.random() * 4) + 1;
  }

  isBetIncreaseLocked(): boolean {
    return this.betIncreaseLocked;
  }

  applyDynamicBetLock(playerBalance: number): void {
    if (!this.hasSkill(DealerSkillId.DYNAMIC_BET_LOCK)) {
      this.dynamicBetLockBet = null;
      return;
    }

    const affordableBets = BET_LEVELS.filter(
      (bet) => bet <= playerBalance && !this.blockedBets.has(bet),
    );

    if (affordableBets.length === 0) {
      this.dynamicBetLockBet = null;
      return;
    }

    const candidates = affordableBets.filter((bet) => bet !== this.lastDynamicBetLock);

    const pool = candidates.length > 0 ? candidates : affordableBets;

    const selectedBet = pool[Math.floor(Math.random() * pool.length)];

    this.dynamicBetLockBet = selectedBet;
    this.lastDynamicBetLock = selectedBet;
  }

  isDynamicBetLocked(): boolean {
    return this.dynamicBetLockBet !== null;
  }

  applyBetSlotMalfunction(playerBalance: number): void {
    if (!this.hasSkill(DealerSkillId.BET_SLOT_MALFUNCTION)) {
      this.betSlotMalfunctionBlockedBet = null;
      return;
    }

    const availableBets = BET_LEVELS.filter(
      (bet) => bet <= playerBalance && !this.blockedBets.has(bet),
    );

    const candidates = availableBets.filter(
      (bet) => bet !== this.lastBetSlotMalfunctionBet,
    );

    const pool = candidates.length > 0 ? candidates : availableBets;

    if (pool.length === 0) {
      this.betSlotMalfunctionBlockedBet = null;
      return;
    }

    const blockedBet = pool[Math.floor(Math.random() * pool.length)];

    this.betSlotMalfunctionBlockedBet = blockedBet;
    this.lastBetSlotMalfunctionBet = blockedBet;
  }

  
  private applyFixedBetLock(
    playerBalance: number,
  ): void {
    const affordableBets = BET_LEVELS.filter(
      (bet) => bet <= playerBalance,
    );

    if (affordableBets.length === 0) {
      this.fixedBet = null;
      return;
    }

    this.fixedBet = affordableBets[
      Math.floor(Math.random() * affordableBets.length)
    ];
  }


  getFixedBet(): number | null {
    return this.fixedBet;
  }

  blockBet(bet: number): void {
    this.blockedBets.add(bet);
  }

  unblockBet(bet: number): void {
    this.blockedBets.delete(bet);
  }

  isBetAvailable(bet: number): boolean {
    if (this.fixedBet !== null && bet !== this.fixedBet) {
      return false;
    }

    if (
      this.hasSkill(DealerSkillId.HIGH_STAKES) &&
      bet < BetRestrictionManager.HIGH_STAKES_MIN_BET
    ) {
      return false;
    }

    if (
      this.hasSkill(DealerSkillId.BET_LIMITATION) &&
      this.betLimitationMode === BetLimitationMode.LOW &&
      bet > BetRestrictionManager.LOW_STAKES_MAX_BET
    ) {
      return false;
    }

    if (
      this.hasSkill(DealerSkillId.BET_LIMITATION) &&
      this.betLimitationMode === BetLimitationMode.HIGH &&
      bet < BetRestrictionManager.HIGH_STAKES_MIN_BET
    ) {
      return false;
    }

    if (this.blockedBets.has(bet)) {
      return false;
    }

    if (bet === this.betSlotMalfunctionBlockedBet) {
      return false;
    }

    if (
      this.dynamicBetLockBet !== null &&
      bet !== this.dynamicBetLockBet
    ) {
      return false;
    }

    return true;
}

  getAvailableBets(): number[] {
    return BET_LEVELS.filter(
      (bet) => this.isBetAvailable(bet),
    );
  }

  recordBetUsed(bet: number): void {
    if (!this.hasSkill(DealerSkillId.NO_SAME_BETS)) {
      return;
    }

    this.blockBet(bet);

    if (this.blockedBets.size >= BET_LEVELS.length) {
      this.blockedBets.clear();
    }
  }

  hasNoSameBets(): boolean {
    return this.hasSkill(DealerSkillId.NO_SAME_BETS);
  }

  resetNoSameBetsCycle(): void {
    this.blockedBets.clear();
  }

  reset(): void {
    this.blockedBets.clear();
    this.fixedBet = null;
    this.lastBetSlotMalfunctionBet = null;
    this.lastDynamicBetLock = null;
    this.betIncreaseLocked = false;
    this.betIncreaseLockRoundsRemaining = 0;
    this.betDecreaseLocked = false;
    this.betDecreaseLockRoundsRemaining = 0;
    this.betSlotMalfunctionBlockedBet = null;
    this.dynamicBetLockBet = null;
    this.betLimitationMode = null;
    this.betLimitationRoundsRemaining = 0;
    this.runtimeSkills.clear();
  }

  private hasSkill(skillId: DealerSkillId): boolean {
    const hasDealerSkill =
      this.currentDealer?.skills.some(
        (skill) => skill.id === skillId,
      ) ?? false;

    return hasDealerSkill || this.runtimeSkills.has(skillId);
  }
}