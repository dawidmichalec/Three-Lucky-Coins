import { CoinSide } from "../../ui/Coin";

import { CoinOdds, DealerOddsProfile, OddsTable } from "./OddsTypes";

import { OddsGenerator } from "./OddsGenerator";

export class OddsManager {
  private static instance: OddsManager;

  private currentOdds?: OddsTable;

  static getInstance() {
    if (!OddsManager.instance) {
      OddsManager.instance = new OddsManager();
    }

    return OddsManager.instance;
  }

  private constructor() {}

  rollOdds(profile: DealerOddsProfile): OddsTable {
    this.currentOdds = OddsGenerator.generate(profile);

    return this.currentOdds;
  }

  getOdds(): OddsTable {
    if (!this.currentOdds) {
      throw new Error("Odds have not been generated yet.");
    }

    return this.currentOdds;
  }

  rollResult(): CoinSide[] {
    const odds = this.getOdds();

    return [
      this.rollCoin(odds.coin1),
      this.rollCoin(odds.coin2),
      this.rollCoin(odds.coin3),
    ];
  }

  private rollCoin(odds: CoinOdds): CoinSide {
    return Math.random() < odds.heads ? CoinSide.Heads : CoinSide.Tails;
  }

  setCoinOdds(
    index: 0 | 1 | 2,
    odds: CoinOdds,
  ): void {
    const currentOdds =
      this.getOdds();

    switch (index) {
      case 0:
        currentOdds.coin1 = odds;
        break;

      case 1:
        currentOdds.coin2 = odds;
        break;

      case 2:
        currentOdds.coin3 = odds;
        break;
    }
  }

  generateCoinOdds(
    profile: DealerOddsProfile,
  ): CoinOdds {
    return OddsGenerator.generateCoinOdds(
      profile,
    );
  }
}
