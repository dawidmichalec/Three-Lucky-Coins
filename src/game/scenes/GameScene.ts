import { Application, Ticker } from "pixi.js";
import { Player } from "../Player";
import { GameController } from "../GameController";
import { CoinRow } from "../../ui/CoinRow";
import { CoinSide } from "../../ui/Coin";
import { CheatPanel } from "../../dev/CheatPanel";
import { CheatManager } from "../../dev/CheatManager";
import { BaseScene } from "./BaseScene";
import { SceneManager } from "../SceneManager";
import { PopupManager } from "../../ui/popups/PopupManager";
import { StatsManager } from "../../core/StatsManager";
import { OddsManager } from "../probability/OddsManager";
import { GoldenCoinManager } from "../goldenCoins/GoldenCoinManager";
import { DealerData } from "../dealers/DealerData";
import { GameCheatController } from "../../dev/GameCheatController";
import { DealerFightManager } from "../dealers/DealerFightManager";
import { RoundResolver } from "../round/RoundResolver";
import { RunStatsRecorder } from "../../stats/RunStatsRecorder";
import { RunEndController } from "../run/RunEndController";
import { DealerPresentationController } from "../../ui/controllers/DealerPresentationController";
import { RoundOutcomeHandler } from "../round/RoundOutcomeHandler";
import { GameSceneView } from "../../ui/GameSceneView";
import { RunDealerGenerator } from "../run/RunDealerGenerator";
import { GambleForMoreManager } from "../gambleForMore/GambleForMoreManager";
import { GambleForMoreOffer } from "../gambleForMore/GambleForMoreTypes";
import { CardColor } from "../gambleForMore/games/redBlackCard/RedBlackCardTypes";
import { RedBlackCardGame } from "../gambleForMore/games/redBlackCard/RedBlackCardGame";
import { DealerSkillFeedbackHandler } from "../dealers/DealerSkillFeedbackHandler";
import { DealerCollectionManager } from "../dealers/collection/DealerCollectionManager";
import { StreakMultiplierManager } from "../streak/StreakMultiplierManager";
import { StreakResolution, StreakAction } from "../streak/StreakResolution";
import { PerkRewardGenerator } from "../perks/reward/PerkRewardGenerator";
import { RunPerkRewardState } from "../perks/reward/RunPerkRewardState";
import { PerkReward } from "../perks/reward/PerkReward";
import { RunPerkManager } from "../perks/RunPerkManager";
import { PerkEffectApplier,} from "../perks/PerkEffectApplier";
import { PerkEffectMessageType } from "../../ui/overlays/PerkEffectOverlay";
import { roundMoney } from "../util/MoneyUtils";
import { OddsTable } from "../probability/OddsTypes";
import { GAME_CONFIG } from "../../config/GameConfig";
import { RoundPayoutResolver } from "../round/RoundPayoutResolver";
import { RoundBetResolver } from "../round/RoundBetResolver";
import { RoundPayoutPresentationController } from "../../ui/controllers/RoundPayoutPresentationController";

