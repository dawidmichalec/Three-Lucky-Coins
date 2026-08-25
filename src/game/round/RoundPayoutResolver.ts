import {
    CoinSenseResult,
    GamblerResult,
    LuckyHandResult,
    PerkEffectApplier,
    RiskTakerResult
} from "../perks/PerkEffectApplier";


export interface RoundPayoutInput {

    winAmount: number;

    bet: number;

    highestAffordableBet: number;

    coinSenseActive: boolean;

    luckyHandTriggered: boolean;
}


export interface RoundPayoutResult {

    coinSenseResult:
        CoinSenseResult;

    riskTakerResult:
        RiskTakerResult;

    gamblerResult:
        GamblerResult;

    luckyHandResult:
        LuckyHandResult;

    finalWinAmount:
        number;
}


export class RoundPayoutResolver {

    constructor(
        private readonly perkEffectApplier:
            PerkEffectApplier
    ) {}


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


        return {
            coinSenseResult,

            riskTakerResult,

            gamblerResult,

            luckyHandResult,

            finalWinAmount:
                luckyHandResult
                    .finalWinAmount
        };
    }
}