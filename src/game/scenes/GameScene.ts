import { Container, Application, Assets, Sprite, Ticker } from 'pixi.js';
import { Player } from '../Player';
import { BetConfig, BETS_CONFIG } from '../data/BetsConfig';
import { GameUI } from '../../ui/GameUI';
import { GameController } from '../GameController';
import { CoinRow } from '../../ui/CoinRow';
import { CoinSide } from '../../ui/Coin';
import { COMBINATIONS } from '../data/CoinCombinations';
import { HamburgerMenu } from '../../ui/menus/HamburgerMenu';
import { GameControls } from '../../ui/controls/GameControls';
import { CheatPanel } from '../../dev/CheatPanel';
import { CheatManager } from '../../dev/CheatManager';
import { CheatActions } from '../../dev/CheatActions';
import { CheatCode } from '../../dev/CheatCodes';
import { BaseScene } from './BaseScene';
import { SceneManager } from '../SceneManager';
import { PopupManager } from '../../ui/popups/PopupManager';
import { OptionsPanel } from '../../ui/panels/OptionsPanel';
import { StatsManager } from '../../core/StatsManager';
import { RunSummaryPanel } from '../../ui/panels/RunSummaryPanel';
import { StatsPanel } from '../../ui/panels/StatsPanel';
import { LayoutManager } from '../../core/LayoutManager';

export class GameScene extends BaseScene {
    private gameUI: GameUI;
    private player: Player;

    private controller: GameController;

    private controls!: GameControls;

    private coinRow!: CoinRow;
    private losingStreak = 0;
    private streakMultiplier = 1;

    private roundState: 'ready' | 'spinning' | 'result' = 'ready';

    private hamburgerMenu!: HamburgerMenu;

    private cheatPanel: CheatPanel;

    private cheatManager = new CheatManager();

    private forcedResult?: CoinSide[];

    private updateTicker!: (ticker: Ticker) => void;

    private optionsPanel!: OptionsPanel;

    private statsManager!: StatsManager;

    private runSummaryPanel!: RunSummaryPanel;

    private statsPanel!: StatsPanel;

    constructor (
        private app: Application,
        private popupManager: PopupManager,
        private sceneManager: SceneManager
    ) {
        super();

        this.sortableChildren = true;

        this.setupTicker();

        const layout = LayoutManager.getInstance();

        // StatsManager

        this.statsManager = StatsManager.getInstance();

        // Player
        this.player = new Player(100);

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

        this.optionsPanel = new OptionsPanel(
            layout.DESIGN_WIDTH,
            layout.DESIGN_HEIGHT,
            ()=>{
                this.optionsPanel.hide();
            }
        );

        this.optionsPanel.visible = false;
        this.optionsPanel.zIndex = 1000;

        this.addChild(this.optionsPanel);

        this.statsPanel = new StatsPanel(
            layout.DESIGN_WIDTH, 
            layout.DESIGN_HEIGHT, 
            () => {
                this.statsPanel.hide()
            }
        );

        this.statsPanel.visible = false;
        this.statsPanel.zIndex = 1000;

        this.addChild(this.statsPanel);

        this.runSummaryPanel =
            new RunSummaryPanel(

                layout.DESIGN_WIDTH,
                layout.DESIGN_HEIGHT,

                ()=>{

                    this.statsManager.finishRun();

                    this.sceneManager.showGame();

                },

                ()=>{

                    this.statsManager.finishRun();

                    this.sceneManager.showMainMenu();

                }

            );


        this.runSummaryPanel.visible = false;

        this.runSummaryPanel.zIndex = 2000;


        this.addChild(this.runSummaryPanel);

        this.hamburgerMenu = new HamburgerMenu(
            this.sceneManager, 
            this.popupManager,
            ()=>{
                this.optionsPanel.show();
                
            },
            () => {
                this.statsPanel.show();
            }
        );
        this.addChild(this.hamburgerMenu);

        this.createCoinRow();
        this.cheatManager = new CheatManager();
        this.cheatPanel = new CheatPanel(this.cheatManager);
        this.addChild(this.cheatPanel);
        this.registerCheats();
        
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

        this.coinRow.position.set(740, 470);

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

        this.statsManager.recordCoinsTossed(result.length);

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

        this.updateRunStats(
            selected,
            win,
            winAmount,
            bet
        );

        console.log(this.statsManager.recordCombination);

        this.gameUI.updateMultiplier(this.streakMultiplier);

        this.unlockControls();
        this.roundState = 'ready';

        this.checkGameOver();
        
    }

