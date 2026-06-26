import { Container, Application, Assets, Sprite } from 'pixi.js';
import { Player } from './Player';
import { BET_LEVELS } from './BetLevels';
import { GameUI } from '../ui/GameUI';

import { GameController } from './GameController';
import { TriangleButton } from '../ui/buttons/TriangleButton';
import { TossButton } from '../ui/buttons/TossButton';

import { CoinRow } from '../ui/CoinRow';

export class GameScene extends Container {
    private gameUI: GameUI;
    private player: Player;
    private currentBetIndex = 3;
    private currentBet = 0;

    private controller: GameController;

    private betDown!: TriangleButton;
    private betUp!: TriangleButton;

    private tossButton!: TossButton;

    private coinRow!: CoinRow;

    constructor (
        private app: Application,
        private popupManager: { show: (msg: string) => void }
    ) {
        super();

        this.sortableChildren = true;

        // Player
        this.player = new Player(10000);

        // UI
        this.gameUI = new GameUI();
        this.addChild(this.gameUI);

        this.gameUI.updateBalance(this.player.balance);
        this.gameUI.updateBet(BET_LEVELS[this.currentBetIndex]);

        this.currentBet = BET_LEVELS[this.currentBetIndex];

        // CONTROLLER
        this.controller = new GameController({
            onBetChange: (bet) => {
                this.currentBet = bet;
                this.gameUI.updateBet(bet);
            },

            onPopup: (msg) => {
                console.log('POPUP TRIGGER:', msg);
                this.popupManager.show(msg);
            },
        });

        this.createBetButtons();
        this.createTossButton();
        this.createCoinRow();

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

    // TOSS BUTTON

    private async createTossButton() {
        this.tossButton = new TossButton('BET');

        await this.tossButton.init();

        this.tossButton.position.set(1370, 500);

        this.addChild(this.tossButton);
    }

    // COIN ROW

    private async createCoinRow() {
        this.coinRow = new CoinRow();

        await this.coinRow.init();

        this.coinRow.position.set(530, 330);

        this.addChild(this.coinRow);
    }
}