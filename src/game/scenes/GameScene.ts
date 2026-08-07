import { Application, Ticker } from 'pixi.js';
import { Player } from '../Player';
import { GameController } from '../GameController';
import { CoinRow } from '../../ui/CoinRow';
import { CoinSide } from '../../ui/Coin';
import { CheatPanel } from '../../dev/CheatPanel';
import { CheatManager } from '../../dev/CheatManager';
import { BaseScene } from './BaseScene';
import { SceneManager } from '../SceneManager';
import { PopupManager } from '../../ui/popups/PopupManager';
import { StatsManager } from '../../core/StatsManager';
import { LayoutManager } from '../../core/LayoutManager';
import { OddsManager } from "../probability/OddsManager";
import { GoldenCoinManager } from "../goldenCoins/GoldenCoinManager";
import { DealerData } from "../dealers/DealerData";
import { BEN_DATA,  HILLARY_DATA } from "../dealers/DealerRegistry";
import { BEN_PROFILE, HILLARY_PROFILE } from "../probability/DealerOddsProfiles";
import { DealerOddsProfile } from "../probability/OddsTypes";
import { GameCheatController } from '../../dev/GameCheatController';
import { DealerFightManager } from "../dealers/DealerFightManager";
import { RoundResolver } from "../round/RoundResolver";
import { RunStatsRecorder } from "../../stats/RunStatsRecorder";
import { RunEndController } from "../run/RunEndController";
import { DealerPresentationController } from "../../ui/controllers/DealerPresentationController";
import { RoundOutcomeHandler } from "../round/RoundOutcomeHandler";
import { GameSceneView } from "../../ui/GameSceneView";


export class GameScene extends BaseScene {
    
    private player: Player;
    private controller: GameController;
    private coinRow!: CoinRow;
    private streakMultiplier = 1;
    private roundState: 'ready' | 'spinning' | 'result' = 'ready';
    private cheatPanel: CheatPanel;
    private cheatManager = new CheatManager();
    private updateTicker!: (ticker: Ticker) => void;
    private statsManager!: StatsManager;
    private oddsManager = OddsManager.getInstance();
    private goldenCoinManager = GoldenCoinManager.getInstance();
    private isChangingDealer = false;
    private dealerFightManager =
        new DealerFightManager([
            BEN_DATA,
            HILLARY_DATA
        ]);
    private gameCheatController!: GameCheatController;
    private runStatsRecorder!: RunStatsRecorder;
    private runEndController!: RunEndController;
    private dealerPresentationController!: DealerPresentationController;
    private roundOutcomeHandler =new RoundOutcomeHandler();
    private view: GameSceneView;


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

        // GameSceneView

        this.view =
            new GameSceneView(
                this.currentDealer,
                this.sceneManager,
                this.popupManager,
                {
                    onBetDown: () =>
                        this.handleBetDown(),

                    onBetUp: () =>
                        this.handleBetUp(),

                    onPrevCombo: () =>
                        this.controller
                            .prevCombo(),

                    onNextCombo: () =>
                        this.controller
                            .nextCombo(),

                    onToss: () =>
                        this.handleToss(),

                    onRestartRun: () => {

                        this.statsManager
                            .finishRun();

                        this.sceneManager
                            .showGame();
                    },

                    onMainMenu: () => {

                        this.statsManager
                            .finishRun();

                        this.sceneManager
                            .showMainMenu();
                    }
                }
            );

        this.view.zIndex = 1000;

        this.addChild(
            this.view
        );


        // NEW ROUND

        this.prepareNextRound();
        

        // CONTROLLER
        this.controller =
            new GameController({

                onBetChange: bet => {

                    this.view.gameUI
                        .updateBet(
                            bet
                        );
                },

                onComboChange: combo => {

                    this.view.gameUI
                        .updateCombination(
                            combo
                        );
                },

                onPopup: msg => {

                    this.popupManager
                        .show(
                            msg
                        );
                }
            });

        // INITIAL UI STATE

        this.view.gameUI.updateBalance(this.player.balance);

        this.view.gameUI.updateBet(this.controller.getBet());

