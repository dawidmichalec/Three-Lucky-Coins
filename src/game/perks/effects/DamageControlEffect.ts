import { RunPerkManager } from "../RunPerkManager";
import { DamageControlConfig } from "../data/DamageControl";
import { roundMoney } from "../../util/MoneyUtils";

export class DamageControlEffect {
    constructor(private readonly runPerkManager: RunPerkManager) { }

    reducePenalty(penalty: number, bet: number): number {
        const damageControl = this.runPerkManager.getPerk("damage_control");

        if (!damageControl) {
            return penalty;
        }

        const config = damageControl.variant.config as DamageControlConfig;
        const reductionAmount = bet * config.penaltyReduction;

        return roundMoney(Math.max(0, penalty - reductionAmount));
    }

    reducePenaltyPercentage(penaltyPercentage: number): number {
        const damageControl = this.runPerkManager.getPerk("damage_control");

        if (!damageControl) {
            return penaltyPercentage;
        }

        const config = damageControl.variant.config as DamageControlConfig;

        return Math.max(0, penaltyPercentage - config.penaltyReduction);
    }
}