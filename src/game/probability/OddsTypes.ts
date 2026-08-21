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

  HIDDEN,
}

export interface DealerOddsProfile {
  /*
        Określa sposób prezentowania oddsów
        graczowi.

        Nie wpływa na samo generowanie wyniku.
    */
  visibility: OddsVisibility;

  /*
        Lista wartości, z których generator
        może losować probability Heads.

        Tails zawsze wynosi:
        1 - heads
    */
  headsProbabilities: readonly number[];
}
