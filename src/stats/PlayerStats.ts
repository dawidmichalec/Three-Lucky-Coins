export class PlayerStats {

    // RUNS

    runs = 0;

    runsWon = 0;

    runsLost = 0;

    // STREAKS

    bestWinStreak = 0;

    biggestLoseStreak = 0;

    // MONEY

    totalWon = 0;

    totalLost = 0;

    highestWin = 0;

    // BETS

    totalBets = 0;

    totalBetValue = 0;

    betUsage: Record<number, number> = {};

    successfulBets = 0;

    // PLAYTIME

    totalPlayTime = 0;

    sessionsPlayed = 0;

    fastestRun = Number.MAX_SAFE_INTEGER;

    // COINS

    totalCoinsTossed = 0;

    // COMBINATIONS

    combinationUsage: Record<string, number> = {};

    winningCombinationUsage: Record<string, number> = {};

}