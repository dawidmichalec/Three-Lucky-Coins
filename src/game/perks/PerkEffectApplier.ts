import { PerkReward } from "./reward/PerkReward";
import { RunPerkManager } from "./RunPerkManager";
import { StreakMultiplierManager } from "../streak/StreakMultiplierManager";
import { roundMoney } from "../util/MoneyUtils";
import { StreakAction, StreakResolution } from "../streak/StreakResolution";


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

export interface InsuranceResult {
    triggered: boolean;
    streakResolution: StreakResolution;
}

interface GamblerConfig {
    payoutMultiplier: number;
}

interface DoubleDownConfig {
    requiredSuccessfulSpins: number;
    betMultiplier: number;
}


export interface RiskTakerResult {

    triggered: boolean;

    baseWinAmount: number;

    bonusAmount: number;

    finalWinAmount: number;

    payoutMultiplier: number;
}

export interface GamblerResult {
    triggered: boolean;

    baseWinAmount: number;

    bonusAmount: number;

    finalWinAmount: number;

    payoutMultiplier: number;
}


export class PerkEffectApplier {

    private casinoBonusBetsPlacedThisFight = 0;
    private gamblerBonusActive = false;
    private doubleDownSuccessfulSpins = 0;


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


    resolveLossStreakResolution(
        resolution: StreakResolution
    ): InsuranceResult {

        const insurance =
            this.runPerkManager.getPerk(
                "insurance"
            );


        if (
            !insurance ||
            resolution.action !==
                StreakAction.RESET
        ) {

            return {
                triggered: false,
                streakResolution:
                    resolution
            };
        }


        return {
            triggered: true,

            streakResolution: {
                action:
                    StreakAction.DECREASE,

                value:
                    1
            }
        };
    }


    activateGamblerAfterLoss():
    number | undefined {

        const gambler =
            this.runPerkManager
                .getPerk(
                    "gambler"
                );


        if (!gambler) {
            return undefined;
        }


        const config =
            gambler.variant.config as
                GamblerConfig;


        this.gamblerBonusActive =
            true;


        return config.payoutMultiplier;
    }


    applyGambler(
        winAmount: number
    ): GamblerResult {

        const gambler =
            this.runPerkManager
                .getPerk(
                    "gambler"
                );


        if (
            !gambler ||
            !this.gamblerBonusActive
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


        const config =
            gambler.variant.config as
                GamblerConfig;


        const finalWinAmount =
            roundMoney(
                winAmount *
                config.payoutMultiplier
            );


        const bonusAmount =
            roundMoney(
                finalWinAmount -
                winAmount
            );


        /*
            Konsumujemy bonus dopiero
            po faktycznej wygranej.
        */

        this.gamblerBonusActive =
            false;


        return {
            triggered: true,

            baseWinAmount:
                winAmount,

            bonusAmount,

            finalWinAmount,

            payoutMultiplier:
                config.payoutMultiplier
        };
    }


    isDoubleDownActive(): boolean {

        const doubleDown =
            this.runPerkManager.getPerk(
                "double_down"
            );


        if (!doubleDown) {
            return false;
        }


        const config =
            doubleDown.variant.config as
                DoubleDownConfig;


        return (
            this.doubleDownSuccessfulSpins >=
            config.requiredSuccessfulSpins
        );
    }


    resolvePayoutBet(
        bet: number
    ): number {

        const doubleDown =
            this.runPerkManager.getPerk(
                "double_down"
            );


        if (
            !doubleDown ||
            !this.isDoubleDownActive()
        ) {
            return bet;
        }


        const config =
            doubleDown.variant.config as
                DoubleDownConfig;


        return (
            bet *
            config.betMultiplier
        );
    }


    recordDoubleDownSpinResult(
        won: boolean,
        doubleDownWasActive: boolean
    ): boolean {

        const doubleDown =
            this.runPerkManager.getPerk(
                "double_down"
            );


        if (!doubleDown) {
            return false;
        }


        /*
            Jeżeli właśnie wykorzystaliśmy
            Double Down, zaczynamy progress
            od nowa.
        */

        if (
            doubleDownWasActive
        ) {

            this.doubleDownSuccessfulSpins =
                0;

            return false;
        }


        /*
            Przegrana przerywa serię.
        */

        if (!won) {

            this.doubleDownSuccessfulSpins =
                0;

            return false;
        }


        this.doubleDownSuccessfulSpins++;


        const config =
            doubleDown.variant.config as
                DoubleDownConfig;


        /*
            true TYLKO w rundzie,
            która właśnie uzbroiła Double Down.
        */

        return (
            this.doubleDownSuccessfulSpins ===
            config.requiredSuccessfulSpins
        );
    }


    
    resetDoubleDownProgress(): void {

        this.doubleDownSuccessfulSpins =
            0;
    }


}