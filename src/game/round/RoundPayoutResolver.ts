import { PerkEffectApplier } from "../perks/PerkEffectApplier";
import { CoinSenseResult } from "../perks/effects/CoinSenseEffect";
import { RiskTakerResult } from "../perks/effects/RiskTakerEffect";
import { GamblerResult } from "../perks/effects/GamblerEffect";
import { LuckyHandResult } from "../perks/effects/LuckyHandEffect";
import { roundMoney } from "../util/MoneyUtils";
import { HotStreakResult } from "../perks/effects/HotStreakEffect";


export interface RoundPayoutInput {

    winAmount: number;
    bet: number;
    highestAffordableBet: number;
    coinSenseActive: boolean;
    luckyHandTriggered: boolean;
    currentBalance: number;
    fightStartingBalance: number;
}


export interface RoundPayoutResult {
    coinSenseResult: CoinSenseResult;
    riskTakerResult: RiskTakerResult;
    gamblerResult: GamblerResult;
    luckyHandResult: LuckyHandResult;
    hotStreakResult: HotStreakResult;
    underdogBonusAmount: number;
    finalWinAmount: number;
}


export class RoundPayoutResolver {

    constructor(
        private readonly perkEffectApplier:
            PerkEffectApplier
    ) {}

    resolveFinalWin(
        winAmount: number,
        mandatoryTipTriggered: boolean,
    ): number {
        if (!mandatoryTipTriggered) {
            return winAmount;
        }

        return roundMoney(
            winAmount * 0.5,
        );
    }


    resolve(
        input:
            RoundPayoutInput
    ): RoundPayoutResult {

        const coinSenseResult =
            this.perkEffectApplier
                .applyCoinSense(
                    input.winAmount,
                    input.coinSenseActive
                );


        const riskTakerResult =
            this.perkEffectApplier
                .applyRiskTaker(
                    coinSenseResult
                        .finalWinAmount,

                    input.bet,

                    input.highestAffordableBet
                );


        const gamblerResult =
            this.perkEffectApplier
                .applyGambler(
                    riskTakerResult
                        .finalWinAmount
                );


        const luckyHandResult =
            this.perkEffectApplier
                .applyLuckyHand(
                    gamblerResult
                        .finalWinAmount,

                    input.luckyHandTriggered
                );

        const hotStreakResult =
            this.perkEffectApplier
                .applyHotStreak(
                    luckyHandResult.finalWinAmount
                );

        const underdogBonus = this.perkEffectApplier.getUnderdogWinningsBonus(
            input.currentBalance,
            input.fightStartingBalance,
        );

        const underdogBonusAmount = roundMoney(
            hotStreakResult.finalWinAmount * underdogBonus
        );

        const finalWinAmount = roundMoney(
            hotStreakResult.finalWinAmount + underdogBonusAmount
        );

        return {
            coinSenseResult,
            riskTakerResult,
            gamblerResult,
            luckyHandResult,
            hotStreakResult,
            underdogBonusAmount,
            finalWinAmount
        };
    }
}