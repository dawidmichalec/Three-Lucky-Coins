import { Container, Application, Assets, Sprite, Ticker } from 'pixi.js';
import { Player } from '../Player';
import { GameUI } from '../../ui/GameUI';
import { GameController } from '../GameController';
import { CoinRow } from '../../ui/CoinRow';
import { CoinSide } from '../../ui/Coin';
import { HamburgerMenu } from '../../ui/menus/HamburgerMenu';
import { GameControls } from '../../ui/controls/GameControls';
import { CheatPanel } from '../../dev/CheatPanel';
import { CheatManager } from '../../dev/CheatManager';
import { BaseScene } from './BaseScene';
import { SceneManager } from '../SceneManager';
import { PopupManager } from '../../ui/popups/PopupManager';
import { OptionsPanel } from '../../ui/panels/OptionsPanel';
import { StatsManager } from '../../core/StatsManager';
import { RunSummaryPanel } from '../../ui/panels/RunSummaryPanel';
import { StatsPanel } from '../../ui/panels/StatsPanel';
import { LayoutManager } from '../../core/LayoutManager';
import { OddsManager } from "../probability/OddsManager";
import { GoldenCoinManager } from "../goldenCoins/GoldenCoinManager";
import { DealerData } from "../dealers/DealerData";
import { BEN_DATA,  HILLARY_DATA } from "../dealers/DealerRegistry";
import { NextOpponentOverlay } from '../../ui/overlays/NextOpponentOverlay';
import { DealerVictoryOverlay } from "../../ui/overlays/DealerVictoryOverlay";
import { GameOverOverlay } from '../../ui/overlays/GameOverOverlay';
import { BEN_PROFILE, HILLARY_PROFILE } from "../probability/DealerOddsProfiles";
import { DealerSkillId } from "../dealers/DealerSkill";
import { DealerOddsProfile } from "../probability/OddsTypes";
import { AudioManager } from '../../core/AudioManager';
import { SoundId } from '../../audio/SoundId';
import { GameCheatController } from '../../dev/GameCheatController';
import { DealerFightManager } from "../dealers/DealerFightManager";
import { RoundResolver } from "../round/RoundResolver";
import { RunStatsRecorder } from "../../stats/RunStatsRecorder";


export class GameScene extends BaseScene {
    private gameUI: GameUI;
    private player: Player;

    private controller: GameController;

    private controls!: GameControls;

    private coinRow!: CoinRow;
    private streakMultiplier = 1;

    private roundState: 'ready' | 'spinning' | 'result' = 'ready';

    private hamburgerMenu!: HamburgerMenu;

    private cheatPanel: CheatPanel;

    private cheatManager = new CheatManager();

    private updateTicker!: (ticker: Ticker) => void;

    private optionsPanel!: OptionsPanel;

    private statsManager!: StatsManager;

    private runSummaryPanel!: RunSummaryPanel;

    private statsPanel!: StatsPanel;

    private oddsManager = OddsManager.getInstance();

    private goldenCoinManager = GoldenCoinManager.getInstance();

    private nextOpponentOverlay!: NextOpponentOverlay;

    private dealerVictoryOverlay:DealerVictoryOverlay;

    private gameOverOverlay:GameOverOverlay;

    private isChangingDealer = false;

    private dealerFightManager =
        new DealerFightManager([
            BEN_DATA,
            HILLARY_DATA
        ]);

    private audioManager = AudioManager.getInstance();

    private gameCheatController!: GameCheatController;

    private runStatsRecorder!: RunStatsRecorder;


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

        // RunStatsRecorder

        this.runStatsRecorder = new RunStatsRecorder(this.statsManager);

        // Player
        this.player = new Player(25);

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

        this.gameCheatController =
            new GameCheatController(
                this.cheatManager,
                this.controller,
                this.goldenCoinManager,
                {
                    onDealerWin: () => {

                        void this.showDealerVictory();
                    },

                    onGameOver: () => {

                        this.triggerGameOver();
                    }
                }
            );


        this.cheatPanel =
            new CheatPanel(
                this.cheatManager
            );

        this.addChild(
            this.cheatPanel
        );

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

                    this.startDealerFight();

                    this.roundState = "ready";

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

        const profile =
            this.getCurrentDealerOddsProfile();

        const odds =
            this.oddsManager.rollOdds(
                profile
            );