export class GameScene extends BaseScene {
  private player: Player;
  private controller: GameController;
  private coinRow!: CoinRow;
  private roundState: "ready" | "spinning" | "result" = "ready";
  private cheatPanel?: CheatPanel;
  private cheatManager = new CheatManager();
  private updateTicker!: (ticker: Ticker) => void;
  private statsManager!: StatsManager;
  private oddsManager = OddsManager.getInstance();
  private goldenCoinManager = GoldenCoinManager.getInstance();
  private isChangingDealer = false;
  private dealerFightManager!: DealerFightManager;
  private gameCheatController!: GameCheatController;
  private runStatsRecorder!: RunStatsRecorder;
  private runEndController!: RunEndController;
  private dealerPresentationController!: DealerPresentationController;
  private roundOutcomeHandler = new RoundOutcomeHandler();
  private view: GameSceneView;
  private gambleForMoreManager = new GambleForMoreManager();
  private pendingGambleOffer?: GambleForMoreOffer;
  private pendingStreakResolution?: StreakResolution;
  private redBlackCardGame = new RedBlackCardGame();
  private dealerSkillFeedbackHandler!: DealerSkillFeedbackHandler;
  private dealerCollectionManager = DealerCollectionManager.getInstance();
  private streakMultiplierManager = new StreakMultiplierManager();
  private perkRewardGenerator = new PerkRewardGenerator();
  private runPerkRewardState = new RunPerkRewardState();
  private runPerkManager = new RunPerkManager();
  private perkEffectApplier = new PerkEffectApplier(this.runPerkManager, this.streakMultiplierManager,);
  private roundPayoutResolver = new RoundPayoutResolver(this.perkEffectApplier);
  private roundBetResolver = new RoundBetResolver(this.perkEffectApplier,);
  private riskTakerWasActive = false;
  private preparedCoinSenseResult?: CoinSide[];
  private roundPayoutPresentationController!: RoundPayoutPresentationController;
  

  constructor(
    private app: Application,
    private popupManager: PopupManager,
    private sceneManager: SceneManager,
  ) {
    super();

    this.sortableChildren = true;

    // RUN DEALERS

    const dealerOrder = RunDealerGenerator.generateRun();

    console.log(
      "RUN DEALER ORDER:",
      dealerOrder.map((dealer) => dealer.name),
    );

    this.dealerFightManager = new DealerFightManager(dealerOrder);

    this.applyDealerSettings(this.currentDealer);

    this.dealerCollectionManager.discoverDealer(this.currentDealer.id);

    this.setupTicker();

    // StatsManager

    this.statsManager = StatsManager.getInstance();

    // RunStatsRecorder

    this.runStatsRecorder = new RunStatsRecorder(this.statsManager);

    // Player
    this.player = new Player(25);

    // GameSceneView

    this.view = new GameSceneView(
      this.currentDealer,
      this.sceneManager,
      this.popupManager,
      {
        onBetDown: () => this.handleBetDown(),

        onBetUp: () => this.handleBetUp(),

        onPrevCombo: () => this.controller.prevCombo(),

        onNextCombo: () => this.controller.nextCombo(),

        onToss: () => this.handleToss(),

        onRestartRun: () => {
          this.statsManager.finishRun();

          this.sceneManager.showGame();
        },

        onMainMenu: () => {
          this.statsManager.finishRun();

          this.sceneManager.showMainMenu();
        },

        onGambleForMoreYes: () => this.handleGambleForMoreYes(),

        onGambleForMoreNo: () => this.handleGambleForMoreNo(),

        onGambleForMoreColorSelected: (color) =>
          this.handleGambleForMoreColorSelected(color),

        onPerkRewardConfirm: (reward) => this.handlePerkRewardConfirm(reward),

        onPerkRewardSkip: () => this.handlePerkRewardSkip(),
      },
    );

    this.view.zIndex = 1000;

    this.addChild(this.view);

    // ROUND PAYOUT PRESENTATION CONTROLLER

    this.roundPayoutPresentationController =
      new RoundPayoutPresentationController(
        this.view.gameUI,
        this.view.perkEffectMessageOverlay,
      );

    // DEALER SKILL FEEDBACK HANDLER

    this.dealerSkillFeedbackHandler = new DealerSkillFeedbackHandler(
      this.view.gameMessageOverlay,
    );

    // NEW ROUND

    this.prepareNextRound();

    // CONTROLLER
    this.controller = new GameController({
      onBetChange: (bet) => {
        this.view.gameUI.updateBet(bet);

        this.refreshFreeBetIndicator();

        this.refreshRiskTakerState();
      },

      onComboChange: (combo) => {
        this.view.gameUI.updateCombination(combo);
      },
    });

    // INITIAL UI STATE

    this.view.gameUI.updateBalance(this.player.balance);

    this.view.gameUI.updateBet(this.controller.getBet());

    this.view.gameUI.updateMultiplier(this.streakMultiplierManager.getValue());

    this.gameCheatController = new GameCheatController(
      this.cheatManager,
      this.controller,
      this.goldenCoinManager,
      this.perkRewardGenerator,
      {
        onDealerWin: () => {
          void this.showDealerVictory();
        },

        onGameOver: () => {
          this.triggerGameOver();
        },
      },
    );

    if (
        GAME_CONFIG.DEV_MODE
    ) {

        this.cheatPanel =
            new CheatPanel(
                this.cheatManager
            );

        this.addChild(
            this.cheatPanel
        );
    }

    // Dealer Presentation Controller

    this.dealerPresentationController = new DealerPresentationController(
      this.view,
      () => {
        this.startDealerFight();

        this.roundState = "ready";

        this.isChangingDealer = false;

        this.unlockControls();
      },
    );

    this.dealerPresentationController.createInitial(this.currentDealer);

    this.runEndController = new RunEndController(
      this.statsManager,

      this.view.runSummaryPanel,

      this.view.gameOverOverlay,

      this.view.gameMessageOverlay,

      {
        onLockControls: () => this.lockControls(),

        onUnlockControls: () => this.unlockControls(),
      },
    );
  }

