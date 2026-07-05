import { BET_LEVELS } from './BetLevels';
import { COMBINATIONS } from './CoinCombinations';

type ControllerConfig = {
  onBetChange: (bet: number) => void;
  onPopup: (msg: string) => void;
  onComboChange: (combo: string) => void;
};

export class GameController {
  private betIndex = 3;
  private comboIndex = 0;

  constructor(private config: ControllerConfig) {}

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

    this.config.onBetChange(bet);

    if (this.betIndex === 0) {
      this.config.onPopup('The minimum bet has been set');
    }

    if (this.betIndex === BET_LEVELS.length - 1) {
      this.config.onPopup('The maximum bet has been set');
    }
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
    return COMBINATIONS[index].join(' - ');
  }

  prevCombo() {
    this.comboIndex =
      (this.comboIndex - 1 + COMBINATIONS.length) % COMBINATIONS.length;

    this.config.onComboChange(this.formatCombo(this.comboIndex));
  }

  nextCombo() {
    this.comboIndex =
      (this.comboIndex + 1) % COMBINATIONS.length;

    this.config.onComboChange(this.formatCombo(this.comboIndex));
  }

  getCurrentCombo() {
    return COMBINATIONS[this.comboIndex];
  }

}