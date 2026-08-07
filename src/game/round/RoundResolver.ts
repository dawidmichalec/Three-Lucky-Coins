import {
    CoinSide
} from "../../ui/Coin";

import {
    getCombinationConfig
} from "../data/CombinationUtils";


export interface RoundResolution {

    win: boolean;

    winAmount?: number;
}


export interface RoundResolutionInput {

    selected:
        readonly CoinSide[];

    result:
        readonly CoinSide[];

    bet: number;

    streakMultiplier: number;

    goldenMultiplier: number;
}


export class RoundResolver {

    static resolve(
        input: RoundResolutionInput
    ): RoundResolution {

        const win =
            this.isWin(
                input.selected,
                input.result
            );


        if (!win) {

            return {
                win: false
            };
        }


        const combinationConfig =
            getCombinationConfig(
                input.selected
            );


        const winAmount =
            input.bet *
            combinationConfig.baseMultiplier *
            input.streakMultiplier *
            input.goldenMultiplier;


        return {

            win: true,

            winAmount
        };
    }


    private static isWin(
        selected:
            readonly CoinSide[],

        result:
            readonly CoinSide[]
    ): boolean {

        return selected.every(
            (side, index) =>
                side === result[index]
        );
    }
}