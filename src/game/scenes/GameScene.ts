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
import { OddsManager } from "../probability/OddsManager";
import { GoldenCoinManager } from "../goldenCoins/GoldenCoinManager";
import { DealerData } from "../dealers/DealerData";
import { GameCheatController } from '../../dev/GameCheatController';
import { DealerFightManager } from "../dealers/DealerFightManager";
import { RoundResolver } from "../round/RoundResolver";
import { RunStatsRecorder } from "../../stats/RunStatsRecorder";
import { RunEndController } from "../run/RunEndController";
import { DealerPresentationController } from "../../ui/controllers/DealerPresentationController";
import { RoundOutcomeHandler } from "../round/RoundOutcomeHandler";
import { GameSceneView } from "../../ui/GameSceneView";
import { RunDealerGenerator } from '../run/RunDealerGenerator';
import { GambleForMoreManager } from "../gambleForMore/GambleForMoreManager";
import { GambleForMoreOffer } from "../gambleForMore/GambleForMoreTypes";
import { CardColor } from "../gambleForMore/games/redBlackCard/RedBlackCardTypes";
import { RedBlackCardGame } from "../gambleForMore/games/redBlackCard/RedBlackCardGame";
import { DealerSkillFeedbackHandler } from "../dealers/DealerSkillFeedbackHandler";
import { DealerCollectionManager } from '../dealers/collection/DealerCollectionManager';
import { StreakMultiplierManager } from '../streak/StreakMultiplierManager';


export class GameScene extends BaseScene {
    
    private player: Player;
    private controller: GameController;
    private coinRow!: CoinRow;
    private roundState: 'ready' | 'spinning' | 'result' = 'ready';
    private cheatPanel: CheatPanel;
    private cheatManager = new CheatManager();
    private updateTicker!: (ticker: Ticker) => void;
    private statsManager!: StatsManager;
    private oddsManager = OddsManager.getInstance();
    private goldenCoinManager = GoldenCoinManager.getInstance();
    private isChangingDealer = false;
    private dealerFightManager!:DealerFightManager;
    private gameCheatController!: GameCheatController;
    private runStatsRecorder!: RunStatsRecorder;
    private runEndController!: RunEndController;
    private dealerPresentationController!: DealerPresentationController;
    private roundOutcomeHandler =new RoundOutcomeHandler();
    private view: GameSceneView;
    private gambleForMoreManager = new GambleForMoreManager();
    private pendingGambleOffer?: GambleForMoreOffer;
    private pendingStreakMultiplier?: number;
    private redBlackCardGame = new RedBlackCardGame();
    private dealerSkillFeedbackHandler!: DealerSkillFeedbackHandler;
    private dealerCollectionManager = DealerCollectionManager.getInstance();
    private streakMultiplierManager = new StreakMultiplierManager();


    constructor (
        private app: Application,
        private popupManager: PopupManager,
        private sceneManager: SceneManager
    ) {
        super();

        this.sortableChildren = true;

        // RUN DEALERS

        const dealerOrder =
            RunDealerGenerator
                .generateRun();

        console.log(
            "RUN DEALER ORDER:",
            dealerOrder.map(
                dealer =>
                    dealer.name
            )
        );


        this.dealerFightManager =
            new DealerFightManager(
                dealerOrder
            );

        this.applyDealerSettings(
            this.currentDealer
        );

        this.dealerCollectionManager.discoverDealer(
            this.currentDealer.id
        );

        this.setupTicker();

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
                    },

                    onGambleForMoreYes: () =>
                        this.handleGambleForMoreYes(),

                    onGambleForMoreNo: () =>
                        this.handleGambleForMoreNo(),

