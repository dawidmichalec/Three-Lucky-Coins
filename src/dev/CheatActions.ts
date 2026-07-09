import { CoinSide } from "../ui/Coin";


export class CheatActions {

    static allHeadsWin(): CoinSide[] {

        return [
            CoinSide.Heads,
            CoinSide.Heads,
            CoinSide.Heads
        ];

    }


    static allTailsWin(): CoinSide[] {

        return [
            CoinSide.Tails,
            CoinSide.Tails,
            CoinSide.Tails
        ];

    }


    static notAllSameWin(): CoinSide[] {

        return [
            CoinSide.Heads,
            CoinSide.Heads,
            CoinSide.Tails
        ];

    }

}