import { BET_LEVELS } from "./data/BetLevels";
import { DealerData } from "./dealers/DealerData";
import { DealerSkillId } from "./dealers/DealerSkill";

export class BetRestrictionManager {
  private blockedBets = new Set<number>();
  private currentDealer: DealerData | null = null;

  setDealer(dealer: DealerData): void {
    this.currentDealer = dealer;
    this.reset();
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
  }

  private hasSkill(skillId: DealerSkillId): boolean {
    return (
      this.currentDealer?.skills.some(
        (skill) => skill.id === skillId,
      ) ?? false
    );
  }
}