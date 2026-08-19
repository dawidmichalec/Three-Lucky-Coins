import { PerkReward } from "./reward/PerkReward";
import { StreakMultiplierManager } from "../streak/StreakMultiplierManager";


interface MultiplierBoosterConfig {
    streakMultiplierIncrease: number;
}


export class PerkEffectApplier {

    constructor(
        private streakMultiplierManager:
            StreakMultiplierManager
    ) {}


    applyPerk(
        reward: PerkReward
    ): void {

        switch (reward.perk.id) {

            case "multiplier_booster":

                this.applyMultiplierBooster(
                    reward
                );

                break;
        }
    }


    private applyMultiplierBooster(
        reward: PerkReward
    ): void {

        const config =
            reward.variant.config as
                MultiplierBoosterConfig;


        const increase =
            config.streakMultiplierIncrease;


        this.streakMultiplierManager
            .setBaseValue(
                1 + increase
            );


        this.streakMultiplierManager
            .setGrowthPerWin(
                1 + increase
            );


        this.streakMultiplierManager
            .reset();
    }
}