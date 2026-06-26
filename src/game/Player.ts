export class Player {
    balance: number;
    wins: number;
    losses: number;

    constructor(startBalance: number) {
        this.balance = startBalance;
        this.wins = 0;
        this.losses = 0;
    }

    addWin(amount: number) {
        this.balance += amount;
        this.wins++;
    }

    addLoss(amount: number) {
        this.balance -= amount;
        this.losses++;
    }
}