import { RunPerkManager } from "../RunPerkManager";
import { InsuranceConfig } from "../data/Insurance";
import { StreakAction, StreakResolution, } from "../../streak/StreakResolution";

export interface InsuranceResult {
  triggered: boolean;
  streakResolution: StreakResolution;
}

export class InsuranceEffect {
  constructor(
    private readonly runPerkManager: RunPerkManager,
  ) {}

  resolveLossStreakResolution(
    resolution: StreakResolution,
  ): InsuranceResult {
    const insurance =
      this.runPerkManager.getPerk("insurance");

    if (
      !insurance ||
      resolution.action !== StreakAction.RESET
    ) {
      return {
        triggered: false,
        streakResolution: resolution,
      };
    }

    const config =
      insurance.variant.config as InsuranceConfig;

    return {
      triggered: true,

      streakResolution: {
        action: StreakAction.DECREASE,
        value: config.streakReductionOnLoss,
      },
    };
  }
}