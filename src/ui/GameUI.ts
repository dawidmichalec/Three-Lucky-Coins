import { Container, Text } from "pixi.js";

export class GameUI extends Container {
    private balanceValue: Text;
    private betValue: Text;
    private combinationValue: Text;
    private wonAmount: Text;
    private multiplierValue: Text;

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

        balanceLabel.position.set(367.9, 1043.5);

        // BALANCE VALUE TEXT

        this.balanceValue = new Text({
            text: '0.00',
            style: {
                font: 'Open Sans',
                fontSize: 24,
                fontWeight: 'bold',
                fill: 0xffffff,
            },
        });

        this.balanceValue.position.set(497.9, 1043.5);

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
        betLabel.position.set(985, 1043.5);

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
        this.betValue.position.set(900, 1043.5);

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

        combinationLabel.position.set(1345, 1043.5);

        // COMBINATIONS TEXT

        this.combinationValue = new Text({
            text: 'H - H - H',
            style: {
                font: 'Open Sans',
                fontSize: 24,
                fontWeight: 'bold',
                fill: 0xffffff,
            },
        });

        this.combinationValue.position.set(1525, 1043.5);

        // WON TEXT

        const wonLabel = new Text({
            text: 'WIN:',
            style: {
                font: 'Open Sans',
                fontSize: 34,
                fontWeight: 'bold',
                fill: 0xffffff,

                dropShadow: {
                    alpha: 0.8,
                    blur: 8,
                    color: '#00ffcc',
                    distance: 0,
                }
            },
        });

        wonLabel.position.set(890, 720);

        this.wonAmount = new Text({
            text: '0.00',
            style: {
                font: 'Open Sans',
                fontSize: 34,
                fontWeight: 'bold',
                fill: 0xffffff,

                dropShadow: {
                    alpha: 1,
                    blur: 15,
                    color: '#00ffcc', 
                    distance: 0,
                },
                
            },
        });

        this.wonAmount.position.set(970, 720);

        // MULTIPLIER TEXT

        const multiplierLabel = new Text({
            text: 'Multiplier',
            style: {
                fontFamily: 'Oswald-Bold',
                fontSize: 38,
                fontWeight: 'bold',
                fill: 0xffffff,
                dropShadow: {
                    alpha: 0.8,
                    blur: 8,
                    color: '#ffaa00',
                    distance: 0,
                }
            },
        });

        multiplierLabel.position.set(329.9, 437.5);

        // MULTIPLIER VALUE

        this.multiplierValue = new Text({
            text: 'x1',
            style: {
                font: 'Open Sans',
                fontSize: 124,
                fontWeight: 'bold',
                fill: 0xffffff,

                dropShadow: {
                    alpha: 1,
                    blur: 15,
                    color: '#ffaa00',
                    distance: 0,
                },
   
                stroke: {
                    color: '#331100',
                    width: 3,
                }
            },
        });

        this.multiplierValue.position.set(350, 492.9);

        // ADD

        this.addChild(
            balanceLabel,
            this.balanceValue,
            betLabel,
            this.betValue,
            combinationLabel,
            this.combinationValue,
            wonLabel,
            this.wonAmount,
            multiplierLabel,
            this.multiplierValue,
        );
    }

    updateBalance(balance: number) {
        this.balanceValue.text = balance.toFixed(2);
    }

    updateBet(bet: number) {
        this.betValue.text = bet.toFixed(2);
    }

    updateCombination(combination: string) {
        this.combinationValue.text = combination;
    }

    updateWon(value: number) {
        this.wonAmount.text = value.toFixed(2);
    }

    updateMultiplier(multiplier: number) {
        this.multiplierValue.text = `x${multiplier}`;
    }
}