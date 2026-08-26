import { BET_LEVELS } from "./data/BetLevels";
import { COMBINATIONS } from "./data/CoinCombinations";

export enum BetChangeSource {
  PLAYER = "player",
  AUTO_ADJUST = "auto_adjust",
}


type ControllerConfig = {
  onBetChange: (
    bet: number,
    source: BetChangeSource,
  ) => void;

  onComboChange: (combo: string) => void;
};


export class GameController {
  private betIndex = 3;
  private comboIndex = 0;

  constructor(private config: ControllerConfig) {}

  adjustBetToBalance(balance: number): boolean {
    /*
          Jeżeli obecny bet nadal jest dostępny,
          niczego nie zmieniamy.
      */
    if (this.getBet() <= balance) {
      return false;
    }

    /*
          Szukamy najwyższego betu,
          który nie przekracza salda gracza.
      */
    let affordableBetIndex = -1;

    for (let index = BET_LEVELS.length - 1; index >= 0; index--) {
      if (BET_LEVELS[index] <= balance) {
        affordableBetIndex = index;

        break;
      }
    }

    /*
          Gracza nie stać nawet na minimalny bet.
          Nie zmieniamy indeksu — GameScene za chwilę
          uruchomi Game Over.
      */
    if (affordableBetIndex === -1) {
      return false;
    }

    this.betIndex = affordableBetIndex;

    this.config.onBetChange(
      this.getBet(),
      BetChangeSource.AUTO_ADJUST,
    );

    return true;
  }

  decreaseBet() {
    if (this.betIndex > 0) {
      this.betIndex--;
      this.syncBet();
    }
  }

  increaseBet() {
    if (this.betIndex < BET_LEVELS.length - 1) {
      this.betIndex++;
      this.syncBet();
    }
  }

  private syncBet() {
    const bet = BET_LEVELS[this.betIndex];

    this.config.onBetChange(
      bet,
      BetChangeSource.PLAYER,
    );
  }

  getBet() {
    return BET_LEVELS[this.betIndex];
  }

  getNextBet() {
    if (this.betIndex >= BET_LEVELS.length - 1) {
      return null;
    }

    return BET_LEVELS[this.betIndex + 1];
  }

  getMinBet(): number {
    return BET_LEVELS[0]; // albo jak masz strukturę
  }

  private formatCombo(index: number): string {
    return COMBINATIONS[index].join(" - ");
  }

  prevCombo() {
    this.comboIndex =
      (this.comboIndex - 1 + COMBINATIONS.length) % COMBINATIONS.length;

    this.config.onComboChange(this.formatCombo(this.comboIndex));
  }

  nextCombo() {
    this.comboIndex = (this.comboIndex + 1) % COMBINATIONS.length;

    this.config.onComboChange(this.formatCombo(this.comboIndex));
  }

  getCurrentCombo() {
    return COMBINATIONS[this.comboIndex];
  }

  getHighestAffordableBet(balance: number): number {
    for (let index = BET_LEVELS.length - 1; index >= 0; index--) {
      if (BET_LEVELS[index] <= balance) {
        return BET_LEVELS[index];
      }
    }

    return BET_LEVELS[0];
  }
}
