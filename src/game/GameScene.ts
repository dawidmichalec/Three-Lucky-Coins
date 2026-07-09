import { Container, Application, Assets, Sprite } from 'pixi.js';
import { Player } from './Player';
import { BET_LEVELS } from './BetLevels';
import { BetConfig, BETS_CONFIG } from './BetsConfig';
import { GameUI } from '../ui/GameUI';
import { GameController } from './GameController';
import { CoinRow } from '../ui/CoinRow';
import { CoinSide } from '../ui/Coin';
import { COMBINATIONS } from './CoinCombinations';
import { RunStats } from './RunStats';
import { HamburgerMenu } from '../ui/menus/HamburgerMenu';
import { GameControls } from '../ui/controls/GameControls';

export class GameScene extends Container {
    private gameUI: GameUI;
    private player: Player;

    private controller: GameController;

    private controls!: GameControls;

    private coinRow!: CoinRow;
    private streakMultiplier = 1;

    private roundState: 'ready' | 'spinning' | 'result' = 'ready';

    private runStats = new RunStats();

    private hamburgerMenu!: HamburgerMenu;

    constructor (
        private app: Application,
        private popupManager: { show: (msg: string) => void }
    ) {
        super();

        this.sortableChildren = true;

        this.setupTicker();

        // Player
        this.player = new Player(10);

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

        this.controls = new GameControls({
            onBetDown: () => this.handleBetDown(),
            onBetUp: () => this.handleBetUp(),
            onPrevCombo: () => this.controller.prevCombo(),
            onNextCombo: () => this.controller.nextCombo(),
            onToss: () => this.handleToss()
        });

        this.addChild(this.controls);

        this.hamburgerMenu = new HamburgerMenu();
        this.addChild(this.hamburgerMenu);

        this.createCoinRow();
        
    }

    private handleBetDown() {
        this.controller.decreaseBet();
    }

    private handleBetUp() {
        const nextBet = this.controller.getNextBet();

        if (nextBet !== null && nextBet > this.player.balance) {
            this.popupManager.show("Insufficient balance");
            return;
        }

        this.controller.increaseBet();
    }

    private handleToss() {
        this.startRound();
    }

    // COIN ROW

    private async createCoinRow() {
        this.coinRow = new CoinRow();

        await this.coinRow.init();

        this.coinRow.position.set(590, 330);

        this.addChild(this.coinRow);
    }

    private async startRound() {

        const bet = this.controller.getBet();
        if (this.player.balance < bet) {

            this.popupManager.show("Insufficient balance.");

            return;
        }

        if (this.roundState !== 'ready') return;

        this.roundState = 'spinning';
        console.log('BET USED:', this.controller.getBet());

        this.lockControls();
        this.gameUI.updateWon(0);

        
        this.player.balance -= bet;
        this.gameUI.updateBalance(this.player.balance);

        this.controls.startTossAnimation();

        const result = this.generateResult();

        await this.coinRow.spin(result);

        const selected = this.controller.getCurrentCombo();
        const win = this.isWin(selected, result);
        let winAmount: number | undefined = undefined;

        if (win) {
            if ((selected === COMBINATIONS[0]) || (selected === COMBINATIONS[4])) {
                winAmount = bet * BETS_CONFIG['bets'][0]['multiplier'] * this.streakMultiplier;

                this.player.addWin(winAmount);
                this.gameUI.updateBalance(this.player.balance);

                this.streakMultiplier++;
                this.gameUI.updateWon(winAmount);
            } else {
                winAmount = bet * BETS_CONFIG['bets'][1]['multiplier'] * this.streakMultiplier;

                this.player.addWin(winAmount);
                this.gameUI.updateBalance(this.player.balance);

                this.streakMultiplier++;
                this.gameUI.updateWon(winAmount);
            }
        } else {
            this.streakMultiplier = 1;
            this.gameUI.updateWon(0);
        }
        this.updateRunStats(selected, win, winAmount);

        console.log(this.runStats.getMostUsedCombination());

        this.gameUI.updateMultiplier(this.streakMultiplier);

        this.unlockControls();
        this.roundState = 'ready';

        this.checkGameOver();
        
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

        this.controls.setDisabled(true);
        this.hamburgerMenu.setDisabled(true);
    }

    private unlockControls() {

        this.controls.setDisabled(false);
        this.hamburgerMenu.setDisabled(false);
    }

    // TICKER

    private setupTicker() {
        this.app.ticker.add((ticker) => {
            const delta = ticker.deltaTime;

            this.controls.update(delta);

            if (this.coinRow) {
                this.coinRow.update(delta);
            }
        });
    }

    // IS PLAYER ABLE TO PLAY?

    canPlay(): boolean {
        return this.player.balance >= this.controller.getMinBet();
    }

    // GAME OVER

    private checkGameOver() {
        if (!this.canPlay()) {
            this.triggerGameOver();
        }
    }

    // TRIGGER GAME OVER

    private triggerGameOver() {
        this.lockControls();
        this.popupManager.show("GAME OVER");
    }

    // UPDATE RUN STATS

    private updateRunStats(
        selected: CoinSide[],
        win: boolean,
        winAmount?: number
    ) {

        this.runStats.totalBets++;

        const combo = selected.join('-');

        this.runStats.recordCombination(combo);

        if (win) {

            this.runStats.recordWinningCombination(combo);

            if (winAmount !== undefined) {
                this.runStats.recordWin(winAmount);
            }

            this.runStats.recordStreak(this.streakMultiplier);
        }

    }
}