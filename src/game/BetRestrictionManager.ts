import { BET_LEVELS } from "./data/BetLevels";
import { DealerData } from "./dealers/DealerData";
import { DealerSkillId } from "./dealers/DealerSkill";

export class BetRestrictionManager {
  private blockedBets = new Set<number>();
  private currentDealer: DealerData | null = null;
  private fixedBet: number | null = null;
  private lastBetSlotMalfunctionBet: number | null = null;

  setDealer(
    dealer: DealerData,
    playerBalance: number,
  ): void {
    this.currentDealer = dealer;
    this.reset();

    if (this.hasSkill(DealerSkillId.FIXED_BET_LOCK)) {
      this.applyFixedBetLock(playerBalance);
    }
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
  }

  private hasSkill(skillId: DealerSkillId): boolean {
    return (
      this.currentDealer?.skills.some(
        (skill) => skill.id === skillId,
      ) ?? false
    );
  }
}