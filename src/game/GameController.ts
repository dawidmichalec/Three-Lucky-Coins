import { BET_LEVELS } from './BetLevels';

type ControllerConfig = {
  onBetChange: (bet: number) => void;
  onPopup: (msg: string) => void;
};

export class GameController {
  private betIndex = 3;

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
}