                    onGambleForMoreColorSelected:
                        color =>
                            this.handleGambleForMoreColorSelected(
                                color
                            )

                }
            );

        this.view.zIndex = 1000;

        this.addChild(
            this.view
        );

        // DEALER SKILL FEEDBACK HANDLER

        this.dealerSkillFeedbackHandler = new DealerSkillFeedbackHandler(
            this.view.gameMessageOverlay
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

        this.view.gameUI.updateMultiplier(
            this.streakMultiplierManager.getValue()
        );


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
                    .gameMessageOverlay,

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
            this.view.init(),
            this.view.gameUI.init(),
            this.dealerPresentationController.initCurrent(),
            this.createCoinRow()
        ]);

        this.lockControls();
    }


    private applyDealerSettings(
        dealer: DealerData
    ) {

        this.goldenCoinManager.configure(
            dealer.goldenCoinSettings
        );


        this.gambleForMoreManager.configure(
            dealer.gambleForMoreSettings
        );
    }

    private prepareNextRound() {

        const odds =
            this.oddsManager.rollOdds(
                this.currentDealer
                    .oddsProfile
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


    private async handleDealerDefeated(): Promise<void> {

        if (this.isChangingDealer) {
            return;
        }

        this.isChangingDealer = true;

        this.lockControls();


        const defeatedDealer = this.currentDealer;


        this.dealerCollectionManager.unlockSignatureToken(
            defeatedDealer.id
        );


        console.log(
            "SIGNATURE TOKEN UNLOCKED:",
            defeatedDealer.name
        );


        await this.view.gameMessageOverlay.play(
            "youWon"
        );


        const nextDealer =
            this.dealerFightManager.advanceToNextDealer();


        if (!nextDealer) {

            console.log(
                "All currently available dealers defeated."
            );

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

        this.dealerCollectionManager.discoverDealer(dealer.id);

        /*
            Nowa walka zaczyna się od x1.
            Dzięki temu passa nie przechodzi
            automatycznie między dealerami.
        */

        this.streakMultiplierManager.reset();

        this.view.gameUI.updateMultiplier(
            this.streakMultiplierManager.getValue()
        );

        this.view.gameUI.updateWon(0);

        this.applyDealerSettings(
            dealer
        );

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

    // START ROUND - FUNCTION RESPONSIBLE FOR THE GAME LOOP

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
                    this.streakMultiplierManager.getValue(),

                goldenMultiplier
            });


        const win =
            resolution.win;


        const winAmount =
            resolution.winAmount;


        const outcome = this.roundOutcomeHandler.apply({
            win,
            winAmount,
            currentDealer: this.currentDealer,
            currentStreakMultiplier: this.streakMultiplierManager.getValue()
        });

        await this.dealerSkillFeedbackHandler.handle(
            outcome.triggeredSkills
        );

        const pendingStreakMultiplier = outcome.newStreakMultiplier;


        /*
            ROUND STATS
        */

        this.runStatsRecorder.startRound({
            selected,
            bet
        });


        /*
            WIN
        */

        if (win && winAmount !== undefined) {

            const resolvedWinAmount = outcome.wonAmount;

            console.log(
                "BASE WIN:",
                winAmount,
                "RESOLVED WIN:",
                resolvedWinAmount
            );

            const gambleTriggered = this.gambleForMoreManager.shouldTrigger();

            if (gambleTriggered) {

                this.pendingStreakMultiplier = pendingStreakMultiplier;

                this.startGambleForMore(
                    resolvedWinAmount,
                    bet
                );

                return;
            }

            this.streakMultiplierManager.setValue(
                pendingStreakMultiplier
            );

            this.view.gameUI.updateMultiplier(
                this.streakMultiplierManager.getValue()
            );

            this.runStatsRecorder.finishRound({
                win: true,
                winAmount: resolvedWinAmount,
                streakMultiplier:
                    this.streakMultiplierManager.getValue()
            });

            this.commitWin(
                resolvedWinAmount
            );

            await this.finishRound();

            return;
        }


        /*
            LOSS
        */

        this.streakMultiplierManager.setValue(
            pendingStreakMultiplier
        );

        this.view.gameUI.updateMultiplier(
            this.streakMultiplierManager.getValue()
        );

        this.runStatsRecorder.finishRound({
            win: false,
            streakMultiplier:
                this.streakMultiplierManager.getValue()
        });

        await this.finishRound();
                
    }


    private startGambleForMore(
        winAmount: number,
        bet: number
    ) {

        const offer = this.gambleForMoreManager.createOffer(
            winAmount,
            bet
        );

        this.pendingGambleOffer = offer;

        this.roundState = "result";

        this.view.gambleForMoreOverlay.showOffer(
            offer
        );
    }


    private async handleGambleForMoreNo() {

        const offer = this.pendingGambleOffer;

        if (!offer) {
            return;
        }

        this.view.gambleForMoreOverlay.hide();

        this.commitWin(offer.currentWin);

        if (this.pendingStreakMultiplier !== undefined) {

            this.streakMultiplierManager.setValue(
                this.pendingStreakMultiplier
            );

            this.view.gameUI.updateMultiplier(
                this.streakMultiplierManager.getValue()
            );
        }

        this.runStatsRecorder.finishRound({
            win: true,
            winAmount: offer.currentWin,
            streakMultiplier:
                this.streakMultiplierManager.getValue()
        });

        this.pendingGambleOffer = undefined;
        this.pendingStreakMultiplier = undefined;

        await this.finishRound();
    }


    private async handleGambleForMoreYes() {

        const offer = this.pendingGambleOffer;

        if (!offer) {
            return;
        }

        console.log("START GAMBLE FOR MORE:", offer);

        await this.view.gambleForMoreOverlay.startGame();
    }


    private async handleGambleForMoreColorSelected(selectedColor: CardColor) {

        const offer = this.pendingGambleOffer;

        if (!offer) {
            return;
        }

        const result = this.redBlackCardGame.play(
            selectedColor
        );

        console.log("RED BLACK RESULT:", result);

        /*
            Najpierw pokazujemy graczowi,
            co faktycznie wylosował.
        */

        await this.view.gambleForMoreOverlay.revealResult(
            result.resultColor
        );

        /*
            Chwila na zobaczenie rezultatu.
        */

        await this.wait(
            1200
        );


        /*
            Dopiero teraz rozliczamy wynik.
        */

        if (result.won) {

            this.commitWin(
                offer.potentialWin
            );

            if (this.pendingStreakMultiplier !== undefined) {
                this.streakMultiplierManager.setValue(
                    this.pendingStreakMultiplier
                );
            }

            this.runStatsRecorder.finishRound({
                win: true,
                winAmount: offer.potentialWin,
                streakMultiplier:
                    this.streakMultiplierManager.getValue()
            });

        } else {

            this.streakMultiplierManager.reset();

            this.view.gameUI.updateWon(
                0
            );

            this.runStatsRecorder.finishRound({
                win: false,
                streakMultiplier:
                    this.streakMultiplierManager.getValue()
            });
        }

        this.view.gameUI.updateMultiplier(
            this.streakMultiplierManager.getValue()
        );

        this.view.gambleForMoreOverlay.hide();

        this.pendingGambleOffer = undefined;
        this.pendingStreakMultiplier = undefined;

        await this.finishRound();
    }


    private wait(milliseconds: number): Promise<void> {

        return new Promise(resolve => {
            setTimeout(
                resolve,
                milliseconds
            );
        });
    }


    private async finishRound() {

        this.controller.adjustBetToBalance(
            this.player.balance
        );


        if (
            this.isCurrentDealerDefeated()
        ) {

            this.roundState =
                "result";

            await this.handleDealerDefeated();

            return;
        }


        if (!this.canPlay()) {

            this.roundState =
                "result";

            this.triggerGameOver();

            return;
        }


        this.prepareNextRound();

        this.roundState =
            "ready";

        this.unlockControls();
    }


    private commitWin(amount: number) {

        this.player.addWin(amount);

        this.view.gameUI.updateBalance(
            this.player.balance
        );

        this.view.gameUI.updateWon(
            amount
        );
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