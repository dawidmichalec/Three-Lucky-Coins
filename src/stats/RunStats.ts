export class RunStats {

    // STREAKS

    currentWinStreak = 0;
    bestWinStreak = 0;

    currentLoseStreak = 0;
    biggestLoseStreak = 0;

    // WINS

    highestWin = 0;
    totalWon = 0;
    totalLost = 0;

    wins = 0;
    losses = 0;

    // BETS

    totalBets = 0;

    totalBetValue = 0;

    betUsage: Record<number, number> = {};

    successfulBets = 0;

    // COMBINATIONS

    combinationUsage: Record<string, number> = {};

    winningCombinationUsage: Record<string, number> = {};

    // RUN

    startedAt = Date.now();

    finishedAt?: number;

    won = false;

}