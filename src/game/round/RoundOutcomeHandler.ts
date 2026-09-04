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
  currentDealer: DealerData;
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
    dealer: DealerData,
  ): WinModifierResult {
    const triggeredSkills: DealerSkillId[] = [];

    let finalWinAmount = winAmount;

    const doublePayoutSkill = dealer.skills.find(
      (skill) => skill.id === DealerSkillId.OOPS_I_PAID_YOU_TWICE,
    );

    if (doublePayoutSkill) {
      const triggerChance = doublePayoutSkill.triggerChance ?? 0;

      if (Math.random() < triggerChance) {
        finalWinAmount = roundMoney(finalWinAmount * 2);

        triggeredSkills.push(DealerSkillId.OOPS_I_PAID_YOU_TWICE);
      }
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
}
