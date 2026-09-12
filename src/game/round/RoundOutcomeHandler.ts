import { AudioManager } from "../../core/AudioManager";
import { SoundId } from "../../audio/SoundId";
import { DealerData } from "../dealers/DealerData";
import { DealerSkillId } from "../dealers/DealerSkill";
import { roundMoney } from "../util/MoneyUtils";
import { StreakAction, StreakResolution } from "../streak/StreakResolution";

export interface RoundOutcomeData {
  win: boolean;
  winAmount?: number;
  correctGuesses: number;
  bet: number;
  selectedBet: number;
  combination: readonly string[];
  currentDealer: DealerData;
  betterPayTriggered: boolean;
  switchItUpTriggered: boolean;
  patternBreakerBetCount: number;
  dejaVuCombinationCount: number;
}

export interface RoundOutcomeResult {
  wonAmount: number;
  triggeredSkills: DealerSkillId[];
  streakResolution: StreakResolution;
}

interface WinModifierResult {
  winAmount: number;
  triggeredSkills: DealerSkillId[];
}


export class RoundOutcomeHandler {
  private audioManager = AudioManager.getInstance();
  private varietyPaysWinningPairs = new Set<string>();
  private milestoneBonusPending = false;

  apply(data: RoundOutcomeData): RoundOutcomeResult {
    if (!data.win) {
      const partialLossPayout =
        this.applyPartialLossPayout(
          data.correctGuesses,
          data.bet,
          data.currentDealer,
        );

      return {
        wonAmount: partialLossPayout.winAmount,
        triggeredSkills:
          partialLossPayout.triggeredSkills,
        streakResolution: {
          action: StreakAction.RESET,
        },
      };
    }

    if (data.winAmount === undefined) {
      throw new Error("Winning round has no win amount.");
    }

    this.audioManager.play(SoundId.WIN, {
      loop: false,
      volume: 0.7,
    });

    const winModifierResult = this.applyWinModifiers(
      data.winAmount,
      data.selectedBet,
      data.combination,
      data.betterPayTriggered,
      data.switchItUpTriggered,
      data.patternBreakerBetCount,
      data.dejaVuCombinationCount,
      data.currentDealer,
    );

    return {
      wonAmount: winModifierResult.winAmount,

      triggeredSkills: winModifierResult.triggeredSkills,

      streakResolution: {
        action: StreakAction.INCREASE,

        growthModifier: this.getStreakMultiplierGrowth(data.currentDealer),
      },
    };
  }

