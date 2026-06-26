import { Container, Text } from "pixi.js";

export class GameUI extends Container {
    private balanceValue: Text;
    private betValue: Text;

    constructor () {
        super();

        // BALANCE TEXT

        const balanceLabel = new Text({
            text: 'BALANCE',
            style: {
                font: 'Open Sans',
                fontSize: 24,
                fontWeight: 'bold',
                fill: 0x4ca626,
            },
        });

        balanceLabel.position.set(290, 665);

        this.balanceValue = new Text({
            text: '0.00',
            style: {
                font: 'Open Sans',
                fontSize: 24,
                fontWeight: 'bold',
                fill: 0xffffff,
            },
        });

        this.balanceValue.position.set(420, 665);

        // BET LABEL

        const betLabel = new Text({
            text: 'BET',
            style: {
                font: 'Open Sans',
                fontSize: 24,
                fontWeight: 'bold',
                fill: 0x4ca626,
            },
        });
        betLabel.position.set(785, 665);

        // BET VALUE

        this.betValue = new Text({
            text: '0.00',
            style: {
                font: 'Open Sans',
                fontSize: 24,
                fontWeight: 'bold',
                fill: 0xffffff,
            },
        });
        this.betValue.position.set(705, 665);

        // COMBINATION

        const combinationLabel = new Text({
            text: 'COMBINATION',
            style: {
                font: 'Open Sans',
                fontSize: 24,
                fontWeight: 'bold',
                fill: 0x4ca626,
            },
        });

        combinationLabel.position.set(1000, 665);


        // ADD

        this.addChild(
            balanceLabel,
            this.balanceValue,
            betLabel,
            this.betValue,
            combinationLabel,
        );
    }

    updateBalance(balance: number) {
        this.balanceValue.text = balance.toFixed(2);
    }

    updateBet(bet: number) {
        this.betValue.text = bet.toFixed(2);
    }
}