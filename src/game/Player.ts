export class Player {
    balance: number;
    wins: number;
    losses: number;
    
    totalWon: number = 0;
    totalLost: number = 0;

    constructor(startBalance: number) {
        this.balance = startBalance;
        this.wins = 0;
        this.losses = 0;
    }

    addWin(amount: number) {
        this.balance += amount;
        this.totalWon += amount;
        this.wins++;
    }

    addLoss(amount: number) {
        this.balance -= amount;
        this.totalLost += amount;
        this.losses++;
    }
}