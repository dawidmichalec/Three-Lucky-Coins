
import { RunPerkManager } from "../RunPerkManager";
import { GamblerConfig } from "../data/Gambler";
import { PerkRarity } from "../PerkRarity";
import { roundMoney } from "../../util/MoneyUtils";

export interface GamblerBonusStep {
  instanceId: string;
  rarity: PerkRarity;
  percentage: number;
  bonusAmount: number;
  finalWinAmount: number;
}

export interface GamblerResult {
  triggered: boolean;
  baseWinAmount: number;
  bonusAmount: number;
  finalWinAmount: number;
  payoutMultiplier: number;
  bonusSteps: readonly GamblerBonusStep[];
}

export class GamblerEffect {
  private bonusActive = false;

  constructor(
    private readonly runPerkManager: RunPerkManager,
  ) {}

  activateAfterLoss(): number | undefined {
    const instances =
      this.runPerkManager.getPerkInstances("gambler");

    if (instances.length === 0) {
      return undefined;
    }

    this.bonusActive = true;

    const totalBonus = instances.reduce(
      (total, instance) => {
        const config =
          instance.variant.config as GamblerConfig;

        return total + (config.payoutMultiplier - 1);
      },
      0,
    );

    return roundMoney(1 + totalBonus);
  }

  apply(winAmount: number): GamblerResult {
    const instances =
      this.runPerkManager.getPerkInstances("gambler");

    if (!this.bonusActive || instances.length === 0) {
      return {
        triggered: false,
        baseWinAmount: winAmount,
        bonusAmount: 0,
        finalWinAmount: winAmount,
        payoutMultiplier: 1,
        bonusSteps: [],
      };
    }

    let accumulatedBonus = 0;
    let previousAmount = winAmount;

    const bonusSteps: GamblerBonusStep[] =
      instances.map((instance) => {
        const config =
          instance.variant.config as GamblerConfig;

        const bonusRate =
          config.payoutMultiplier - 1;

        accumulatedBonus += bonusRate;

        // Every bonus is calculated from the
        // original win amount, not the previous step.

        const finalWinAmount = roundMoney(
          winAmount * (1 + accumulatedBonus),
        );

        const bonusAmount = roundMoney(
          finalWinAmount - previousAmount,
        );

        previousAmount = finalWinAmount;

        return {
          instanceId: instance.instanceId,
          rarity: instance.variant.rarity,
          percentage: roundMoney(bonusRate * 100),
          bonusAmount,
          finalWinAmount,
        };
      });

    const finalWinAmount = previousAmount;

    // The bonus is consumed only after a real win.
    // Perk instances remain active for later rounds.

    this.bonusActive = false;

    return {
      triggered: true,
      baseWinAmount: winAmount,
      bonusAmount: roundMoney(
        finalWinAmount - winAmount,
      ),
      finalWinAmount,
      payoutMultiplier: roundMoney(
        1 + accumulatedBonus,
      ),
      bonusSteps,
    };
  }

  resetFight(): void {
    this.bonusActive = false;
  }
}