  override async init(): Promise<void> {
    await Promise.all([
      this.view.init(),
      this.view.gameUI.init(),
      this.dealerPresentationController.initCurrent(),
      this.createCoinRow(),
    ]);

    this.lockControls();
  }

  private async tryTriggerPiggyBank(): Promise<boolean> {
    const minimumBet = this.controller.getMinBet();

    const result = this.perkEffectApplier.applyPiggyBank(
      this.player.balance,
      minimumBet,
    );

    if (!result.triggered) {
      return false;
    }

    /*
            Uzupełniamy saldo dokładnie
            do wartości minimum bet.
        */

    this.player.balance = result.finalBalance;

    this.view.gameUI.updateBalance(this.player.balance);

    await this.view.perkEffectMessageOverlay.play(
      "piggyBankActivated",
      `+${result.amountGranted.toFixed(2)}`,
      PerkEffectMessageType.POSITIVE,
    );

    if (result.consumed) {
      await this.view.gameUI.removePerk("piggy_bank");
    }

    return true;
  }

  private prepareCoinSense(): void {
    if (!this.perkEffectApplier.isCoinSenseAvailable()) {
      this.preparedCoinSenseResult = undefined;

      return;
    }

    /*
            Losujemy PRAWDZIWY wynik
            według aktualnych oddsów dealera.
        */

    const result = this.oddsManager.rollResult();

    /*
            Zapamiętujemy go.

            Ten dokładny wynik musi zostać
            później użyty przez spin.
        */

    this.preparedCoinSenseResult = result;

    /*
            Tworzymy OddsTable wyłącznie
            do prezentacji graczowi.
        */

    const revealedOdds: OddsTable = {
      coin1: this.createRevealedCoinOdds(result[0]),

      coin2: this.createRevealedCoinOdds(result[1]),

      coin3: this.createRevealedCoinOdds(result[2]),
    };

    this.view.gameUI.updateProbability(revealedOdds);

    console.log("COIN SENSE RESULT:", result.join("-"));
  }

  private createRevealedCoinOdds(side: CoinSide) {
    if (side === CoinSide.Heads) {
      return {
        heads: 1,
        tails: 0,
      };
    }

    return {
      heads: 0,
      tails: 1,
    };
  }

  private refreshRiskTakerState(): void {
    const currentBet = this.controller.getBet();

    const highestAffordableBet = this.controller.getHighestAffordableBet(
      this.player.balance,
    );

    const payoutMultiplier =
      this.perkEffectApplier.getRiskTakerPayoutMultiplier(
        currentBet,
        highestAffordableBet,
      );

    const active = payoutMultiplier !== undefined;

    if (active && !this.riskTakerWasActive) {
      const increasePercentage = roundMoney((payoutMultiplier! - 1) * 100);

      void this.view.perkEffectMessageOverlay.play(
        "winningsIncreasedBy",

        `${increasePercentage}%`,

        PerkEffectMessageType.POSITIVE,
      );
    }

    this.riskTakerWasActive = active;
  }