        this.gameUI.updateProbability(
            odds
        );
    }

    private get currentDealer():
        DealerData {

        return this.dealerFightManager
            .getCurrentDealer();
    }


    private getCurrentDealerOddsProfile():
        DealerOddsProfile {

        switch (this.currentDealer.id) {

            case HILLARY_DATA.id:
                return HILLARY_PROFILE;

            case BEN_DATA.id:
            default:
                return BEN_PROFILE;
        }
    }


    private startDealerFight() {

        const fight =
            this.dealerFightManager
                .startFight(
                    this.player.balance
                );


        this.gameUI.updateDealerObjective(
            this.currentDealer,
            fight.targetBalance
        );
    }


    private isCurrentDealerDefeated():
        boolean {

        return this.dealerFightManager
            .isCurrentDealerDefeated(
                this.player.balance
            );
    }


    private async handleDealerDefeated():
        Promise<void> {

        if (this.isChangingDealer) {
            return;
        }

        this.isChangingDealer = true;

        this.lockControls();

        /*
            Gracz ma chwilę na zobaczenie:
            - wyniku monet,
            - wygranej,
            - nowego salda,
            - animacji multipliera.
        */
        await this.delay(400);

        await this.dealerVictoryOverlay.play();

        const nextDealer = this.dealerFightManager.advanceToNextDealer();

        if (!nextDealer) {

            console.log(
                "All currently available dealers defeated."
            );

            /*
                Tymczasowo pokazujemy podsumowanie runu.
                Później tutaj znajdzie się końcowe zwycięstwo.
            */

            this.statsManager
                .getRunStats()
                .won = true;

            await this.showRunSummaryWithFade();

            return;
        }

        await this.loadDealer(
            nextDealer
        );

        this.isChangingDealer = false;
    }


    private async loadDealer(
        dealer: DealerData
    ): Promise<void> {


        /*
            Nowa walka zaczyna się od x1.
            Dzięki temu passa nie przechodzi
            automatycznie między dealerami.
        */

        this.streakMultiplier = 1;

        this.gameUI.updateMultiplier(
            this.streakMultiplier
        );

        this.gameUI.updateWon(0);

        /*
            Aktualizacja małej karty i paneli.
        */

        await this.gameUI.setDealer(
            dealer
        );

        /*
            Nowe prawdopodobieństwa dealera
            przygotowujemy przed startem walki.
        */

        this.prepareNextRound();

        /*
            Tworzymy nowy ekran prezentacji.
        */

        await this.replaceNextOpponentOverlay(
            dealer
        );
    }


    private async replaceNextOpponentOverlay(
        dealer: DealerData
    ): Promise<void> {

        const layout =
            LayoutManager.getInstance();

        if (this.nextOpponentOverlay) {

            this.removeChild(
                this.nextOpponentOverlay
            );

            this.nextOpponentOverlay.destroy({
                children: true
            });
        }

        this.nextOpponentOverlay =
            new NextOpponentOverlay(
                layout.DESIGN_WIDTH,
                layout.DESIGN_HEIGHT,
                dealer,
                () => {

                    this.startDealerFight();

                    this.roundState = "ready";

                    this.isChangingDealer =
                        false;

                    this.unlockControls();
                }
            );

        this.nextOpponentOverlay.zIndex =
            4000;

        this.addChild(
            this.nextOpponentOverlay
        );

        this.sortChildren();

        this.nextOpponentOverlay.show();

        await this.nextOpponentOverlay.init();
    }


    private getStreakMultiplierGrowth():
        number {

        const hasSlowerMultiplierGrowth =
            this.currentDealer.skills.some(
                skill =>
                    skill.id ===
                    DealerSkillId
                        .SLOWER_MULTIPLIER_GROWTH
            );

        if (hasSlowerMultiplierGrowth) {
            return 0.5;
        }

        return 1;
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

        this.lockControls();
        this.gameUI.updateWon(0);

        
        this.player.balance -= bet;
        this.gameUI.updateBalance(this.player.balance);

        this.controls.startTossAnimation();

        const baseResult =
            this.generateResult();

        const goldenResult =
            this.goldenCoinManager
                .applyGoldenCoins(baseResult);

        const resultSides =
            goldenResult.map(
                outcome => outcome.side
            );

        const selected =
            this.controller.getCurrentCombo();

        await this.coinRow.spin(
            goldenResult,
            selected
        );

        this.statsManager.recordCoinsTossed(
            resultSides.length
        );


       const goldenMultiplier =
    this.goldenCoinManager
        .getGoldenMultiplier(
            goldenResult
        );


        const resolution =
            RoundResolver.resolve({

                selected,

                result:
                    resultSides,

                bet,

                streakMultiplier:
                    this.streakMultiplier,

                goldenMultiplier
            });


        const win =
            resolution.win;


        const winAmount =
            resolution.winAmount;

        if (win) {

            if (
                winAmount === undefined
            ) {

                throw new Error(
                    "Winning round has no win amount."
                );
            }


            this.player.addWin(winAmount);


            this.gameUI.updateBalance(this.player.balance);


            this.streakMultiplier +=
                this.getStreakMultiplierGrowth();


            this.audioManager.play(
                SoundId.WIN,
                {
                    loop: false,
                    volume: 0.7
                }
            );


            this.gameUI.updateWon(winAmount);

        } else {

            this.streakMultiplier = 1;

            this.gameUI.updateWon(0);
        }

        this.runStatsRecorder.recordRound({
                selected,
                win,
                winAmount,
                bet,
                streakMultiplier:this.streakMultiplier
            });

        this.gameUI.updateMultiplier(
            this.streakMultiplier
        );

        this.controller.adjustBetToBalance(
            this.player.balance
        );

        /*
            Najpierw sprawdzamy zwycięstwo nad dealerem.
        */
        if (
            this.isCurrentDealerDefeated()
        ) {

            this.roundState = "result";

            await this.handleDealerDefeated();

            return;
        }

        /*
            Dopiero później Game Over.
        */
        if (!this.canPlay()) {

            this.roundState = "result";

            this.triggerGameOver();

            return;
        }

        /*
            Normalne przygotowanie kolejnej rundy.
        */
        this.prepareNextRound();

        this.roundState = "ready";

        this.unlockControls();
        
    }


    private generateResult():
        CoinSide[] {

        const forcedResult =
            this.gameCheatController
                .consumeForcedResult();


        if (forcedResult) {

            return forcedResult;
        }


        return this.oddsManager
            .rollResult();
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

    // VICTORY

    private async showDealerVictory() {

        this.lockControls();

        await this.dealerVictoryOverlay.play();


        this.unlockControls();
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