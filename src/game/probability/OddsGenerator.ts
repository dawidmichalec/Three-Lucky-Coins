import {
    CoinOdds,
    DealerOddsProfile,
    OddsTable
} from "./OddsTypes";

export class OddsGenerator {

    static generate(
        profile: DealerOddsProfile
    ): OddsTable {

        switch (profile.complexity) {

            case "easy":
                return {
                    coin1: this.generateEasyCoinOdds(),
                    coin2: this.generateEasyCoinOdds(),
                    coin3: this.generateEasyCoinOdds()
                };

            case "medium":
                return {
                    coin1: this.generateMediumCoinOdds(),
                    coin2: this.generateMediumCoinOdds(),
                    coin3: this.generateMediumCoinOdds()
                };

            case "hard":
                return {
                    coin1: this.generateHardCoinOdds(),
                    coin2: this.generateHardCoinOdds(),
                    coin3: this.generateHardCoinOdds()
                };

            default:
                throw new Error(
                    `Unsupported odds complexity: ${profile.complexity}`
                );
        }
    }

    private static generateEasyCoinOdds(): CoinOdds {

        /*
            Celowo nie ma tutaj 50/50.

            Ben powinien dawać graczowi wyraźne,
            stosunkowo łatwe do odczytania szanse.
        */

        const possibleHeadsProbabilities = [
            0.10,
            0.20,
            0.30,
            0.70,
            0.80,
            0.90
        ];

        const randomIndex =
            Math.floor(
                Math.random() *
                possibleHeadsProbabilities.length
            );

        const heads =
            possibleHeadsProbabilities[randomIndex];

        return {
            heads,
            tails: 1 - heads
        };
    }

    private static generateMediumCoinOdds(): CoinOdds {

        const possibleHeadsProbabilities = [
            0.35,
            0.40,
            0.45,
            0.55,
            0.60,
            0.65
        ];

        const randomIndex =
            Math.floor(
                Math.random() *
                possibleHeadsProbabilities.length
            );

        const heads =
            possibleHeadsProbabilities[randomIndex];

        return {
            heads,
            tails: 1 - heads
        };
    }

    private static generateHardCoinOdds(): CoinOdds {

        const possibleHeadsProbabilities = [
            0.45,
            0.475,
            0.525,
            0.55
        ];

        const randomIndex =
            Math.floor(
                Math.random() *
                possibleHeadsProbabilities.length
            );

        const heads =
            possibleHeadsProbabilities[randomIndex];

        return {
            heads,
            tails: 1 - heads
        };
    }
}