        this.view.gameUI.updateMultiplier(this.streakMultiplier);


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

        // Dealer Presentation Controller

        this.dealerPresentationController =
            new DealerPresentationController(
                this.view,
                () => {

                    this.startDealerFight();

                    this.roundState =
                        "ready";

                    this.isChangingDealer =
                        false;

                    this.unlockControls();
                }
            );

        this.dealerPresentationController.createInitial(this.currentDealer);

        this.runEndController =
            new RunEndController(
                this.statsManager,

                this.view
                    .runSummaryPanel,

                this.view
                    .gameOverOverlay,

                this.view
                    .dealerVictoryOverlay,

                {
                    onLockControls:
                        () =>
                            this.lockControls(),

                    onUnlockControls:
                        () =>
                            this.unlockControls()
                }
            );
        
    }

    override async init(): Promise<void> {

        await Promise.all([
            this.view.gameUI.init(),
            this.dealerPresentationController.initCurrent(),
            this.createCoinRow()
        ]);

        this.lockControls();
    }


    private prepareNextRound() {

        const profile =
            this.getCurrentDealerOddsProfile();

        const odds =
            this.oddsManager.rollOdds(
                profile
            );

        this.view.gameUI.updateProbability(
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


        this.view.gameUI.updateDealerObjective(
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

        await this.view.dealerVictoryOverlay.play();

        const nextDealer = this.dealerFightManager.advanceToNextDealer();

        if (!nextDealer) {

            console.log(
                "All currently available dealers defeated."
            );

            /*
                Tymczasowo pokazujemy podsumowanie runu.
                Później tutaj znajdzie się końcowe zwycięstwo.
            */

            await this.runEndController.showRunVictory();

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

        this.view.gameUI.updateMultiplier(
            this.streakMultiplier
        );

        this.view.gameUI.updateWon(0);

        /*
            Aktualizacja małej karty i paneli.
        */

        await this.view.gameUI.setDealer(
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

        await this.dealerPresentationController.showDealer(dealer);
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

        this.coinRow.position.set(750,424.7);

        this.coinRow.zIndex =0;

        this.addChild(
            this.coinRow
        );
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
        this.view.gameUI.updateWon(0);

        
        this.player.balance -= bet;
        this.view.gameUI.updateBalance(this.player.balance);

        this.view.controls.startTossAnimation();

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


       const goldenMultiplier = this.goldenCoinManager.getGoldenMultiplier(goldenResult);

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

        const outcome =
            this.roundOutcomeHandler
                .apply(
                    this.player,
                    {
                        win,
                        winAmount,

                        currentDealer:
                            this.currentDealer,

                        currentStreakMultiplier:
                            this.streakMultiplier
                    }
                );

        this.streakMultiplier = outcome.newStreakMultiplier;

        this.view.gameUI.updateBalance(this.player.balance);

        this.view.gameUI.updateWon(outcome.wonAmount);

        this.runStatsRecorder.recordRound({
                selected,
                win,
                winAmount,
                bet,
                streakMultiplier:this.streakMultiplier
            });

        this.view.gameUI.updateMultiplier(
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

        this.view.controls.setDisabled(true);
        this.view.hamburgerMenu.setDisabled(true);
        this.view.gameUI.setDisabled(true);
    }

    private unlockControls() {

        this.view.controls.setDisabled(false);
        this.view.hamburgerMenu.setDisabled(false);
        this.view.gameUI.setDisabled(false);
    }

    // TICKER

    private setupTicker() {

        this.updateTicker = (ticker: Ticker) => {

            const delta = ticker.deltaTime;

            this.view.controls.update(delta);

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

    // TRIGGER GAME OVER

    private triggerGameOver() {

        void this.runEndController.triggerGameOver();
    }

    // VICTORY

    private async showDealerVictory() {

        await this.runEndController.showDealerVictory();
    }

    // CLEANUP

    cleanup() {

        this.app.ticker.remove(
            this.updateTicker
        );


        this.dealerPresentationController
            .destroy();


        if (this.cheatPanel) {

            this.removeChild(
                this.cheatPanel
            );

            this.cheatPanel.destroy({
                children: true
            });
        }
    }
}