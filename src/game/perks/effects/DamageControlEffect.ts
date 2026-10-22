
import { RunPerkManager } from "../RunPerkManager";
import { DamageControlConfig } from "../data/DamageControl";
import { roundMoney } from "../../util/MoneyUtils";

export class DamageControlEffect {
  constructor(
    private readonly runPerkManager: RunPerkManager,
  ) {}

  private getTotalPenaltyReduction(): number {
    const instances =
      this.runPerkManager.getPerkInstances(
        "damage_control",
      );

    const totalReduction = instances.reduce(
      (total, instance) => {
        const config =
          instance.variant.config as DamageControlConfig;

        return total + config.penaltyReduction;
      },
      0,
    );

    return Number(totalReduction.toFixed(6));
  }

  reducePenalty(
    penalty: number,
    bet: number,
  ): number {
    const totalReduction =
      this.getTotalPenaltyReduction();

    if (totalReduction === 0) {
      return penalty;
    }

    const reductionAmount =
      bet * totalReduction;

    return roundMoney(
      Math.max(0, penalty - reductionAmount),
    );
  }

  reducePenaltyPercentage(
    penaltyPercentage: number,
  ): number {
    const totalReduction =
      this.getTotalPenaltyReduction();

    if (totalReduction === 0) {
      return penaltyPercentage;
    }

    return Math.max(
      0,
      Number(
        (
          penaltyPercentage - totalReduction
        ).toFixed(6),
      ),
    );
  }
}
