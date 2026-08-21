import { CoinSide } from "../ui/Coin";
import { StatsManager } from "../core/StatsManager";

export interface RoundStatsStartData {
  selected: readonly CoinSide[];
  bet: number;
}

export interface RoundStatsResultData {
  win: boolean;
  winAmount?: number;
  streakMultiplier: number;
}

interface PendingRoundStats {
  combo: string;
  bet: number;
}

export class RunStatsRecorder {
  private losingStreak = 0;
  private pendingRound?: PendingRoundStats;

  constructor(private statsManager: StatsManager) {}

  startRound(data: RoundStatsStartData) {
    const combo = data.selected.join("-");

    this.pendingRound = {
      combo,
      bet: data.bet,
    };

    this.statsManager.recordBet(data.bet);
    this.statsManager.recordCombination(combo);
  }

  finishRound(data: RoundStatsResultData) {
    const round = this.pendingRound;

    if (!round) {
      throw new Error("Cannot finish round stats before starting round stats.");
    }

    if (data.win) {
      this.losingStreak = 0;

      this.statsManager.recordSuccessfulBet();
      this.statsManager.recordWinningCombination(round.combo);

      if (data.winAmount !== undefined) {
        this.statsManager.recordWin(data.winAmount);
      }

      this.statsManager.recordWinStreak(data.streakMultiplier);
    } else {
      this.losingStreak++;

      this.statsManager.recordLoss(round.bet);
      this.statsManager.recordLoseStreak(this.losingStreak);
    }

    this.pendingRound = undefined;
  }
}
