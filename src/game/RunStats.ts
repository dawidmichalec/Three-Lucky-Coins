export class RunStats {
    runs = 1;

    currentStreak = 0;
    bestStreak = 0;

    highestWin = 0;

    totalBets = 0;

    combinationUsage: Record<string, number> = {};
    winningCombinationUsage: Record<string, number> = {};

    recordWin(amount: number) {
        this.highestWin = Math.max(this.highestWin, amount);
    }

    recordStreak(streak: number) {
        this.bestStreak = Math.max(this.bestStreak, streak);
    }

    recordCombination(combo: string) {
        this.combinationUsage[combo] =
            (this.combinationUsage[combo] || 0) + 1;
    }

    getMostUsedCombination(): string | null {
        let mostUsed: string | null = null;
        let highestCount = 0;

        for (const combo in this.combinationUsage) {
            if (this.combinationUsage[combo] > highestCount) {
                highestCount = this.combinationUsage[combo];
                mostUsed = combo;
            }
        }

        return mostUsed;
    }

    recordWinningCombination(combo: string) {
        this.winningCombinationUsage[combo] =
            (this.winningCombinationUsage[combo] || 0) + 1;
    }
}