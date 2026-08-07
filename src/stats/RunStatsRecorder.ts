import {
    CoinSide
} from "../ui/Coin";

import {
    StatsManager
} from "../core/StatsManager";


export interface RoundStatsData {

    selected:
        readonly CoinSide[];

    win:
        boolean;

    streakMultiplier:
        number;

    winAmount?:
        number;

    bet:
        number;
}


export class RunStatsRecorder {

    private losingStreak = 0;


    constructor(
        private statsManager:
            StatsManager
    ) {}


    recordRound(
        data: RoundStatsData
    ) {

        const combo =
            data.selected.join("-");


        /*
            BET
        */

        this.statsManager.recordBet(
            data.bet
        );


        /*
            COMBINATION USAGE
        */

        this.statsManager
            .recordCombination(
                combo
            );


        /*
            WIN
        */

        if (data.win) {

            this.losingStreak =
                0;


            this.statsManager
                .recordSuccessfulBet();


            this.statsManager
                .recordWinningCombination(
                    combo
                );


            if (
                data.winAmount !==
                undefined
            ) {

                this.statsManager
                    .recordWin(
                        data.winAmount
                    );
            }


            this.statsManager
                .recordWinStreak(
                    data.streakMultiplier
                );


            return;
        }


        /*
            LOSS
        */

        this.losingStreak++;


        this.statsManager.recordLoss(
            data.bet
        );


        this.statsManager
            .recordLoseStreak(
                this.losingStreak
            );
    }
}