  private applyWinModifiers(
    winAmount: number,
    bet: number,
    combination: readonly string[],
    betterPayTriggered: boolean,
    switchItUpTriggered: boolean,
    patternBreakerBetCount: number,
    dejaVuCombinationCount: number,
    dealer: DealerData,
  ): WinModifierResult {
    const triggeredSkills: DealerSkillId[] = [];

    let finalWinAmount = winAmount;

    const doublePayoutSkill = dealer.skills.find(
      (skill) =>
        skill.id ===
        DealerSkillId.OOPS_I_PAID_YOU_TWICE,
    );

    if (doublePayoutSkill) {
      const triggerChance =
        doublePayoutSkill.triggerChance ?? 0;

      if (Math.random() < triggerChance) {
        finalWinAmount = roundMoney(
          finalWinAmount * 2,
        );

        triggeredSkills.push(
          DealerSkillId.OOPS_I_PAID_YOU_TWICE,
        );
      }
    }

    const varietyPaysSkill = dealer.skills.find(
      (skill) =>
        skill.id === DealerSkillId.VARIETY_PAYS,
    );

    if (varietyPaysSkill) {
      const pairKey =
        `${bet}:${combination.join("-")}`;

      if (!this.varietyPaysWinningPairs.has(pairKey)) {
        this.varietyPaysWinningPairs.add(pairKey);

        finalWinAmount = roundMoney(
          finalWinAmount * 1.2,
        );

        triggeredSkills.push(
          DealerSkillId.VARIETY_PAYS,
        );
      }
    }

    const milestoneBonusSkill = dealer.skills.find(
      (skill) =>
        skill.id === DealerSkillId.MILESTONE_BONUS,
    );

    if (
      milestoneBonusSkill &&
      this.milestoneBonusPending
    ) {
      finalWinAmount = roundMoney(
        finalWinAmount * 1.2,
      );

      this.milestoneBonusPending = false;
    }

    const betterPaySkill = dealer.skills.find(
      (skill) =>
        skill.id ===
        DealerSkillId.BETTER_PAY_FOR_NOT_THE_SAME,
    );

    if (
      betterPaySkill &&
      betterPayTriggered
    ) {
      finalWinAmount = roundMoney(
        finalWinAmount * 1.05,
      );

      triggeredSkills.push(
        DealerSkillId.BETTER_PAY_FOR_NOT_THE_SAME,
      );
    }

    const switchItUpSkill = dealer.skills.find(
      (skill) =>
        skill.id === DealerSkillId.SWITCH_IT_UP,
    );

    if (
      switchItUpSkill &&
      switchItUpTriggered
    ) {
      finalWinAmount = roundMoney(
        finalWinAmount * 1.05,
      );

      triggeredSkills.push(
        DealerSkillId.SWITCH_IT_UP,
      );
    }

    const patternBreakerSkill =
      dealer.skills.find(
        (skill) =>
          skill.id ===
          DealerSkillId.PATTERN_BREAKER,
      );

    if (
      patternBreakerSkill &&
      patternBreakerBetCount >= 2
    ) {
      let reduction = 0;

      if (patternBreakerBetCount >= 5) {
        reduction = 0.5;
      } else if (patternBreakerBetCount === 4) {
        reduction = 0.4;
      } else if (patternBreakerBetCount === 3) {
        reduction = 0.3;
      } else {
        reduction = 0.2;
      }

      finalWinAmount = roundMoney(
        finalWinAmount * (1 - reduction),
      );

      triggeredSkills.push(
        DealerSkillId.PATTERN_BREAKER,
      );
    }

    const dejaVuSkill =
      dealer.skills.find(
        (skill) =>
          skill.id ===
          DealerSkillId.DEJA_VU,
      );

    if (
      dejaVuSkill &&
      dejaVuCombinationCount >= 2
    ) {
      let reduction = 0;

      if (dejaVuCombinationCount >= 5) {
        reduction = 0.5;
      } else if (
        dejaVuCombinationCount === 4
      ) {
        reduction = 0.4;
      } else if (
        dejaVuCombinationCount === 3
      ) {
        reduction = 0.3;
      } else {
        reduction = 0.2;
      }

      finalWinAmount = roundMoney(
        finalWinAmount * (1 - reduction),
      );

      triggeredSkills.push(
        DealerSkillId.DEJA_VU,
      );
    }

    return {
      winAmount: finalWinAmount,
      triggeredSkills,
    };
  }

  private applyPartialLossPayout(
    correctGuesses: number,
    bet: number,
    dealer: DealerData,
  ): WinModifierResult {
    const almostSkill = dealer.skills.find(
      (skill) => skill.id === DealerSkillId.ALMOST,
    );

    if (almostSkill) {
      if (correctGuesses === 1) {
        return {
          winAmount: roundMoney(bet * 0.25),
          triggeredSkills: [DealerSkillId.ALMOST],
        };
      }

      if (correctGuesses === 2) {
        return {
          winAmount: roundMoney(bet * 0.4),
          triggeredSkills: [DealerSkillId.ALMOST],
        };
      }
    }

    const closeEnoughSkill = dealer.skills.find(
      (skill) => skill.id === DealerSkillId.CLOSE_ENOUGH,
    );

    if (closeEnoughSkill) {
      if (correctGuesses === 1) {
        return {
          winAmount: roundMoney(bet * 0.1),
          triggeredSkills: [DealerSkillId.CLOSE_ENOUGH],
        };
      }

      if (correctGuesses === 2) {
        return {
          winAmount: roundMoney(bet * 0.3),
          triggeredSkills: [DealerSkillId.CLOSE_ENOUGH],
        };
      }
    }

    return {
      winAmount: 0,
      triggeredSkills: [],
    };
  }

  private getStreakMultiplierGrowth(dealer: DealerData): number {
    const hasSlowerMultiplierGrowth = dealer.skills.some(
      (skill) => skill.id === DealerSkillId.SLOWER_MULTIPLIER_GROWTH,
    );

    if (hasSlowerMultiplierGrowth) {
      return 0.5;
    }

    return 1;
  }

  resetDealerState(): void {
    this.varietyPaysWinningPairs.clear();
    this.milestoneBonusPending = false;
  }

  recordMultiplierMilestone(
    previousMultiplier: number,
    currentMultiplier: number,
    dealer: DealerData,
  ): boolean {
    const hasMilestoneBonus = dealer.skills.some(
      (skill) =>
        skill.id === DealerSkillId.MILESTONE_BONUS,
    );

    if (!hasMilestoneBonus) {
      return false;
    }

    const previousMilestone =
      Math.floor(previousMultiplier);

    const currentMilestone =
      Math.floor(currentMultiplier);

    if (
      currentMilestone >= 2 &&
      currentMilestone > previousMilestone
    ) {
      this.milestoneBonusPending = true;

      return true;
    }

    return false;
  }
}
