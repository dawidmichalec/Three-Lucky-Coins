import { CoinSide } from "../../../ui/Coin";
import { GameUI } from "../../../ui/GameUI";
import { OddsManager } from "../../probability/OddsManager";
import { OddsTable } from "../../probability/OddsTypes";
import { PerkEffectApplier } from "../PerkEffectApplier";

export class PerkGameplayController {
  constructor(
    private readonly perkEffectApplier: PerkEffectApplier,
    private readonly oddsManager: OddsManager,
    private readonly gameUI: GameUI,
  ) {}

  prepareNextRound(): void {
    if (!this.perkEffectApplier.isCoinSenseAvailable()) {
      return;
    }

    const result = this.oddsManager.rollResult();

    this.perkEffectApplier.prepareCoinSenseResult(result);

    const revealedOdds: OddsTable = {
      coin1: this.createRevealedCoinOdds(result[0]),
      coin2: this.createRevealedCoinOdds(result[1]),
      coin3: this.createRevealedCoinOdds(result[2]),
    };

    this.gameUI.updateProbability(revealedOdds);

    console.log("COIN SENSE RESULT:", result.join("-"));
  }

  private createRevealedCoinOdds(side: CoinSide) {
    return {
      heads: side === CoinSide.Heads ? 1 : 0,
      tails: side === CoinSide.Tails ? 1 : 0,
    };
  }
}