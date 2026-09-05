import { Application, Ticker } from "pixi.js";
import { Player } from "../Player";
import { GameController, BetChangeSource } from "../GameController";
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
import { CardColor } from "../gambleForMore/games/redBlackCard/RedBlackCardTypes";
import { DealerSkillFeedbackHandler } from "../dealers/DealerSkillFeedbackHandler";
import { DealerCollectionManager } from "../dealers/collection/DealerCollectionManager";
import { StreakMultiplierManager } from "../streak/StreakMultiplierManager";
import { StreakResolution, StreakAction } from "../streak/StreakResolution";
import { PerkRewardGenerator } from "../perks/reward/PerkRewardGenerator";
import { RunPerkRewardState } from "../perks/reward/RunPerkRewardState";
import { PerkReward } from "../perks/reward/PerkReward";
import { RunPerkManager } from "../perks/RunPerkManager";
import { PerkEffectApplier,} from "../perks/PerkEffectApplier";
import { GAME_CONFIG } from "../../config/GameConfig";
import { RoundPayoutResolver } from "../round/RoundPayoutResolver";
import { RoundBetResolver } from "../round/RoundBetResolver";
import { RoundPayoutPresentationController } from "../../ui/controllers/RoundPayoutPresentationController";
import { GambleForMoreController } from "../gambleForMore/GambleForMoreController";
import { PerkGameplayController } from "../perks/controllers/PerkGameplayController";
import { ObjectiveType } from "../objectives/ObjectiveTypes";
import { DealerRole } from "../dealers/DealerRole";
import { DealerSkillId } from "../dealers/DealerSkill";
import { PerkEffectMessageType } from "../../ui/overlays/PerkEffectOverlay";
import { BetRestrictionManager } from "../BetRestrictionManager";

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
  private gambleForMoreController = new GambleForMoreController(this.gambleForMoreManager,);
  private pendingStreakResolution?: StreakResolution;
  private dealerSkillFeedbackHandler!: DealerSkillFeedbackHandler;
  private dealerCollectionManager = DealerCollectionManager.getInstance();
  private streakMultiplierManager = new StreakMultiplierManager();
  private perkRewardGenerator = new PerkRewardGenerator();
  private runPerkRewardState = new RunPerkRewardState();
  private runPerkManager = new RunPerkManager();
  private perkEffectApplier = new PerkEffectApplier(this.runPerkManager, this.streakMultiplierManager,);
  private roundPayoutResolver = new RoundPayoutResolver(this.perkEffectApplier);
  private roundBetResolver = new RoundBetResolver(this.perkEffectApplier,);
  private roundPayoutPresentationController!: RoundPayoutPresentationController;
  private perkGameplayController: PerkGameplayController;
  private mandatoryGambleForMoreActive = false;
  private betRestrictionManager = new BetRestrictionManager();
  

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

        onCombinationSideChange: (
          index,
          side,
        ) => {
          this.controller.setCombinationSide(
            index,
            side,
          );
        },

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

    // CONTROLLER
    this.controller = new GameController({
      onBetChange: (bet, source) => {
          this.view.gameUI.updateBet(bet);

          this.perkGameplayController.refreshBetState();

          if (source === BetChangeSource.PLAYER) {
            this.perkGameplayController.onBetChanged(bet);
          }
        },
      },
      this.betRestrictionManager,
    );


    // PERK GAMEPLAY CONTROLLER

    this.perkGameplayController = new PerkGameplayController(
      this.perkEffectApplier,
      this.oddsManager,
      this.view.gameUI,
      this.view.perkEffectMessageOverlay,
      this.controller,
      this.player,
    );

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

        onNextDealer: () => {
          void this.cheatNextDealer();
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

    // INITAL GAME STATE

    this.prepareNextRound();
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

    this.perkGameplayController.prepareNextRound();
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
    return this.dealerFightManager.isCurrentDealerDefeated(
      this.player.balance,
      this.streakMultiplierManager.getValue(),
    );
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

    if (defeatedDealer.role !== DealerRole.SUPERVISOR) {
      await this.continueToNextDealer();

      return;
    }

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

    this.runPerkRewardState.markAsAcquired(
      reward.perk.id,
    );

    console.log("PERK ACQUIRED:", reward.perk.id, reward.variant.rarity);

    this.perkEffectApplier.applyPerk(reward);

    this.perkGameplayController.refreshBetState();

    this.view.perkRewardOverlay.hide();

    await this.view.gameUI.addPerk(reward);

    await this.wait(900);

    await this.continueToNextDealer();
  }

  private async handlePerkRewardSkip(): Promise<void> {
    console.log("PERK REWARD SKIPPED");

    this.view.perkRewardOverlay.hide();

    await this.continueToNextDealer();
  }

  private async continueToNextDealer(): Promise<void> {
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

    this.betRestrictionManager.setDealer(dealer);

    this.dealerCollectionManager.discoverDealer(dealer.id);

    this.perkEffectApplier.resetFightEffects();

    this.streakMultiplierManager.reset();

    this.view.gameUI.updateMultiplier(this.streakMultiplierManager.getValue());

    this.perkGameplayController.refreshBetState();

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

    this.perkGameplayController.prepareNextRound();

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

    this.coinRow.position.set(625.5, 386.6);

    this.coinRow.zIndex = 0;

    this.addChild(this.coinRow);
  }


  // START ROUND - FUNCTION RESPONSIBLE FOR THE GAME LOOP

  private async startRound() {
    const bet = this.controller.getBet();
    const selected = this.controller.getCurrentCombo();

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

    this.lockControls();

    this.betRestrictionManager.recordBetUsed(bet);

    const betVarietyTriggered =
    this.dealerFightManager.recordBetForVariety(bet);

    if (betVarietyTriggered) {
      await this.dealerSkillFeedbackHandler.handle([
        DealerSkillId.BET_VARIETY,
      ]);

      this.streakMultiplierManager.reset();

      this.view.gameUI.updateMultiplier(
        this.streakMultiplierManager.getValue(),
      );
    }

    const noRepeatsTriggered =
      this.dealerFightManager.recordCombinationForNoRepeats(
        selected,
      );

    if (noRepeatsTriggered) {
      await this.dealerSkillFeedbackHandler.handle([
        DealerSkillId.NO_REPEATS,
      ]);

      this.streakMultiplierManager.reset();

      this.view.gameUI.updateMultiplier(
        this.streakMultiplierManager.getValue(),
      );
    }

    if (coinSenseActive) {
      this.perkEffectApplier.consumeCoinSense();
    }

    this.view.gameUI.updateWon(0);

    await this.perkGameplayController.handleRoundStart(doubleDownActive,);

    this.player.balance -= betCost;

    this.perkEffectApplier.recordBet();

    this.perkGameplayController.refreshBetState();

    this.view.gameUI.updateBalance(this.player.balance);

    this.view.controls.startTossAnimation();

    const baseResult = this.generateResult();

    const goldenResult = this.goldenCoinManager.applyGoldenCoins(baseResult);

    const resultSides = goldenResult.map((outcome) => outcome.side);

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

    const perkRoundResult = this.perkGameplayController.recordRoundResult(win);

    const winAmount = resolution.winAmount;

    const correctGuesses = selected.filter(
      (side, index) => side === resultSides[index],
    ).length;

    const outcome = this.roundOutcomeHandler.apply({
      win,
      winAmount,
      correctGuesses,
      bet: payoutBet,
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
        this.roundPayoutResolver.resolve({
          winAmount: resolvedWinAmount,
          bet,
          highestAffordableBet,
          coinSenseActive,
          luckyHandTriggered:
            perkRoundResult.luckyHandTriggered,
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

      const mandatoryGambleForMoreTriggered =
        this.dealerFightManager.shouldTriggerMandatoryGambleForMore();

      const gambleTriggered =
        mandatoryGambleForMoreTriggered ||
        this.gambleForMoreManager.shouldTrigger();

      if (gambleTriggered) {
        this.pendingStreakResolution =
          outcome.streakResolution;

        if (mandatoryGambleForMoreTriggered) {
          this.dealerFightManager.consumeMandatoryGambleForMore();

          await this.dealerSkillFeedbackHandler.handle([
            DealerSkillId.MANDATORY_GAMBLE_FOR_MORE,
          ]);
        }

        this.startGambleForMore(
          finalWinAmount,
          bet,
          mandatoryGambleForMoreTriggered,
        );

        return;
      }

      this.streakMultiplierManager.applyResolution(streakResolution);

      this.view.gameUI.updateMultiplier(
        this.streakMultiplierManager.getValue(),
      );

      const mandatoryTipTriggered =
        this.dealerFightManager.recordMandatoryTipWin();

      const finalRoundWinAmount =
        this.roundPayoutResolver.resolveFinalWin(
          finalWinAmount,
          mandatoryTipTriggered,
        );

      if (mandatoryTipTriggered) {
        await this.dealerSkillFeedbackHandler.handle([
          DealerSkillId.MANDATORY_TIP,
        ]);

        await this.view.perkEffectMessageOverlay.play(
          "winningsReducedBy",
          "-50%",
          PerkEffectMessageType.NEGATIVE,
        );

        await this.view.gameUI.animatePenaltyIntoWon(
          finalWinAmount - finalRoundWinAmount,
          finalRoundWinAmount,
        );
      }

      this.runStatsRecorder.finishRound({
        win: true,

        winAmount: finalRoundWinAmount,

        streakMultiplier: this.streakMultiplierManager.getValue(),
      });

      this.commitWin(finalRoundWinAmount);

      await this.perkGameplayController.handleWinCommitted();

      await this.finishRound(true);

      return;
    }

    /*
      LOSS
    */

    const finalStreakResolution = await this.perkGameplayController.handleLoss(streakResolution);

    this.streakMultiplierManager.applyResolution(finalStreakResolution);

    this.view.gameUI.updateMultiplier(this.streakMultiplierManager.getValue());

    if (outcome.wonAmount > 0) {
      this.commitPartialPayout(
        outcome.wonAmount,
      );
    }

    this.runStatsRecorder.finishRound({
      win: false,
      streakMultiplier:
        this.streakMultiplierManager.getValue(),
    });

    await this.finishRound(false);
  }

  private startGambleForMore(
    winAmount: number,
    bet: number,
    mandatory = false,
  ) {
    const offer =
      this.gambleForMoreController.start(
        winAmount,
        bet,
      );

    this.mandatoryGambleForMoreActive = mandatory;

    this.roundState = "result";

    this.view.gambleForMoreOverlay.setMandatory(mandatory);
    this.view.gambleForMoreOverlay.showOffer(offer);
  }

  private async handleGambleForMoreNo() {
    const result =
      this.gambleForMoreController.decline();

    this.view.gambleForMoreOverlay.hide();

    const mandatoryTipTriggered =
      this.dealerFightManager.recordMandatoryTipWin();

    const finalRoundWinAmount =
      this.roundPayoutResolver.resolveFinalWin(
        result.winAmount,
        mandatoryTipTriggered,
      );

    if (mandatoryTipTriggered) {
      await this.dealerSkillFeedbackHandler.handle([
        DealerSkillId.MANDATORY_TIP,
      ]);

      await this.view.perkEffectMessageOverlay.play(
        // dokładnie ten sam call co Coin Sense
      );

      await this.view.gameUI.animatePenaltyIntoWon(
        result.winAmount - finalRoundWinAmount,
        finalRoundWinAmount,
      );
    }

    this.commitWin(
      finalRoundWinAmount,
    );

    await this.perkGameplayController.handleWinCommitted();

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
      winAmount: finalRoundWinAmount,
      streakMultiplier:
        this.streakMultiplierManager.getValue(),
    });

    this.pendingStreakResolution = undefined;

    await this.finishRound(true);
  }

  private async handleGambleForMoreYes() {
    if (!this.gambleForMoreController.hasPendingOffer()) {
      return;
    }

    await this.view.gambleForMoreOverlay.startGame();
  }

  private async handleGambleForMoreColorSelected(
    selectedColor: CardColor,
  ) {
    const result =
      this.gambleForMoreController.play(selectedColor);

    console.log("RED BLACK RESULT:", result);

    await this.view.gambleForMoreOverlay.revealResult(
      result.resultColor,
    );

    await this.wait(1200);

    if (this.mandatoryGambleForMoreActive) {
      this.mandatoryGambleForMoreActive = false;

      this.view.gambleForMoreOverlay.setMandatory(false);
    }

    if (result.won) {
      this.dealerFightManager.recordGambleForMoreWin();

      if (
        this.currentDealer.objectiveType ===
        ObjectiveType.WIN_GAMBLE_FOR_MORE
      ) {
        this.view.gameUI.dealerCard.updateObjectiveProgress(
          this.dealerFightManager.getFightGambleForMoreWins(),
          this.dealerFightManager.getFightTargetGambleForMoreWins(),
        );
      }

      const nextOffer =
        this.gambleForMoreController.continueAfterWin();

      this.view.gambleForMoreOverlay.showOffer(nextOffer);

      return;
    }

    await this.handleGambleForMoreLoss();

    this.view.gameUI.updateMultiplier(
      this.streakMultiplierManager.getValue(),
    );

    this.view.gambleForMoreOverlay.hide();

    this.pendingStreakResolution = undefined;

    await this.finishRound(false);
  }


  private async handleGambleForMoreLoss() {
    this.gambleForMoreController.lose();

    const finalStreakResolution = await this.perkGameplayController.handleLoss({action: StreakAction.RESET,});

    this.streakMultiplierManager.applyResolution(finalStreakResolution,);

    this.view.gameUI.updateWon(0);

    this.runStatsRecorder.finishRound({
      win: false,
      streakMultiplier: this.streakMultiplierManager.getValue(),
    });

  }

  private wait(milliseconds: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, milliseconds);
    });
  }

  private async finishRound(win: boolean) {

    this.dealerFightManager.recordMandatoryGambleForMoreRound();

    if (
      this.currentDealer.objectiveType ===
      ObjectiveType.WIN_BETS
    ) {
      if (win) {
        this.dealerFightManager.recordWonBet();
      }

      this.view.gameUI.dealerCard.updateObjectiveProgress(
        this.dealerFightManager.getFightWins(),
        this.dealerFightManager.getFightTargetWins(),
      );
    }

    const currentBetCost = this.perkEffectApplier.resolveBetCost(
      this.controller.getBet(),
    );

    if (this.isCurrentDealerDefeated()) {
      this.roundState = "result";

      await this.handleDealerDefeated();

      return;
    }

    this.controller.adjustBetToRestrictions();

    if (currentBetCost > this.player.balance) {
      this.controller.adjustBetToBalance(
        (bet) => this.isBetAffordable(bet),
      );
    }

    const multiplierKnockoutTriggered =
      this.dealerFightManager.rollMultiplierKnockout(
        this.streakMultiplierManager.getValue(),
      );

    if (multiplierKnockoutTriggered) {
      await this.dealerSkillFeedbackHandler.handle([
        DealerSkillId.MULTIPLIER_KNOCKOUT,
      ]);

      await this.view.playImpactShake();

      this.streakMultiplierManager.knockOut();

      this.view.gameUI.updateMultiplier(
        this.streakMultiplierManager.getValue(),
      );
    }

    if (!this.canPlay()) {
      const minAvailableBet =
        this.controller.getMinAvailableBet();

      if (minAvailableBet !== null) {
        await this.perkGameplayController
          .tryRecoverFromInsufficientBalance(
            minAvailableBet,
          );
      }

      this.controller.adjustBetToBalance(
        (bet) => this.isBetAffordable(bet),
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
  }

  private commitPartialPayout(
    amount: number,
  ): void {
    this.player.addBalance(amount);

    this.view.gameUI.updateBalance(
      this.player.balance,
    );

    this.view.gameUI.updateWon(amount);
  }

  private generateResult(): CoinSide[] {
    const forcedResult =
        this.gameCheatController.consumeForcedResult();

    if (forcedResult) {
        return forcedResult;
    }

    const coinSenseResult =
        this.perkEffectApplier.consumePreparedCoinSenseResult();

    if (coinSenseResult) {
        return coinSenseResult;
    }

    return this.oddsManager.rollResult();
  } 

  private lockControls() {
    this.view.controls.setDisabled(true);
    this.view.setDisabled(true);
    this.view.gameUI.setDisabled(true);
  }

  private unlockControls() {
    this.view.controls.setDisabled(false);
    this.view.setDisabled(false);
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
    const availableBets =
      this.controller.getAvailableBets();

    return availableBets.some((bet) => {
      const betCost =
        this.perkEffectApplier.resolveBetCost(bet);

      return betCost <= this.player.balance;
    });
  }

  private isBetAffordable(bet: number): boolean {
    const betCost =
      this.perkEffectApplier.resolveBetCost(bet);

    return betCost <= this.player.balance;
  }

  // TRIGGER GAME OVER

  private triggerGameOver() {
    void this.runEndController.triggerGameOver();
  }

  // VICTORY

  private async showDealerVictory() {
    await this.runEndController.showDealerVictory();
  }

  // NEXT DEALER CHEAT

  private async cheatNextDealer(): Promise<void> {
    if (
      this.roundState !== "ready" ||
      this.isChangingDealer
    ) {
      return;
    }

    const nextDealer =
      this.dealerFightManager.advanceToNextDealer();

    if (!nextDealer) {
      console.log("No next dealer.");

      return;
    }

    this.isChangingDealer = true;

    this.lockControls();

    console.log(
      "CHEAT - NEXT DEALER:",
      nextDealer.name,
    );

    await this.loadDealer(nextDealer);
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
