import { CoinSide } from "../../ui/Coin";
import { CombinationId } from "./CombinationId";

export type CoinCombination = readonly [
    CoinSide,
    CoinSide,
    CoinSide
];

export interface CombinationConfig {
    id: CombinationId;
    sides: CoinCombination;
    baseMultiplier: number;
}

export const COMBINATION_CONFIGS:
    Record<CombinationId, CombinationConfig> = {

    [CombinationId.HHH]: {
        id: CombinationId.HHH,
        sides: [
            CoinSide.Heads,
            CoinSide.Heads,
            CoinSide.Heads
        ],
        baseMultiplier: 1.3
    },

    [CombinationId.HHT]: {
        id: CombinationId.HHT,
        sides: [
            CoinSide.Heads,
            CoinSide.Heads,
            CoinSide.Tails
        ],
        baseMultiplier: 1.3
    },

    [CombinationId.HTH]: {
        id: CombinationId.HTH,
        sides: [
            CoinSide.Heads,
            CoinSide.Tails,
            CoinSide.Heads
        ],
        baseMultiplier: 1.3
    },

    [CombinationId.HTT]: {
        id: CombinationId.HTT,
        sides: [
            CoinSide.Heads,
            CoinSide.Tails,
            CoinSide.Tails
        ],
        baseMultiplier: 1.3
    },

    [CombinationId.THH]: {
        id: CombinationId.THH,
        sides: [
            CoinSide.Tails,
            CoinSide.Heads,
            CoinSide.Heads
        ],
        baseMultiplier: 1.3
    },

    [CombinationId.THT]: {
        id: CombinationId.THT,
        sides: [
            CoinSide.Tails,
            CoinSide.Heads,
            CoinSide.Tails
        ],
        baseMultiplier: 1.3
    },

    [CombinationId.TTH]: {
        id: CombinationId.TTH,
        sides: [
            CoinSide.Tails,
            CoinSide.Tails,
            CoinSide.Heads
        ],
        baseMultiplier: 1.3
    },

    [CombinationId.TTT]: {
        id: CombinationId.TTT,
        sides: [
            CoinSide.Tails,
            CoinSide.Tails,
            CoinSide.Tails
        ],
        baseMultiplier: 1.3
    }
};

export const COMBINATIONS =
    Object.values(COMBINATION_CONFIGS)
        .map(config => config.sides);