  private refreshFreeBetIndicator(): void {
    const bet = this.controller.getBet();

    const isFree = this.perkEffectApplier.isCurrentBetFree(bet);

    this.view.gameUI.setFreeBetIndicator(isFree);
  }

  private applyDealerSettings(dealer: DealerData) {
    this.goldenCoinManager.configure(dealer.goldenCoinSettings);

    this.gambleForMoreManager.configure(dealer.gambleForMoreSettings);
  }

  private prepareNextRound() {
    const odds = this.oddsManager.rollOdds(this.currentDealer.oddsProfile);

    this.view.gameUI.updateProbability(odds);
  }

  private prepareNextRoundWithPerks(): void {
    this.prepareNextRound();

    if (this.perkEffectApplier.isCoinSenseAvailable()) {
      this.prepareCoinSense();
    }
  }

  private get currentDealer(): DealerData {
    return this.dealerFightManager.getCurrentDealer();
  }

  private startDealerFight() {
    const fight = this.dealerFightManager.startFight(this.player.balance);

    this.view.gameUI.updateDealerObjective(
      this.currentDealer,
      fight.targetBalance,
    );
  }

  private isCurrentDealerDefeated(): boolean {
    return this.dealerFightManager.isCurrentDealerDefeated(this.player.balance);
  }

  private async handleDealerDefeated(): Promise<void> {
    if (this.isChangingDealer) {
      return;
    }

    this.isChangingDealer = true;

    this.lockControls();

    const defeatedDealer = this.currentDealer;

    this.dealerCollectionManager.unlockSignatureToken(defeatedDealer.id);

    console.log("SIGNATURE TOKEN UNLOCKED:", defeatedDealer.name);

    await this.view.gameMessageOverlay.play("youWon");

    // TEMP - PERK REWARD GENERATOR TEST

    const perkRewards = this.perkRewardGenerator.generate(
      this.runPerkRewardState,
      3,
    );

    console.group(`PERK REWARDS - ${defeatedDealer.name}`);

    console.table(
      perkRewards.map((reward) => ({
        perk: reward.perk.id,
        rarity: reward.variant.rarity,
      })),
    );

    console.groupEnd();

    this.view.perkRewardOverlay.show(perkRewards);
  }

  private async handlePerkRewardConfirm(reward: PerkReward): Promise<void> {
    const added = this.runPerkManager.addPerk(reward);

    if (!added) {
      console.warn("PERK ALREADY OWNED:", reward.perk.id);

      return;
    }

    console.log("PERK ACQUIRED:", reward.perk.id, reward.variant.rarity);

    this.perkEffectApplier.applyPerk(reward);

    this.refreshFreeBetIndicator();

    this.refreshRiskTakerState();

    this.view.perkRewardOverlay.hide();

    await this.view.gameUI.addPerk(reward);

    await this.wait(900);

    await this.continueAfterPerkReward();
  }

  private async handlePerkRewardSkip(): Promise<void> {
    console.log("PERK REWARD SKIPPED");

    this.view.perkRewardOverlay.hide();

    await this.continueAfterPerkReward();
  }

  private async continueAfterPerkReward(): Promise<void> {
    const nextDealer = this.dealerFightManager.advanceToNextDealer();

    if (!nextDealer) {
      console.log("All currently available dealers defeated.");

      await this.runEndController.showRunVictory();

      return;
    }

    await this.loadDealer(nextDealer);

    this.isChangingDealer = false;
  }

