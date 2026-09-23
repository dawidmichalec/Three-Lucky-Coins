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
import { RoundTimerManager } from "../RoundTimerManager";
import { getDealerById } from "../dealers/DealerRegistry";
import { AudioManager } from "../../core/AudioManager";
import { SoundId } from "../../audio/SoundId";
import { FORCED_RANDOM_TOSS_PROFILE } from "../probability/DealerOddsProfiles";
import { CoinOdds, DealerOddsProfile, OddsTable } from "../probability/OddsTypes";

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
  private roundTimerManager = new RoundTimerManager();
  private audioManager = AudioManager.getInstance();
  private pendingHabitBreakerTriggered = false;
  private decayRoundStartMultiplier?: number;
  private unstableProbabilityIndex?:0 | 1 | 2;
  private unstableProbabilityOdds?: [CoinOdds,CoinOdds,];
  private unstableProbabilityState = 0;
  private unstableProbabilityElapsed = 0;
  private static readonly UNSTABLE_PROBABILITY_INTERVAL = 700;
  

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

          this.updateCombinationStatus();
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

        onDealer: (dealerId) => {
          void this.cheatDealer(dealerId);
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

        this.startRoundTimerIfNeeded();

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

  private getCoinOdds(
    odds: OddsTable,
    index: 0 | 1 | 2,
  ): CoinOdds {
    switch (index) {
      case 0:
        return odds.coin1;

      case 1:
        return odds.coin2;

      case 2:
        return odds.coin3;
    }
  }

  private startUnstableProbabilityDisplay(
    index: 0 | 1 | 2,
    profile: DealerOddsProfile,
    odds: OddsTable,
  ): void {
    const originalOdds =
      this.getCoinOdds(
        odds,
        index,
      );

    const originalHeadsDominant =
      originalOdds.heads >=
      originalOdds.tails;

    let alternativeOdds: CoinOdds;

    do {
      alternativeOdds =
        this.oddsManager.generateCoinOdds(
          profile,
        );
    } while (
      (alternativeOdds.heads >=
        alternativeOdds.tails) ===
      originalHeadsDominant
    );

    this.unstableProbabilityIndex =
      index;

    this.unstableProbabilityOdds = [
      originalOdds,
      alternativeOdds,
    ];

    this.unstableProbabilityState = 0;

    this.unstableProbabilityElapsed = 0;

    this.oddsManager.setCoinOdds(
      index,
      originalOdds,
    );

    this.view.gameUI.updateProbability(
      this.oddsManager.getOdds(),
    );
  }

  private stopUnstableProbabilityDisplay(): void {
    this.unstableProbabilityIndex =
      undefined;

    this.unstableProbabilityOdds =
      undefined;

    this.unstableProbabilityState = 0;

    this.unstableProbabilityElapsed = 0;
  }

  private updateUnstableProbabilityDisplay(
    deltaMS: number,
  ): void {
    if (
      this.unstableProbabilityIndex ===
        undefined ||
      !this.unstableProbabilityOdds ||
      this.roundState !== "ready"
    ) {
      return;
    }

    this.unstableProbabilityElapsed +=
      deltaMS;

    if (
      this.unstableProbabilityElapsed <
      GameScene.UNSTABLE_PROBABILITY_INTERVAL
    ) {
      return;
    }

    this.unstableProbabilityElapsed = 0;

    this.unstableProbabilityState =
      this.unstableProbabilityState === 0
        ? 1
        : 0;

    const currentOdds =
      this.unstableProbabilityOdds[
        this.unstableProbabilityState
      ];

    this.oddsManager.setCoinOdds(
      this.unstableProbabilityIndex,
      currentOdds,
    );

    this.view.gameUI.updateProbability(
      this.oddsManager.getOdds(),
    );
  }

  private applyDealerSettings(dealer: DealerData) {
    this.goldenCoinManager.configure(dealer.goldenCoinSettings);

    this.gambleForMoreManager.configure(dealer.gambleForMoreSettings);
  }

  private prepareNextRound() {
    const profile =
      this.dealerFightManager
        .shouldForceRandomToss()
        ? FORCED_RANDOM_TOSS_PROFILE
        : this.currentDealer.oddsProfile;

    const odds = this.oddsManager.rollOdds(profile);

    const safetyNetReady = this.perkGameplayController.isSafetyNetReady();

    if (safetyNetReady) {
      const safetyNetResult = this.oddsManager.rollResult();
      this.perkGameplayController.prepareSafetyNetResult(safetyNetResult);
    }

    const unstableIndex = this.dealerFightManager.prepareUnstableProbabilityDisplayRound();

    this.stopUnstableProbabilityDisplay();

    const brokenProbabilityDisplayIndex = this.dealerFightManager.getBrokenProbabilityDisplayIndex();

    if (unstableIndex !== undefined && !safetyNetReady) {
      this.startUnstableProbabilityDisplay(
        unstableIndex,
        profile,
        odds,
      );

      return;
    }

    this.view.gameUI.updateProbability(
      odds,
      brokenProbabilityDisplayIndex,
    );
  }

  private prepareNextRoundWithPerks(): void {
    this.prepareNextRound();

    this.perkGameplayController.prepareNextRound();
  }

  private get currentDealer(): DealerData {
    return this.dealerFightManager.getCurrentDealer();
  }

  private startDealerFight() {
    this.perkGameplayController.resetSafetyNet();
    
    const fight = this.dealerFightManager.startFight(this.player.balance);

    const odds = this.oddsManager.getOdds();

    this.view.gameUI.updateProbability(
      odds,
      this.dealerFightManager.getBrokenProbabilityDisplayIndex(),
    );

    const fixedCombination = this.dealerFightManager.getFixedCombinationLock();

    if (
      fixedCombination &&
      this.perkGameplayController
        .shouldApplyFixedCombinationLock()
    ) {
      this.controller.setCombinationSide(
        0,
        fixedCombination[0] as CoinSide,
      );

      this.controller.setCombinationSide(
        1,
        fixedCombination[1] as CoinSide,
      );

      this.controller.setCombinationSide(
        2,
        fixedCombination[2] as CoinSide,
      );
    }
    this.betRestrictionManager.applyBetSlotMalfunction();

    this.betRestrictionManager.applyDynamicBetLock(this.player.balance,);

    this.controller.adjustBetToRestrictions();

    this.updateBetControlRestrictions();

    this.view.gameUI.updateDealerObjective(
      this.currentDealer,
      fight.targetBalance,
    );

    this.startDelayedDecayIfNeeded();

    this.updateIvyRule();

    this.updateCombinationStatus();
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

    this.roundOutcomeHandler.resetDealerState();

    this.betRestrictionManager.setDealer(dealer, this.player.balance);

    this.controller.setReversedBetChoice(dealer.skills.some((skill) => skill.id === DealerSkillId.REVERSED_BET_CHOICE,),);

    this.controller.adjustBetToRestrictions();

    this.view.gameUI.hideDecayTimer();

    this.view.gameUI.hideIvyRules();

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
    if (
      this.controller.isBetChoiceReversed()
    ) {
      this.tryIncreaseBet();

      return;
    }

    this.tryDecreaseBet();
  }

  private handleBetUp() {
    if (
      this.controller.isBetChoiceReversed()
    ) {
      this.tryDecreaseBet();

      return;
    }

    this.tryIncreaseBet();
  }

  private tryIncreaseBet(): void {
    
    if (
      this.betRestrictionManager.isBetIncreaseLocked()
    ) {
      return;
    }

    const nextBet = this.controller.getNextBet();

    if (nextBet === null) {
      return;
    }

    const nextBetCost =
      this.perkEffectApplier.resolveBetCost(
        nextBet,
      );

    if (nextBetCost > this.player.balance) {
      this.popupManager.show(
        "insufficientBalance",
      );

      return;
    }

    this.controller.increaseBet();
  }

  private tryDecreaseBet(): void {
    if (
      this.betRestrictionManager
        .isBetDecreaseLocked()
    ) {
      return;
    }

    this.controller.decreaseBet();
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

  private updateIvyRule(): void {
    if (
      !this.perkGameplayController
        .shouldShowCombinationBlockingRule()
    ) {
      this.view.gameUI.hideIvyRules();

      return;
    }

    const rule =
      this.dealerFightManager
        .getIvyCombinationRule();

    if (!rule) {
      this.view.gameUI.hideIvyRules();

      return;
    }

    this.view.gameUI.ivyRuleContent.setKey(
      rule,
    );

    this.view.gameUI.showIvyRules();
  }

  private updateCombinationSelectorBlock(): void {
    const blockedIndex =
      this.dealerFightManager
        .getBlockedCombinationSelector();

    this.view.controls
      .setBlockedCombinationSelector(
        blockedIndex,
      );
  }

  private updateCombinationStatus(): void {
    const combination = this.controller.getCurrentCombo();

    const blocked =
      this.perkGameplayController.isCombinationBlocked(
        this.dealerFightManager.isCombinationBlocked(
          combination,
        ),
      );

    if (blocked) {
      this.view.gameUI.combinationStatusLabel.setKey("combinationBlocked");

      this.view.gameUI.showCombinationStatusLabel();

      this.view.controls.setTossDisabled(true);

      return;
    }

    const cursed = this.dealerFightManager.isCombinationCursed(combination,);

    if (cursed) {
      this.view.gameUI.combinationStatusLabel.setKey("combinationWontScore",);

      this.view.gameUI.showCombinationStatusLabel();

      this.view.controls.setTossDisabled(false);

      return;
    }

    this.view.gameUI.hideCombinationStatusLabel();

    this.view.controls.setTossDisabled(false);
  }


  // START ROUND - FUNCTION RESPONSIBLE FOR THE GAME LOOP

  private async startRound() {

    if (this.roundState !== "ready") {
      return;
    }

    const bet = this.controller.getBet();

    const availableBets =
      this.controller
        .getAvailableBets()
        .filter(
          (candidate) =>
            this.isBetAffordable(candidate),
        );

    const betManipulation = this.dealerFightManager.resolveBetValueManipulation(bet, availableBets,);

    const effectiveBet = betManipulation.bet;

    const selected = this.controller.getCurrentCombo();

    const combinationBlocked =
      this.perkGameplayController.isCombinationBlocked(
        this.dealerFightManager.isCombinationBlocked(
          selected,
        ),
      );

    if (combinationBlocked) {
      return;
    }

    const highestAffordableBet = this.controller.getHighestAffordableBet(
      this.player.balance,
    );

    const betResult = this.roundBetResolver.resolve({bet: effectiveBet,});

    const {
      betCost,
      payoutBet,
      doubleDownActive,
      coinSenseActive,
    } = betResult;

    const betDeductionMalfunctionTriggered = this.dealerFightManager.shouldTriggerBetDeductionMalfunction();

    const finalBetCost = betDeductionMalfunctionTriggered ? betCost * 2 : betCost;

    if (this.player.balance < finalBetCost) {
      this.popupManager.show("insufficientBalance");

      return;
    }

    this.stopRoundTimer();

    const noDuplicatesTriggered =
      this.dealerFightManager
        .recordCombinationForNoDuplicates(
          selected,
        );

    if (noDuplicatesTriggered) {
      this.lockControls();

      await this.dealerSkillFeedbackHandler.handle([
        DealerSkillId.NO_DUPLICATES,
      ]);

      this.player.balance -= finalBetCost;

      this.view.gameUI.updateBalance(
        this.player.balance,
      );

      this.controller.adjustBetToBalance(
        (bet) => this.isBetAffordable(bet),
      );

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

      this.unlockControls();

      return;
    }

    this.roundState = "spinning";

    this.lockControls();

    if (betManipulation.manipulated) {
      await this.dealerSkillFeedbackHandler.handle([
        DealerSkillId.BET_VALUE_MANIPULATION,
      ]);

      await this.view.perkEffectMessageOverlay.play(
        "betValueChangedTo",
        effectiveBet.toFixed(2),
        PerkEffectMessageType.NEGATIVE,
      );

      console.log(
        "PETER BET MANIPULATION:",
        bet,
        "->",
        effectiveBet,
      );
    }

    if (
      this.dealerFightManager
        .isMultiplierDecayActive()
    ) {
      this.decayRoundStartMultiplier =
        this.streakMultiplierManager.getValue();
    } else {
      this.decayRoundStartMultiplier =
        undefined;
    }

    const habitBreakerTriggered = this.dealerFightManager.recordSetupForHabitBreaker(bet,selected,);

    const betterPayTriggered = this.dealerFightManager.recordCombinationForBetterPay(selected);

    this.dealerFightManager.recordCombinationForKeepItMoving(selected,);

    const switchItUpTriggered = this.dealerFightManager.recordBetForSwitchItUp(bet);
 
    const patternBreakerBetCount = this.dealerFightManager.recordBetForPatternBreaker(bet);

    const dejaVuCombinationCount = this.dealerFightManager.recordCombinationForDejaVu(selected);

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

    if (betDeductionMalfunctionTriggered) {
      await this.dealerSkillFeedbackHandler.handle([
        DealerSkillId
          .BET_DEDUCTION_SYSTEM_MALFUNCTION,
      ]);
    }

    this.player.balance -= finalBetCost;

    this.perkEffectApplier.recordBet();

    this.perkGameplayController.refreshBetState();

    this.view.gameUI.updateBalance(this.player.balance);

    this.view.controls.startTossAnimation();

    const baseResult = this.generateResult();

    const goldenResult = this.goldenCoinManager.applyGoldenCoins(baseResult,);

    const additionalTossDelay = this.dealerFightManager.getAdditionalTossAnimationDelay();

    await this.coinRow.spin(goldenResult,selected, additionalTossDelay,);

    const additionalCoinTossTriggered = this.dealerFightManager.shouldTriggerAdditionalCoinToss();

    if (
      additionalCoinTossTriggered
    ) {
      await this.dealerSkillFeedbackHandler.handle([
        DealerSkillId.ADDITIONAL_COIN_TOSS,
      ]);

      const coinIndex =
        Math.floor(Math.random() * goldenResult.length);

      const newSide =
        Math.random() < 0.5
          ? CoinSide.Heads
          : CoinSide.Tails;

      goldenResult[coinIndex] = {
        ...goldenResult[coinIndex],
        side: newSide,
      };

      await this.coinRow.spinSingleCoin(
        coinIndex,
        goldenResult[coinIndex],
      );
    }

    const resultSides = goldenResult.map((outcome) => outcome.side,);

    const goldenCoinsCollected = goldenResult.filter((outcome) => outcome.isGolden,).length;

    this.dealerFightManager.recordGoldenCoins(goldenCoinsCollected);

    if (
      goldenCoinsCollected > 0 &&
      this.currentDealer.objectiveType ===
      ObjectiveType.COLLECT_GOLDEN_COINS
    ) {
      this.view.gameUI.dealerCard.updateObjectiveProgress(
        this.dealerFightManager.getFightGoldenCoins(),
        this.dealerFightManager.getFightTargetGoldenCoins(),
      );
    }

    this.statsManager.recordCoinsTossed(resultSides.length +(additionalCoinTossTriggered ? 1 : 0));

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
      selectedBet: bet,
      combination: selected,
      currentDealer: this.currentDealer,
      betterPayTriggered,
      switchItUpTriggered,
      patternBreakerBetCount,
      dejaVuCombinationCount,
    });

    const payoutBonusSkills = [
      DealerSkillId.OOPS_I_PAID_YOU_TWICE,
      DealerSkillId.BETTER_PAY_FOR_NOT_THE_SAME,
      DealerSkillId.SWITCH_IT_UP,
    ];

    const payoutPenaltySkills = [
      DealerSkillId.PATTERN_BREAKER,
      DealerSkillId.DEJA_VU,
    ];

    const payoutPresentationSkills = [
      ...payoutBonusSkills,
      ...payoutPenaltySkills,
    ];

    const immediateSkills =
      outcome.triggeredSkills.filter(
        (skillId) =>
          !payoutPresentationSkills.includes(
            skillId,
          ),
      );

    await this.dealerSkillFeedbackHandler.handle(immediateSkills);

    const streakResolution = outcome.streakResolution;

    /*
            ROUND STATS
        */

    this.runStatsRecorder.startRound({
      selected,
      bet,
    });

    if (win && winAmount !== undefined && winAmount <= 0
    ) {
      await this.handleNegativePayoutWin(
        winAmount,
        streakResolution,
      );

      return;
    }

    /*
            WIN
        */

    if (win && winAmount !== undefined) {
      const resolvedWinAmount = outcome.wonAmount;

      const payoutPenaltySkill =
        outcome.triggeredSkills.find(
          (skillId) =>
            payoutPenaltySkills.includes(skillId),
        );

      if (payoutPenaltySkill) {
        await this.dealerSkillFeedbackHandler.handle([
          payoutPenaltySkill,
        ]);

        await this.roundPayoutPresentationController
          .presentPenalty(
            winAmount - resolvedWinAmount,
            resolvedWinAmount,
          );
      }
      
      const payoutBonusSkill =
        outcome.triggeredSkills.find(
          (skillId) =>
            payoutBonusSkills.includes(skillId),
        );

      if (payoutBonusSkill) {
        await this.dealerSkillFeedbackHandler.handle([
          payoutBonusSkill,
        ]);

        const bonusAmount =
          resolvedWinAmount - winAmount;

        await this.roundPayoutPresentationController
          .presentBonus(
            bonusAmount,
            resolvedWinAmount,
          );
      }

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
        this.pendingStreakResolution = outcome.streakResolution;

        this.pendingHabitBreakerTriggered = habitBreakerTriggered;

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

      const previousMultiplier =
        this.streakMultiplierManager.getValue();

      this.dealerFightManager.recordHardMultiplierResetWin();

      this.applyStreakResolution(
        streakResolution,
      );

      const currentMultiplier =
        this.streakMultiplierManager.getValue();

      this.view.gameUI.updateMultiplier(
        currentMultiplier,
      );

      const milestoneBonusTriggered =
        this.roundOutcomeHandler.recordMultiplierMilestone(
          previousMultiplier,
          currentMultiplier,
          this.currentDealer,
        );

      if (milestoneBonusTriggered) {
        await this.dealerSkillFeedbackHandler.handle([
          DealerSkillId.MILESTONE_BONUS,
        ]);

        await this.view.perkEffectMessageOverlay.play(
          "winningsIncreasedBy",
          "+20%",
          PerkEffectMessageType.POSITIVE,
        );
      }

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

      const habitBreakerWinAmount =
        await this.applyHabitBreaker(
          finalRoundWinAmount,
          habitBreakerTriggered,
        );

      this.runStatsRecorder.finishRound({
        win: true,

        winAmount: habitBreakerWinAmount,

        streakMultiplier: this.streakMultiplierManager.getValue(),
      });

      this.commitWin(habitBreakerWinAmount);

      await this.perkGameplayController.handleWinCommitted();

      await this.finishRound(true);

      return;
    }

    /*
      LOSS
    */

    const finalStreakResolution = await this.perkGameplayController.handleLoss(streakResolution);

    const hardMultiplierDecrease =this.dealerFightManager.recordHardMultiplierResetLoss();

    if (hardMultiplierDecrease) {
      this.streakMultiplierManager.decay(1);
    } else {
      this.applyStreakResolution(
        finalStreakResolution,
      );
    }

    this.view.gameUI.updateMultiplier(this.streakMultiplierManager.getValue());

    if (outcome.wonAmount > 0) {
      this.commitPartialPayout(
        outcome.wonAmount,
      );
    }

    const houseCut =
    this.dealerFightManager.resolveHouseCut(bet);

    if (
      houseCut.amount > 0 &&
      houseCut.skillId
    ) {
      await this.dealerSkillFeedbackHandler.handle([
        houseCut.skillId,
      ]);

      this.player.balance -= houseCut.amount;

      await this.view.gameUI.animatePenaltyIntoBalance(
        houseCut.amount,
        this.player.balance,
      );

      this.view.gameUI.updateBalance(
        this.player.balance,
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

    const habitBreakerWinAmount =
      await this.applyHabitBreaker(
        finalRoundWinAmount,
        this.pendingHabitBreakerTriggered,
      );

    this.commitWin(habitBreakerWinAmount);

    await this.perkGameplayController.handleWinCommitted();

    if (this.pendingStreakResolution) {
      const previousMultiplier =
        this.streakMultiplierManager.getValue();

      this.applyStreakResolution(
        this.pendingStreakResolution,
      );

      const currentMultiplier =
        this.streakMultiplierManager.getValue();

      this.view.gameUI.updateMultiplier(
        currentMultiplier,
      );

      const milestoneBonusTriggered =
        this.roundOutcomeHandler.recordMultiplierMilestone(
          previousMultiplier,
          currentMultiplier,
          this.currentDealer,
        );

      if (milestoneBonusTriggered) {
        await this.dealerSkillFeedbackHandler.handle([
          DealerSkillId.MILESTONE_BONUS,
        ]);

        await this.view.perkEffectMessageOverlay.play(
          "winningsIncreasedBy",
          "+20%",
          PerkEffectMessageType.POSITIVE,
        );
      }
    }

    this.runStatsRecorder.finishRound({
      win: true,
      winAmount: habitBreakerWinAmount,
      streakMultiplier:
        this.streakMultiplierManager.getValue(),
    });

    this.pendingHabitBreakerTriggered = false;
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

    this.pendingHabitBreakerTriggered = false;

    await this.finishRound(false);
  }


  private async handleGambleForMoreLoss() {
    this.gambleForMoreController.lose();

    const finalStreakResolution = await this.perkGameplayController.handleLoss({action: StreakAction.RESET,});

    this.applyStreakResolution(finalStreakResolution,);

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

    this.dealerFightManager.recordCompletedRound();

    this.updateIvyRule();

    this.updateCombinationStatus();

    if (
      this.currentDealer.objectiveType ===
      ObjectiveType.SURVIVE_ROUNDS
    ) {
      this.view.gameUI.dealerCard
        .updateObjectiveProgress(
          this.dealerFightManager
            .getFightRounds(),

          this.dealerFightManager
            .getFightTargetRounds(),
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

    this.applyMultiplierDecay();

    this.betRestrictionManager.advanceBetIncreaseLock();

    this.betRestrictionManager.advanceBetDecreaseLock();

    this.betRestrictionManager.applyBetSlotMalfunction();

    this.betRestrictionManager.applyDynamicBetLock(this.player.balance,);

    this.controller.adjustBetToRestrictions();

    this.updateBetControlRestrictions();

    if (currentBetCost > this.player.balance) {
      this.controller.adjustBetToBalance(
        (bet) => this.isBetAffordable(bet),
      );
    }

    const multiplierSystemMalfunction =this.dealerFightManager.advanceMultiplierSystemMalfunction();

    if (multiplierSystemMalfunction.justTriggered) {
      await this.dealerSkillFeedbackHandler.handle([
        DealerSkillId.MULTIPLIER_SYSTEM_MALFUNCTION,
      ]);

      await this.view.playImpactShake();
      await this.view.gameUI.playMultiplierMalfunction();
    }

    if (multiplierSystemMalfunction.active) {
      this.streakMultiplierManager.knockOut();

      this.view.gameUI.updateMultiplier(
        this.streakMultiplierManager.getValue(),
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

    this.startRoundTimerIfNeeded();

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

  private async applyHabitBreaker(
    winAmount: number,
    triggered: boolean,
  ): Promise<number> {
    if (!triggered) {
      return winAmount;
    }

    const finalWinAmount =
      winAmount * 0.5;

    await this.dealerSkillFeedbackHandler.handle([
      DealerSkillId.HABIT_BREAKER,
    ]);

    await this.view.gameUI.animatePenaltyIntoWon(
      winAmount - finalWinAmount,
      finalWinAmount,
    );

    return finalWinAmount;
  }

  private startRoundTimerIfNeeded(): void {
    const skill =
      this.currentDealer.skills.find(
        (skill) =>
          skill.id === DealerSkillId.TIME_IS_MONEY ||
          skill.id === DealerSkillId.TIME_IS_MONEY_PLUS,
      );

    this.stopRoundTimer();

    if (!skill?.timeLimit) {
      return;
    }

    this.view.gameUI.showRoundTimer();

    this.audioManager.play(
      SoundId.CLOCK_TICKING_SOUND_EFFECT,
      {
        loop: true,
        volume: 0.7,
      },
    );

    this.roundTimerManager.start(
      skill.timeLimit,

      (seconds) => {
        this.view.gameUI.updateRoundTimer(
          seconds,
        );
      },

      async () => {
        if (this.roundState !== "ready") {
          return;
        }

        this.stopRoundTimer();

        this.lockControls();

        await this.dealerSkillFeedbackHandler.handle([
          skill.id,
        ]);

        if (this.roundState !== "ready") {
          return;
        }

        await this.startRound();
      },
    );
  }

  private applyStreakResolution(
    resolution: StreakResolution,
  ): void {
    if (
      this.dealerFightManager
        .isMultiplierDecayActive()
    ) {
      return;
    }

    if (
      this.dealerFightManager
        .isMultiplierSystemMalfunctionActive()
    ) {
      return;
    }

    this.streakMultiplierManager
      .applyResolution(resolution);
  }

  private applyMultiplierDecay(): void {
    const hasImmediateDecay =
      this.currentDealer.skills.some(
        (skill) =>
          skill.id ===
          DealerSkillId.MULTIPLIER_DECAY,
      );

    if (hasImmediateDecay) {
      const roundStartMultiplier =
        this.decayRoundStartMultiplier;

      if (roundStartMultiplier === undefined) {
        return;
      }

      this.streakMultiplierManager.setValue(
        roundStartMultiplier - 1,
      );

      this.decayRoundStartMultiplier =
        undefined;

      this.view.gameUI.updateMultiplier(
        this.streakMultiplierManager.getValue(),
      );

      return;
    }

    const result =
      this.dealerFightManager
        .recordDelayedDecayRound();

    if (!result) {
      return;
    }

    if (result.remainingRounds > 0) {
      this.view.gameUI.updateDecayTimer(
        result.remainingRounds,
      );

      return;
    }

    this.view.gameUI.hideDecayTimer();

    if (!result.shouldDecay) {
      return;
    }

    const roundStartMultiplier =
      this.decayRoundStartMultiplier;

    if (roundStartMultiplier === undefined) {
      return;
    }

    this.streakMultiplierManager.setValue(
      roundStartMultiplier - 1,
    );

    this.decayRoundStartMultiplier =
      undefined;

    this.view.gameUI.updateMultiplier(
      this.streakMultiplierManager.getValue(),
    );
  }

  private startDelayedDecayIfNeeded(): void {
    const roundsRemaining =
      this.dealerFightManager
        .getDelayedDecayRoundsRemaining();

    if (roundsRemaining === null) {
      this.view.gameUI.hideDecayTimer();

      return;
    }

    this.view.gameUI.updateDecayTimer(
      roundsRemaining,
    );

    this.view.gameUI.showDecayTimer();
  }

  private stopRoundTimer(): void {
    this.roundTimerManager.cancel();

    this.view.gameUI.hideRoundTimer();

    this.audioManager.stop(
      SoundId.CLOCK_TICKING_SOUND_EFFECT,
    );
  }

  private generateResult(): CoinSide[] {
    const forcedResult =
        this.gameCheatController.consumeForcedResult();

    if (forcedResult) {
        return forcedResult;
    }

    const safetyNetResult = this.perkGameplayController.consumePreparedSafetyNetResult();

    if (safetyNetResult) {
      return safetyNetResult;
    }

    const coinSenseResult = this.perkEffectApplier.consumePreparedCoinSenseResult();

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
    this.updateBetControlRestrictions();
    this.updateCombinationStatus();
    this.updateCombinationSelectorBlock();
  }

  private async handleNegativePayoutWin(
    winAmount: number,
    streakResolution: StreakResolution,
  ): Promise<void> {
    const penaltyAmount =
      Math.abs(winAmount);

    this.player.balance += winAmount;

    this.view.gameUI.updateWon(0);

    await this.view.gameUI.animatePenaltyIntoBalance(
      penaltyAmount,
      this.player.balance,
    );

    this.view.gameUI.updateBalance(
      this.player.balance,
    );

    this.dealerFightManager
      .recordHardMultiplierResetWin();

    this.applyStreakResolution(
      streakResolution,
    );

    this.view.gameUI.updateMultiplier(
      this.streakMultiplierManager.getValue(),
    );

    this.runStatsRecorder.finishRound({
      win: true,
      winAmount,
      streakMultiplier:
        this.streakMultiplierManager.getValue(),
    });

    await this.finishRound(true);
  }

  private updateBetControlRestrictions(): void {
    this.view.controls.setBetUpDisabled(
      this.betRestrictionManager
        .isBetIncreaseLocked(),
    );

    this.view.controls.setBetDownDisabled(
      this.betRestrictionManager
        .isBetDecreaseLocked(),
    );
  }

  // TICKER

  private setupTicker() {
    this.updateTicker = (ticker: Ticker) => {
      const delta = ticker.deltaTime;

      this.view.controls.update(delta);

      if (this.coinRow) {
        this.coinRow.update(delta);
      }

      this.updateUnstableProbabilityDisplay(
        ticker.deltaMS,
      );
    };

    this.app.ticker.add(
      this.updateTicker,
    );
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

  private async cheatDealer(
    dealerId: string,
  ): Promise<void> {
    if (
      this.roundState !== "ready" ||
      this.isChangingDealer
    ) {
      return;
    }

    const dealer =
      getDealerById(dealerId);

    if (!dealer) {
      console.log(
        "Unknown dealer:",
        dealerId,
      );

      return;
    }

    this.stopRoundTimer();

    this.audioManager.stop(
      SoundId.CLOCK_TICKING_SOUND_EFFECT,
    );

    this.isChangingDealer = true;

    this.lockControls();

    this.dealerFightManager
      .forceCurrentDealer(dealer);

    console.log(
      "CHEAT - DEALER:",
      dealer.name,
    );

    await this.loadDealer(dealer);
  }

  // CLEANUP

  cleanup() {

    this.stopRoundTimer();

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
