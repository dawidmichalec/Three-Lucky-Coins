import { BET_LEVELS } from "./data/BetLevels";
import { DealerData } from "./dealers/DealerData";
import { DealerSkillId } from "./dealers/DealerSkill";

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

  setDealer(
    dealer: DealerData,
    playerBalance: number,
  ): void {
    this.currentDealer = dealer;
    this.reset();

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

  setRuntimeSkills(skillIds: readonly DealerSkillId[]): void {
    const hadRuntimeBetIncreaseLock = this.runtimeSkills.has(DealerSkillId.BET_INCREASE_LOCK);
    const hadRuntimeBetDecreaseLock = this.runtimeSkills.has(DealerSkillId.BET_DECREASE_LOCK);

    this.runtimeSkills = new Set(skillIds);

    const hasRuntimeBetIncreaseLock = this.runtimeSkills.has(DealerSkillId.BET_INCREASE_LOCK);
    const hasRuntimeBetDecreaseLock = this.runtimeSkills.has(DealerSkillId.BET_DECREASE_LOCK);

    if (hasRuntimeBetIncreaseLock && !hadRuntimeBetIncreaseLock) {
      this.betIncreaseLocked = true;
      this.betIncreaseLockRoundsRemaining = 0;
    } else if (!this.hasSkill(DealerSkillId.BET_INCREASE_LOCK)) {
      this.betIncreaseLocked = false;
      this.betIncreaseLockRoundsRemaining = 0;
    }

    if (hasRuntimeBetDecreaseLock && !hadRuntimeBetDecreaseLock) {
      this.betDecreaseLocked = true;
      this.betDecreaseLockRoundsRemaining = 0;
    } else if (!this.hasSkill(DealerSkillId.BET_DECREASE_LOCK)) {
      this.betDecreaseLocked = false;
      this.betDecreaseLockRoundsRemaining = 0;
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
      return;
    }

    this.fixedBet =
      affordableBets[
        Math.floor(
          Math.random() * affordableBets.length,
        )
      ];

    BET_LEVELS.forEach((bet) => {
      if (bet !== this.fixedBet) {
        this.blockBet(bet);
      }
    });
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
    if (
      this.hasSkill(DealerSkillId.HIGH_STAKES) &&
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
  }

  private hasSkill(skillId: DealerSkillId): boolean {
    const hasDealerSkill =
      this.currentDealer?.skills.some(
        (skill) => skill.id === skillId,
      ) ?? false;

    return hasDealerSkill || this.runtimeSkills.has(skillId);
  }
}