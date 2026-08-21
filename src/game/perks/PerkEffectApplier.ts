import { PerkReward } from "./reward/PerkReward";
import { RunPerkManager } from "./RunPerkManager";
import { StreakMultiplierManager } from "../streak/StreakMultiplierManager";
import { roundMoney } from "../util/MoneyUtils";


interface MultiplierBoosterConfig {
    streakMultiplierIncrease: number;
}


interface CasinoBonusConfig {
    freeBetsPerFight: number;
    maximumFreeBet: number;
}

interface RiskTakerConfig {
    payoutMultiplier: number;
}


export interface RiskTakerResult {

    triggered: boolean;

    baseWinAmount: number;

    bonusAmount: number;

    finalWinAmount: number;

    payoutMultiplier: number;
}


export class PerkEffectApplier {

    private casinoBonusBetsPlacedThisFight = 0;


    constructor(
        private readonly runPerkManager:
            RunPerkManager,

        private readonly streakMultiplierManager:
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


    isCurrentBetFree(
        bet: number
    ): boolean {

        const casinoBonus =
            this.runPerkManager.getPerk(
                "casino_bonus"
            );


        if (!casinoBonus) {
            return false;
        }


        const config =
            casinoBonus.variant.config as
                CasinoBonusConfig;


        return (
            this.casinoBonusBetsPlacedThisFight <
                config.freeBetsPerFight
            &&
            bet <=
                config.maximumFreeBet
        );
    }


    resolveBetCost(
        bet: number
    ): number {

        if (
            this.isCurrentBetFree(
                bet
            )
        ) {
            return 0;
        }


        return bet;
    }


    recordBet(): void {

        const casinoBonus =
            this.runPerkManager.getPerk(
                "casino_bonus"
            );


        if (!casinoBonus) {
            return;
        }


        this.casinoBonusBetsPlacedThisFight++;
    }


    resetFightEffects(): void {

        this.casinoBonusBetsPlacedThisFight =
            0;
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


    getRiskTakerPayoutMultiplier(
        currentBet: number,
        highestAffordableBet: number
    ): number | undefined {

        const riskTaker =
            this.runPerkManager
                .getPerk(
                    "risk_taker"
                );


        if (!riskTaker) {
            return undefined;
        }


        if (
            currentBet !==
            highestAffordableBet
        ) {
            return undefined;
        }


        const config =
            riskTaker.variant.config as
                RiskTakerConfig;


        return config.payoutMultiplier;
    }


    applyRiskTaker(
        winAmount: number,
        currentBet: number,
        highestAffordableBet: number
    ): RiskTakerResult {

        const payoutMultiplier =
            this.getRiskTakerPayoutMultiplier(
                currentBet,
                highestAffordableBet
            );


        if (
            payoutMultiplier ===
            undefined
        ) {

            return {
                triggered: false,

                baseWinAmount:
                    winAmount,

                bonusAmount:
                    0,

                finalWinAmount:
                    winAmount,

                payoutMultiplier:
                    1
            };
        }


        const finalWinAmount =
            roundMoney(
                winAmount *
                payoutMultiplier
            );

        const bonusAmount =
            roundMoney(
                finalWinAmount -
                winAmount
            );


        return {
            triggered: true,

            baseWinAmount:
                winAmount,

            bonusAmount,

            finalWinAmount,

            payoutMultiplier
        };
    }


}