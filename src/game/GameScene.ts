import { Container, Application, Assets, Sprite } from 'pixi.js';
import { Player } from './Player';
import { BET_LEVELS } from './BetLevels';
import { BetConfig, BETS_CONFIG } from './BetsConfig';
import { GameUI } from '../ui/GameUI';

import { GameController } from './GameController';
import { TriangleButton } from '../ui/buttons/TriangleButton';
import { TossButton } from '../ui/buttons/TossButton';

import { CoinRow } from '../ui/CoinRow';

import { CoinSide } from '../ui/Coin';
import { COMBINATIONS } from './CoinCombinations';

export class GameScene extends Container {
    private gameUI: GameUI;
    private player: Player;

    private controller: GameController;

    private betDown!: TriangleButton;
    private betUp!: TriangleButton;

    private prevCombo!: TriangleButton;
    private nextCombo!: TriangleButton;

    private tossButton!: TossButton;

    private coinRow!: CoinRow;
    private streakMultiplier = 1;

    private roundState: 'ready' | 'spinning' | 'result' = 'ready';

    constructor (
        private app: Application,
        private popupManager: { show: (msg: string) => void }
    ) {
        super();

        this.sortableChildren = true;

        this.setupTicker();

        // Player
        this.player = new Player(10000);

        // UI
        this.gameUI = new GameUI();
        this.addChild(this.gameUI);

        this.gameUI.updateBalance(this.player.balance);
        this.gameUI.updateMultiplier(this.streakMultiplier);
        

        // CONTROLLER
        this.controller = new GameController({
            onBetChange: (bet) => {
                this.gameUI.updateBet(bet);
            },

            onComboChange: (combo) => {
                this.gameUI.updateCombination(combo);
            },

            onPopup: (msg) => {
                console.log('POPUP TRIGGER:', msg);
                this.popupManager.show(msg);
            },
        });

        this.gameUI.updateBet(this.controller.getBet());

        this.createBetButtons();
        this.createCombinationsButtons();
        this.createCoinRow();
        this.createTossButton();

    }

    // BET BUTTONS

    private createBetButtons() {
        const betDown = new TriangleButton({
            direction: 'left',
            label: '-',
            onClick: () => {
            this.controller.decreaseBet();
            },
        });

        const betUp = new TriangleButton({
            direction: 'right',
            label: '+',
            onClick: () => {
            this.controller.increaseBet();
            },
        });

        betDown.position.set(645, 660);
        betUp.position.set(845, 660);

        this.betDown = betDown;
        this.betUp = betUp;

        this.addChild(betDown, betUp);
    }

    private createCombinationsButtons() {

        const prevCombo = new TriangleButton({
            direction: 'left',
            label: '-',
            onClick: () => {
            this.controller.prevCombo();
            },
        });

        const nextCombo = new TriangleButton({
            direction: 'right',
            label: '+',
            onClick: () => {
            this.controller.nextCombo();
            },
        });

        prevCombo.position.set(960, 660);
        nextCombo.position.set(1300, 660);

        this.prevCombo = prevCombo;
        this.nextCombo = nextCombo;

        this.addChild(prevCombo, nextCombo);
    }

    // TOSS BUTTON

    private async createTossButton() {
        this.tossButton = new TossButton('BET');

        await this.tossButton.init();

        this.tossButton.position.set(1370, 500);

        this.addChild(this.tossButton);

        this.tossButton.on("toss", () => {
            this.startRound();
        });
    }

    // COIN ROW

    private async createCoinRow() {
        this.coinRow = new CoinRow();

        await this.coinRow.init();

        this.coinRow.position.set(590, 330);

        this.addChild(this.coinRow);
    }

    private async startRound() {
        if (this.roundState !== 'ready') return;

        this.roundState = 'spinning';
        console.log('BET USED:', this.controller.getBet());

        this.lockControls();
        this.gameUI.updateWon(0);

        const bet = this.controller.getBet();

        this.player.balance -= bet;
        this.gameUI.updateBalance(this.player.balance);

        this.tossButton.startAnimation();

        const result = this.generateResult();

        await this.coinRow.spin(result);

        const selected = this.controller.getCurrentCombo();
        const win = this.isWin(selected, result);

        

        if (win) {
            if ((selected === COMBINATIONS[0]) || (selected === COMBINATIONS[4])) {
                const winAmount = bet * BETS_CONFIG['bets'][0]['multiplier'] * this.streakMultiplier;

                this.player.addWin(winAmount);

                this.streakMultiplier++;
                this.gameUI.updateWon(winAmount);
            } else {
                const winAmount = bet * BETS_CONFIG['bets'][1]['multiplier'] * this.streakMultiplier;

                this.player.addWin(winAmount);

                this.streakMultiplier++;
                this.gameUI.updateWon(winAmount);
            }
        } else {
            this.streakMultiplier = 1;
            this.gameUI.updateWon(0);
        }

        
        this.gameUI.updateMultiplier(this.streakMultiplier);

        this.unlockControls();
        this.roundState = 'ready';
    }

    private isWin(selected: CoinSide[], result: CoinSide[]) {
        return selected.every((v, i) => v === result[i]);
    }

    private generateResult(): CoinSide[] {

        const sides = [CoinSide.Heads, CoinSide.Tails];

        return [
            sides[Math.floor(Math.random() * 2)],
            sides[Math.floor(Math.random() * 2)],
            sides[Math.floor(Math.random() * 2)],
        ];
    }

    private lockControls() {

        this.betDown.setDisabled(true);
        this.betUp.setDisabled(true);

        this.prevCombo.setDisabled(true);
        this.nextCombo.setDisabled(true);

        this.tossButton.setDisabled(true);
    }

    private unlockControls() {

        this.betDown.setDisabled(false);
        this.betUp.setDisabled(false);

        this.prevCombo.setDisabled(false);
        this.nextCombo.setDisabled(false);

        this.tossButton.setDisabled(false);
    }

    // TICKER

    private setupTicker() {
        this.app.ticker.add((ticker) => {
            const delta = ticker.deltaTime;

            if (this.tossButton) {
                this.tossButton.update(delta);
            }

            if (this.coinRow) {
                this.coinRow.update(delta);
            }
        });
    }
}