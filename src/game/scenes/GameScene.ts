import { Container, Application, Assets, Sprite, Ticker } from 'pixi.js';
import { Player } from '../Player';
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
import { LocalizedText } from '../../localization/LocalizedText';
import { TranslationKey } from '../../core/LocalizationManager';
import { OddsManager } from "../probability/OddsManager";
import { BEN_PROFILE } from "../probability/DealerOddsProfiles";
import { getCombinationConfig } from "../data/CombinationUtils";
import { GoldenCoinManager } from "../goldenCoins/GoldenCoinManager";
import { CoinOutcome } from "../goldenCoins/GoldenCoinTypes";
import { DealerData } from "../dealers/DealerData";
import { BEN_DATA } from "../dealers/DealerRegistry";
import { NextOpponentOverlay } from '../../ui/overlays/NextOpponentOverlay';
import { DealerVictoryOverlay } from "../../ui/overlays/DealerVictoryOverlay";
import { GameOverOverlay } from '../../ui/overlays/GameOverlay';


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

    private oddsManager = OddsManager.getInstance();

    private goldenCoinManager = GoldenCoinManager.getInstance();

    private currentDealer: DealerData = BEN_DATA;

    private nextOpponentOverlay!: NextOpponentOverlay;

    private dealerVictoryOverlay:DealerVictoryOverlay;

    private gameOverOverlay:GameOverOverlay;

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
        this.player = new Player(10);

        // UI
        this.gameUI = new GameUI(this.currentDealer);
        this.gameUI.zIndex = 1000;
        this.addChild(this.gameUI);

        this.gameUI.updateBalance(this.player.balance);
        this.gameUI.updateMultiplier(this.streakMultiplier);


        // NEW ROUND

        this.prepareNextRound();
        

        // CONTROLLER
        this.controller = new GameController({
            onBetChange: (bet) => {
                this.gameUI.updateBet(bet);
            },

            onComboChange: (combo) => {
                this.gameUI.updateCombination(combo);
            },

            onPopup: (msg) => {
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

        this.cheatPanel = new CheatPanel(this.cheatManager);
        this.addChild(this.cheatPanel);
        this.registerCheats();

        this.createNextOpponentOverlay();

        // VICTORY SCREEN

        this.dealerVictoryOverlay =
            new DealerVictoryOverlay(
                layout.DESIGN_WIDTH,
                layout.DESIGN_HEIGHT
            );

        this.dealerVictoryOverlay.zIndex = 5000;

        this.addChild(
            this.dealerVictoryOverlay
        );

        // GAME OVER SCREEN

        this.gameOverOverlay =
            new GameOverOverlay(
                layout.DESIGN_WIDTH,
                layout.DESIGN_HEIGHT
            );

        this.gameOverOverlay.zIndex =
            6000;

        this.addChild(
            this.gameOverOverlay
        );
        
    }

    override async init(): Promise<void> {

        await Promise.all([
            this.gameUI.init(),
            this.nextOpponentOverlay.init(),
            this.createCoinRow()
        ]);

        /*
            Overlay był widoczny już wcześniej.
            Tutaj jest już również załadowany avatar.
        */
        this.nextOpponentOverlay.show();

        this.lockControls();
    }


    private createNextOpponentOverlay() {

        const layout =
            LayoutManager.getInstance();

        this.nextOpponentOverlay =
            new NextOpponentOverlay(
                layout.DESIGN_WIDTH,
                layout.DESIGN_HEIGHT,
                this.currentDealer,
                () => {
                    this.unlockControls();
                }
            );

        this.nextOpponentOverlay.zIndex = 4000;

        this.addChild(
            this.nextOpponentOverlay
        );

        this.nextOpponentOverlay.show();

        this.sortChildren();
    }


    private prepareNextRound() {

        const odds =
            this.oddsManager.rollOdds(
                BEN_PROFILE
            );

        this.gameUI.updateProbability(
            odds
        );
    }


    private handleBetDown() {
        this.controller.decreaseBet();
    }

    private handleBetUp() {
        const nextBet = this.controller.getNextBet();

        if (nextBet !== null && nextBet > this.player.balance) {
            this.popupManager.show("insufficientBalance");
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

        this.coinRow.position.set(750, 424.7);

        this.addChild(this.coinRow);
    }

    // START RUN - FUNCTION RESPONSIBLE FOR THE GAME LOOP

    private async startRound() {

        const bet = this.controller.getBet();

        if (this.player.balance < bet) {

            this.popupManager.show("insufficientBalance");

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

        const currentOdds =
            this.oddsManager.getOdds();

        const baseResult =
            this.generateResult();

        const goldenResult =
            this.goldenCoinManager
                .applyGoldenCoins(baseResult);

        const resultSides =
            goldenResult.map(
                outcome => outcome.side
            );

        console.log(
            "BASE RESULT:",
            baseResult
        );

        console.log(
            "GOLDEN RESULT:",
            goldenResult
        );

        await this.coinRow.spin(
            goldenResult
        );

        this.statsManager.recordCoinsTossed(
            resultSides.length
        );

        const selected =
            this.controller.getCurrentCombo();

        const win =
            this.isWin(
                selected,
                resultSides
            );

        let winAmount: number | undefined = undefined;

        if (win) {

            const combinationConfig =
                getCombinationConfig(selected);

            const goldenMultiplier =
                this.goldenCoinManager
                    .getGoldenMultiplier(
                        goldenResult
                    );

            winAmount =
                bet *
                combinationConfig.baseMultiplier *
                this.streakMultiplier *
                goldenMultiplier;

            this.player.addWin(winAmount);

            this.gameUI.updateBalance(
                this.player.balance
            );

            this.streakMultiplier++;

            this.gameUI.updateWon(
                winAmount
            );

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

        // NEW ROUND

        if (this.canPlay()) {

            this.prepareNextRound();

        }
        
    }

    private isWin(
        selected: readonly CoinSide[],
        result: readonly CoinSide[]
    ): boolean {

        return selected.every(
            (side, index) =>
                side === result[index]
        );
    }

    private generateResult(): CoinSide[] {

        if (this.forcedResult) {

            const result =
                this.forcedResult;

            this.forcedResult =
                undefined;

            return result;
        }

        return this.oddsManager.rollResult();
    }

    private lockControls() {

        this.controls.setDisabled(true);
        this.hamburgerMenu.setDisabled(true);
        this.gameUI.setDisabled(true);
    }

    private unlockControls() {

        this.controls.setDisabled(false);
        this.hamburgerMenu.setDisabled(false);
        this.gameUI.setDisabled(false);
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

        this.statsManager
            .getRunStats()
            .won = false;

        this.lockControls();

        void this.playGameOverSequence();
    }


    private async playGameOverSequence() {

        /*
            Krótka pauza po ostatnim przegranym rzucie,
            żeby GAME OVER nie wskoczył w tej samej klatce.
        */
        await this.delay(
            350
        );

        await this.gameOverOverlay.play(
            1300
        );

        await this.showRunSummaryWithFade();
    }


    private delay(
        milliseconds: number
    ): Promise<void> {

        return new Promise(resolve => {

            setTimeout(
                resolve,
                milliseconds
            );

        });
    }

    // RUN SUMMARY

    private async showRunSummaryWithFade() {

        this.runSummaryPanel.refresh();

        this.runSummaryPanel.visible = true;
        this.runSummaryPanel.alpha = 0;

        await this.fadeInContainer(
            this.runSummaryPanel,
            500
        );
    }

    private fadeInContainer(
        container: Container,
        duration: number
    ): Promise<void> {

        return new Promise(resolve => {

            const startTime =
                performance.now();


            const animate = (
                currentTime: number
            ) => {

                const progress =
                    Math.min(
                        1,
                        (
                            currentTime -
                            startTime
                        ) / duration
                    );


                const easedProgress =
                    1 -
                    Math.pow(
                        1 - progress,
                        3
                    );


                container.alpha =
                    easedProgress;


                if (progress < 1) {

                    requestAnimationFrame(
                        animate
                    );

                    return;
                }


                container.alpha = 1;

                resolve();
            };


            requestAnimationFrame(
                animate
            );
        });
    }

    // UPDATE RUN STATS

    private updateRunStats(
        selected: readonly CoinSide[],
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


    // VICTORY

    private async showDealerVictory() {

        this.lockControls();

        await this.dealerVictoryOverlay.play();


        this.unlockControls();
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

        this.cheatManager.register(
            CheatCode.GOLDEN_ONE,
            () => {
                this.forceGoldenWin(1);
            }
        );

        this.cheatManager.register(
            CheatCode.GOLDEN_TWO,
            () => {
                this.forceGoldenWin(2);
            }
        );

        this.cheatManager.register(
            CheatCode.GOLDEN_THREE,
            () => {
                this.forceGoldenWin(3);
            }
        );

        this.cheatManager.register(
            CheatCode.DEALER_WIN,
            () => {

                void this.showDealerVictory();

            }
        );

        this.cheatManager.register(
            CheatCode.GAME_OVER,
            () => {

                this.triggerGameOver();

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

    private forceGoldenWin(
        goldenCount: number
    ) {

        const selectedCombination =
            this.controller.getCurrentCombo();

        /*
            getCurrentCombo() zwraca readonly tuple,
            a forcedResult jest CoinSide[].
            Dlatego tworzymy nową, zwykłą tablicę.
        */
        this.forcedResult = [
            ...selectedCombination
        ];

        this.goldenCoinManager
            .forceNextGoldenCount(
                goldenCount
            );

        console.log(
            [
                `FORCED GOLDEN WIN: ${goldenCount}`,
                `FORCED COMBINATION: ${this.forcedResult.join("-")}`
            ].join("\n")
        );
    }

    // CLEANUP

    cleanup() {

        this.app.ticker.remove(this.updateTicker);

        if (this.cheatPanel) {

            this.removeChild(this.cheatPanel);

            this.cheatPanel.destroy({
                children:true
            });

        }

    }
}