    private isWin(selected: CoinSide[], result: CoinSide[]) {
        return selected.every((v, i) => v === result[i]);
    }

    private generateResult(): CoinSide[] {

        if (this.forcedResult) {

            const result = this.forcedResult;

            this.forcedResult = undefined;

            return result;
        }


        const sides = [
            CoinSide.Heads,
            CoinSide.Tails
        ];

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

        this.updateTicker = (ticker: Ticker) => {

            const delta = ticker.deltaTime;

            this.controls.update(delta);

            if (this.coinRow) {
                this.coinRow.update(delta);
            }

        };

        this.app.ticker.add(this.updateTicker);
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

        this.statsManager.getRunStats().won = false;

        this.lockControls();
        this.popupManager.show(
            "GAME OVER",
            400,
            220,
            ()=>{

                this.showRunSummary();

            }
        );
    }

    // RUN SUMMARY

    private showRunSummary(){

        console.log(
            "RUN STATS:",
            this.statsManager.getRunStats()
        );
        this.runSummaryPanel.refresh();
        this.runSummaryPanel.visible = true;

    }

    // UPDATE RUN STATS

    private updateRunStats(
        selected: CoinSide[],
        win: boolean,
        winAmount?: number,
        bet?: number
    ) {
        console.log(
            "UPDATE RUN STATS"
        );

        const combo = selected.join('-');


        // =====================
        // BET
        // =====================

        if (bet !== undefined) {

            this.statsManager.recordBet(bet);

        }


        // =====================
        // COMBINATION USAGE
        // =====================

        this.statsManager.recordCombination(combo);



        // =====================
        // WIN
        // =====================

        if (win) {


            this.losingStreak = 0;


            this.statsManager.recordSuccessfulBet();


            this.statsManager.recordWinningCombination(combo);


            if(winAmount !== undefined){

                this.statsManager.recordWin(winAmount);

            }


            this.statsManager.recordWinStreak(
                this.streakMultiplier
            );


        }
        else {


            this.losingStreak++;


            this.statsManager.recordLoss(
                bet ?? 0
            );


            this.statsManager.recordLoseStreak(
                this.losingStreak
            );

        }

    }

    // REGISTER CHEATS

    private registerCheats() {

        this.cheatManager.register(
            CheatCode.ALL_HEADS_WIN,
            () => {
                this.forceResult(
                    CheatActions.allHeadsWin()
                );
            }
        );


        this.cheatManager.register(
            CheatCode.ALL_TAILS_WIN,
            () => {
                this.forceResult(
                    CheatActions.allTailsWin()
                );
            }
        );


        this.cheatManager.register(
            CheatCode.NOT_ALL_SAME_WIN,
            () => {
                this.forceResult(
                    CheatActions.notAllSameWin()
                );
            }
        );

    }

    // FORCED RESULT

    private forceResult(result: CoinSide[]) {

        this.forcedResult = result;

        console.log(
            "FORCED RESULT:",
            result.join("-")
        );
    }

    // CLEANUP

    cleanup() {

        console.log("GAME SCENE CLEANUP");

        this.app.ticker.remove(this.updateTicker);

        if (this.cheatPanel) {

            this.removeChild(this.cheatPanel);

            this.cheatPanel.destroy({
                children:true
            });

        }

    }
}