  private async loadDealer(dealer: DealerData): Promise<void> {
    this.dealerCollectionManager.discoverDealer(dealer.id);

    this.perkEffectApplier.resetFightEffects();

    this.riskTakerWasActive = false;

    this.refreshRiskTakerState();

    this.streakMultiplierManager.reset();

    this.view.gameUI.updateMultiplier(this.streakMultiplierManager.getValue());

    this.refreshFreeBetIndicator();

    this.view.gameUI.updateWon(0);

    this.applyDealerSettings(dealer);

    /*
            Aktualizacja małej karty i paneli.
        */

    await this.view.gameUI.setDealer(dealer);

    /*
            Nowe prawdopodobieństwa dealera
            przygotowujemy przed startem walki.
        */

    this.prepareNextRound();

    /*
            Jeżeli mamy Coin Sense,
            losujemy pierwszy wynik walki
            i nadpisujemy wyłącznie jego
            prezentację w Probability Display.
        */

    this.prepareCoinSense();

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

    if (nextBet === null) {
      return;
    }

    const nextBetCost = this.perkEffectApplier.resolveBetCost(nextBet);

    if (nextBetCost > this.player.balance) {
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

    this.coinRow.zIndex = 0;

    this.addChild(this.coinRow);
  }


  // START ROUND - FUNCTION RESPONSIBLE FOR THE GAME LOOP

  private async startRound() {
    const bet = this.controller.getBet();

    const highestAffordableBet = this.controller.getHighestAffordableBet(
      this.player.balance,
    );

    const betResult = this.roundBetResolver.resolve({bet,});

    const {
      betCost,
      payoutBet,
      doubleDownActive,
      coinSenseActive,
    } = betResult;

    if (this.player.balance < betCost) {
      this.popupManager.show("insufficientBalance");

      return;
    }

    if (this.roundState !== "ready") {
      return;
    }

    this.roundState = "spinning";

    if (coinSenseActive) {
      this.perkEffectApplier.consumeCoinSense();
    }

    this.lockControls();

    this.view.gameUI.updateWon(0);

    if (doubleDownActive) {
      await this.view.perkEffectMessageOverlay.play(
        "doubleDownActive",
        "",
        PerkEffectMessageType.POSITIVE,
      );
    }

    this.player.balance -= betCost;

    this.perkEffectApplier.recordBet();

    this.refreshFreeBetIndicator();

    this.view.gameUI.updateBalance(this.player.balance);

    this.view.controls.startTossAnimation();

    const baseResult = this.generateResult();

    const goldenResult = this.goldenCoinManager.applyGoldenCoins(baseResult);

    const resultSides = goldenResult.map((outcome) => outcome.side);

    const selected = this.controller.getCurrentCombo();

    await this.coinRow.spin(goldenResult, selected);

    this.statsManager.recordCoinsTossed(resultSides.length);

    const goldenMultiplier =
      this.goldenCoinManager.getGoldenMultiplier(goldenResult);

    const resolution = RoundResolver.resolve({
      selected,

      result: resultSides,

      bet: payoutBet,

      streakMultiplier: this.streakMultiplierManager.getValue(),

      goldenMultiplier,
    });

    const win = resolution.win;

    const luckyHandTriggered = this.perkEffectApplier.recordLuckyHandToss(win);

    const winAmount = resolution.winAmount;

    const doubleDownActivated =
      this.perkEffectApplier.recordDoubleDownSpinResult(win, doubleDownActive);

    const outcome = this.roundOutcomeHandler.apply({
      win,
      winAmount,
      currentDealer: this.currentDealer,
    });

    await this.dealerSkillFeedbackHandler.handle(outcome.triggeredSkills);

    const streakResolution = outcome.streakResolution;

    /*
            ROUND STATS
        */

    this.runStatsRecorder.startRound({
      selected,
      bet,
    });

    /*
            WIN
        */

    if (win && winAmount !== undefined) {
      const resolvedWinAmount = outcome.wonAmount;

      const payoutResult =
        this.roundPayoutResolver
            .resolve({
                winAmount:
                    resolvedWinAmount,

                bet,

                highestAffordableBet,

                coinSenseActive,

                luckyHandTriggered
            });

      const {
          coinSenseResult,
          riskTakerResult,
          gamblerResult,
          luckyHandResult,
          finalWinAmount
      } = payoutResult;

      console.log(
        "BASE WIN:",
        winAmount,

        "RESOLVED WIN:",
        resolvedWinAmount,

        "RISK TAKER BONUS:",
        riskTakerResult.bonusAmount,

        "FINAL WIN:",
        finalWinAmount,
      );

      await this.roundPayoutPresentationController.present(
        resolvedWinAmount,
        coinSenseResult,
        riskTakerResult,
        gamblerResult,
        luckyHandResult,
      );

      const gambleTriggered = this.gambleForMoreManager.shouldTrigger();

      if (gambleTriggered) {
        this.pendingStreakResolution = outcome.streakResolution;

        this.startGambleForMore(finalWinAmount, bet);

        return;
      }

      this.streakMultiplierManager.applyResolution(streakResolution);

      this.view.gameUI.updateMultiplier(
        this.streakMultiplierManager.getValue(),
      );

      this.runStatsRecorder.finishRound({
        win: true,

        winAmount: finalWinAmount,

        streakMultiplier: this.streakMultiplierManager.getValue(),
      });

      if (doubleDownActivated) {
        await this.view.perkEffectMessageOverlay.play(
          "nextSpinDoubleDown",
          "",
          PerkEffectMessageType.POSITIVE,
        );
      }

      this.commitWin(finalWinAmount);

      await this.finishRound();

      return;
    }

    /*
            LOSS
        */

    const insuranceResult =
      this.perkEffectApplier.resolveLossStreakResolution(streakResolution);

    if (insuranceResult.triggered) {
      void this.view.perkEffectMessageOverlay.play(
        "streakMultiplierProtected",
        "",
        PerkEffectMessageType.POSITIVE,
      );
    }

    this.streakMultiplierManager.applyResolution(
      insuranceResult.streakResolution,
    );

    this.view.gameUI.updateMultiplier(this.streakMultiplierManager.getValue());

    this.runStatsRecorder.finishRound({
      win: false,
      streakMultiplier: this.streakMultiplierManager.getValue(),
    });

    const gamblerMultiplier = this.perkEffectApplier.activateGamblerAfterLoss();

    if (gamblerMultiplier !== undefined) {
      const increasePercentage = roundMoney((gamblerMultiplier - 1) * 100);

      await this.view.perkEffectMessageOverlay.play(
        "nextWinIncreasedBy",
        `${increasePercentage}%`,
        PerkEffectMessageType.POSITIVE,
      );
    }

    await this.finishRound();
  }

  private startGambleForMore(winAmount: number, bet: number) {
    const offer = this.gambleForMoreManager.createOffer(winAmount, bet);

    this.pendingGambleOffer = offer;

    this.roundState = "result";

    this.view.gambleForMoreOverlay.showOffer(offer);
  }

  private async handleGambleForMoreNo() {
    const offer = this.pendingGambleOffer;

    if (!offer) {
      return;
    }

    this.view.gambleForMoreOverlay.hide();

    this.commitWin(offer.currentWin);

    if (this.pendingStreakResolution) {
      this.streakMultiplierManager.applyResolution(
        this.pendingStreakResolution,
      );

      this.view.gameUI.updateMultiplier(
        this.streakMultiplierManager.getValue(),
      );
    }

    this.runStatsRecorder.finishRound({
      win: true,
      winAmount: offer.currentWin,
      streakMultiplier: this.streakMultiplierManager.getValue(),
    });

    this.pendingGambleOffer = undefined;
    this.pendingStreakResolution = undefined;

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

    const result = this.redBlackCardGame.play(selectedColor);

    console.log("RED BLACK RESULT:", result);

    /*
            Najpierw pokazujemy graczowi,
            co faktycznie wylosował.
        */

    await this.view.gambleForMoreOverlay.revealResult(result.resultColor);

    /*
            Chwila na zobaczenie rezultatu.
        */

    await this.wait(1200);

    /*
            Dopiero teraz rozliczamy wynik.
        */

    if (result.won) {
      const nextOffer = this.gambleForMoreManager.createOffer(
        offer.potentialWin,
        offer.potentialWin,
      );

      this.pendingGambleOffer = nextOffer;

      this.view.gambleForMoreOverlay.showOffer(nextOffer);

      return;
    } else {
      this.perkEffectApplier.resetDoubleDownProgress();

      const insuranceResult =
        this.perkEffectApplier.resolveLossStreakResolution({
          action: StreakAction.RESET,
        });

      if (insuranceResult.triggered) {
        await this.view.perkEffectMessageOverlay.play(
          "streakMultiplierProtected",
          "",
          PerkEffectMessageType.POSITIVE,
        );
      }

      this.streakMultiplierManager.applyResolution(
        insuranceResult.streakResolution,
      );

      this.view.gameUI.updateWon(0);

      this.runStatsRecorder.finishRound({
        win: false,

        streakMultiplier: this.streakMultiplierManager.getValue(),
      });

      const gamblerMultiplier =
        this.perkEffectApplier.activateGamblerAfterLoss();

      if (gamblerMultiplier !== undefined) {
        const increasePercentage = roundMoney((gamblerMultiplier - 1) * 100);

        await this.view.perkEffectMessageOverlay.play(
          "nextWinIncreasedBy",
          `${increasePercentage}%`,
          PerkEffectMessageType.POSITIVE,
        );
      }
    }

    this.view.gameUI.updateMultiplier(this.streakMultiplierManager.getValue());

    this.view.gambleForMoreOverlay.hide();

    this.pendingGambleOffer = undefined;
    this.pendingStreakResolution = undefined;

    await this.finishRound();
  }

  private wait(milliseconds: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, milliseconds);
    });
  }

  private async finishRound() {
    const currentBetCost = this.perkEffectApplier.resolveBetCost(
      this.controller.getBet(),
    );

    if (currentBetCost > this.player.balance) {
      this.controller.adjustBetToBalance(this.player.balance);
    }

    if (this.isCurrentDealerDefeated()) {
      this.roundState = "result";

      await this.handleDealerDefeated();

      return;
    }

    if (!this.canPlay()) {
      await this.tryTriggerPiggyBank();

      this.controller.adjustBetToBalance(this.player.balance);

      console.log(
        "PIGGY BANK CONSUMED:",
        !this.runPerkManager.hasPerk("piggy_bank"),
      );
    }

    if (!this.canPlay()) {
      this.roundState = "result";

      this.triggerGameOver();

      return;
    }

    this.prepareNextRoundWithPerks();

    this.roundState = "ready";

    this.unlockControls();
  }

  private commitWin(amount: number) {
    this.player.addWin(amount);

    this.view.gameUI.updateBalance(this.player.balance);

    this.view.gameUI.updateWon(amount);

    this.refreshRiskTakerState();
  }

  private generateResult(): CoinSide[] {
    const forcedResult = this.gameCheatController.consumeForcedResult();

    if (forcedResult) {
      return forcedResult;
    }

    if (this.preparedCoinSenseResult) {
      const result = this.preparedCoinSenseResult;

      this.preparedCoinSenseResult = undefined;

      return result;
    }

    return this.oddsManager.rollResult();
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
    const minBet = this.controller.getMinBet();

    const minBetCost = this.perkEffectApplier.resolveBetCost(minBet);

    return this.player.balance >= minBetCost;
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
    this.app.ticker.remove(this.updateTicker);

    this.dealerPresentationController.destroy();

    if (this.cheatPanel) {
      this.removeChild(this.cheatPanel);

      this.cheatPanel.destroy({
        children: true,
      });
    }
  }
}
