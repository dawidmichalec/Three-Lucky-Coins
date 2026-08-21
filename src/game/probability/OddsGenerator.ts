import { CoinOdds, DealerOddsProfile, OddsTable } from "./OddsTypes";

export class OddsGenerator {
  static generate(profile: DealerOddsProfile): OddsTable {
    return {
      coin1: this.generateCoinOdds(profile),

      coin2: this.generateCoinOdds(profile),

      coin3: this.generateCoinOdds(profile),
    };
  }

  private static generateCoinOdds(profile: DealerOddsProfile): CoinOdds {
    const probabilities = profile.headsProbabilities;

    if (probabilities.length === 0) {
      throw new Error("Dealer odds profile contains no probabilities.");
    }

    const randomIndex = Math.floor(Math.random() * probabilities.length);

    const heads = probabilities[randomIndex];

    return {
      heads,

      tails: 1 - heads,
    };
  }
}
