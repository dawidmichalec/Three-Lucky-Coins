export interface CoinOdds {
    heads: number;
    tails: number;
}

export interface OddsTable {
    coin1: CoinOdds;
    coin2: CoinOdds;
    coin3: CoinOdds;
}

export enum OddsVisibility {
    EXACT,
    RANGE,
    WORDS,
    HIDDEN
}

export interface DealerOddsProfile {
    visibility: OddsVisibility;
    complexity: "easy" | "medium" | "hard";
}