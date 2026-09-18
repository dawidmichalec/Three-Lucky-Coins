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

  applyDynamicBetLock(
    playerBalance: number,
  ): void {
    if (
      !this.hasSkill(
        DealerSkillId.DYNAMIC_BET_LOCK,
      )
    ) {
      return;
    }

    this.blockedBets.clear();

    const affordableBets = BET_LEVELS.filter(
      (bet) => bet <= playerBalance,
    );

    if (affordableBets.length === 0) {
      return;
    }

    const candidates =
      affordableBets.filter(
        (bet) =>
          bet !== this.lastDynamicBetLock,
      );

    const pool =
      candidates.length > 0
        ? candidates
        : affordableBets;

    const selectedBet =
      pool[
        Math.floor(
          Math.random() * pool.length,
        )
      ];

    BET_LEVELS.forEach((bet) => {
      if (bet !== selectedBet) {
        this.blockBet(bet);
      }
    });

    this.lastDynamicBetLock = selectedBet;
  }

  applyBetSlotMalfunction(): void {
    if (
      !this.hasSkill(
        DealerSkillId.BET_SLOT_MALFUNCTION,
      )
    ) {
      return;
    }

    this.blockedBets.clear();

    const candidates = BET_LEVELS.filter(
      (bet) =>
        bet !== this.lastBetSlotMalfunctionBet,
    );

    const blockedBet =
      candidates[
        Math.floor(
          Math.random() * candidates.length,
        )
      ];

    this.blockBet(blockedBet);

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
    return !this.blockedBets.has(bet);
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
      this.reset();
    }
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
  }

  private hasSkill(skillId: DealerSkillId): boolean {
    return (
      this.currentDealer?.skills.some(
        (skill) => skill.id === skillId,
      ) ?? false
    );
  }
}