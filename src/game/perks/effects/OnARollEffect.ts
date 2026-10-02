import { RunPerkManager } from "../RunPerkManager";
import { OnARollConfig, OnARollMilestone } from "../data/OnARoll";
import { roundMoney } from "../../util/MoneyUtils";

export interface OnARollActivationResult {
  triggered: boolean;
  milestone?: OnARollMilestone;
}

export interface OnARollResult {
  triggered: boolean;
  baseWinAmount: number;
  bonusAmount: number;
  finalWinAmount: number;
  payoutMultiplier: number;
}

export class OnARollEffect {
  private unlockedMultiplier = 0;

  constructor(private readonly runPerkManager: RunPerkManager) {}

  tryActivate(multiplier: number): OnARollActivationResult {
    const onARoll = this.runPerkManager.getPerk("on_a_roll");

    if (!onARoll) {
      return { triggered: false };
    }

    const config = onARoll.variant.config as OnARollConfig;

    const milestone = [...config.milestones]
      .reverse()
      .find(milestone =>
        multiplier >= milestone.multiplier &&
        milestone.multiplier > this.unlockedMultiplier
      );

    if (!milestone) {
      return { triggered: false };
    }

    this.unlockedMultiplier = milestone.multiplier;

    return {
      triggered: true,
      milestone,
    };
  }

  apply(winAmount: number): OnARollResult {
    const onARoll = this.runPerkManager.getPerk("on_a_roll");

    if (!onARoll || this.unlockedMultiplier === 0) {
      return {
        triggered: false,
        baseWinAmount: winAmount,
        bonusAmount: 0,
        finalWinAmount: winAmount,
        payoutMultiplier: 1,
      };
    }

    const config = onARoll.variant.config as OnARollConfig;

    const milestone = config.milestones.find(
      milestone => milestone.multiplier === this.unlockedMultiplier
    );

    if (!milestone) {
      return {
        triggered: false,
        baseWinAmount: winAmount,
        bonusAmount: 0,
        finalWinAmount: winAmount,
        payoutMultiplier: 1,
      };
    }

    const payoutMultiplier = 1 + milestone.winningsBonus;
    const finalWinAmount = roundMoney(winAmount * payoutMultiplier);
    const bonusAmount = roundMoney(finalWinAmount - winAmount);

    return {
      triggered: true,
      baseWinAmount: winAmount,
      bonusAmount,
      finalWinAmount,
      payoutMultiplier,
    };
  }

  resetFight(): void {
    this.unlockedMultiplier = 0;
  }
}