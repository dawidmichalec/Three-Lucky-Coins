import { Container, Graphics } from "pixi.js";
import { GameUI } from "./GameUI";
import { GameControls } from "./controls/GameControls";
import { OptionsPanel } from "./panels/OptionsPanel";
import { StatsPanel } from "./panels/StatsPanel";
import { RunSummaryPanel } from "./panels/RunSummaryPanel";
import { GameMessageOverlay } from "./overlays/GameMessageOverlay";
import { GameOverOverlay } from "./overlays/GameOverOverlay";
import { DealerData } from "../game/dealers/DealerData";
import { SceneManager } from "../game/SceneManager";
import { PopupManager } from "./popups/PopupManager";
import { LayoutManager } from "../core/LayoutManager";
import { GambleForMoreOverlay } from "./gambleForMore/GambleForMoreOverlay";
import { CardColor } from "../game/gambleForMore/games/redBlackCard/RedBlackCardTypes";
import { PerkRewardOverlay } from "./overlays/PerkRewardOverlay";
import { PerkReward } from "../game/perks/reward/PerkReward";
import { PerkEffectMessageOverlay } from "./overlays/PerkEffectOverlay";
import { SettingsButton } from "./buttons/SettingsButton";
import { InGameMenu } from "./menus/InGameMenu";
import { CoinSide } from "./Coin";

interface GameSceneViewOptions {
  onBetDown: () => void;

  onBetUp: () => void;

  onCombinationSideChange: (
    index: 0 | 1 | 2,
    side: CoinSide,
  ) => void;

  onToss: () => void;

  onRestartRun: () => void;

  onMainMenu: () => void;

  onGambleForMoreYes: () => void;

  onGambleForMoreNo: () => void;

  onGambleForMoreColorSelected: (color: CardColor) => void;

  onPerkRewardConfirm: (reward: PerkReward) => void;

  onPerkRewardSkip: () => void;
}

export class GameSceneView extends Container {
  readonly gameUI: GameUI;

  readonly controls: GameControls;

  readonly optionsPanel: OptionsPanel;

  readonly statsPanel: StatsPanel;

  readonly runSummaryPanel: RunSummaryPanel;

  readonly gameMessageOverlay: GameMessageOverlay;

  readonly gameOverOverlay: GameOverOverlay;

  readonly gambleForMoreOverlay: GambleForMoreOverlay;

  readonly perkRewardOverlay: PerkRewardOverlay;

  readonly perkEffectMessageOverlay: PerkEffectMessageOverlay;

  readonly inGameMenu: InGameMenu;

  private settingsButton!: SettingsButton;

  constructor(
    dealer: DealerData,

    sceneManager: SceneManager,

    popupManager: PopupManager,

    options: GameSceneViewOptions,
  ) {
    super();

    this.sortableChildren = true;

    const layout = LayoutManager.getInstance();

    // GAME UI

    this.gameUI = new GameUI(dealer);

    this.gameUI.zIndex = 1000;

    this.addChild(this.gameUI);

    // CONTROLS

    this.controls = new GameControls({
      onBetDown: options.onBetDown,
      onBetUp: options.onBetUp,

      initialCombination: [
        CoinSide.Heads,
        CoinSide.Heads,
        CoinSide.Heads,
      ],

      onCombinationSideChange:
        options.onCombinationSideChange,

      onToss: options.onToss,
    });

    this.addChild(this.controls);

    // OPTIONS

    this.optionsPanel = new OptionsPanel(
      layout.DESIGN_WIDTH,
      layout.DESIGN_HEIGHT,
      () => {
        this.optionsPanel.hide();
      },
    );

    this.optionsPanel.visible = false;

    this.optionsPanel.zIndex = 1700;

    this.addChild(this.optionsPanel);

    // STATS

    this.statsPanel = new StatsPanel(
      layout.DESIGN_WIDTH,
      layout.DESIGN_HEIGHT,
      () => {
        this.statsPanel.hide();
      },
    );

    this.statsPanel.visible = false;

    this.statsPanel.zIndex = 1700;

    this.addChild(this.statsPanel);

    // RUN SUMMARY

    this.runSummaryPanel = new RunSummaryPanel(
      layout.DESIGN_WIDTH,
      layout.DESIGN_HEIGHT,
      options.onRestartRun,
      options.onMainMenu,
    );

    this.runSummaryPanel.visible = false;

    this.runSummaryPanel.zIndex = 2000;

    this.addChild(this.runSummaryPanel);

    // IN GAME MENU

    this.inGameMenu = new InGameMenu(
      sceneManager,
      popupManager,

      () => {
        this.optionsPanel.show();
      },

      () => {
        this.statsPanel.show();
      },
    );

    this.addChild(this.inGameMenu);
    this.inGameMenu.zIndex = 1600;
    this.inGameMenu.visible = false;

    // DEALER VICTORY

    this.gameMessageOverlay = new GameMessageOverlay(
      layout.DESIGN_WIDTH,
      layout.DESIGN_HEIGHT,
    );

    this.gameMessageOverlay.zIndex = 5000;

    this.addChild(this.gameMessageOverlay);

    // GAME OVER

    this.gameOverOverlay = new GameOverOverlay(
      layout.DESIGN_WIDTH,
      layout.DESIGN_HEIGHT,
    );

    this.gameOverOverlay.zIndex = 6000;

    this.addChild(this.gameOverOverlay);

    // GAMBLE FOR MORE OVERLAY

    this.gambleForMoreOverlay = new GambleForMoreOverlay(
      options.onGambleForMoreYes,
      options.onGambleForMoreNo,
      options.onGambleForMoreColorSelected,
    );

    this.gambleForMoreOverlay.zIndex = 4000;

    this.addChild(this.gambleForMoreOverlay);

    // PERK EFFECTS OVERLAY

    this.perkEffectMessageOverlay = new PerkEffectMessageOverlay(
      layout.DESIGN_WIDTH,
      layout.DESIGN_HEIGHT,
    );

    this.perkEffectMessageOverlay.zIndex = 4000;

    this.addChild(this.perkEffectMessageOverlay);

    //PERK REWARD

    this.perkRewardOverlay = new PerkRewardOverlay(
      layout.DESIGN_WIDTH,
      layout.DESIGN_HEIGHT,
      options.onPerkRewardConfirm,
      options.onPerkRewardSkip,
    );
    this.perkRewardOverlay.zIndex = 4000;
    this.addChild(this.perkRewardOverlay);

  }

  async init(): Promise<void> {
    await Promise.all([
      this.gambleForMoreOverlay.init(),
      this.perkRewardOverlay.init(),
      this.inGameMenu.init()
    ]);

    await this.createSettingsButton()
  }

  private async createSettingsButton(){

    this.settingsButton = new SettingsButton();

    await this.settingsButton.init();

    this.settingsButton.position.set(1815.8, 24.7);

    this.settingsButton.on("pointerdown", () => {
      this.settingsButton.scale.set(0.95);
    });

    this.settingsButton.on("pointerup", () => {
      this.settingsButton.scale.set(1);
    });

    this.settingsButton.on("pointerupoutside", () => {
      this.settingsButton.scale.set(1);
    });

    this.settingsButton.on("pointertap", () => {
      this.openInGameMenu();
    });

    this.settingsButton.zIndex = 1100;

    this.addChild(this.settingsButton);

  }

  private async openInGameMenu(){
    this.inGameMenu.visible = true;
  }

  async playImpactShake(): Promise<void> {
  const originalX = this.x;
  const originalY = this.y;

  const flash = new Graphics()
    .rect(
      -originalX,
      -originalY,
      this.width,
      this.height,
    )
    .fill({
      color: 0xffffff,
      alpha: 0.65,
    });

  flash.zIndex = 9999;

  this.addChild(flash);

  const moveTo = async (
      offsetX: number,
      offsetY: number,
      duration: number,
    ) => {
      const startX = this.x;
      const startY = this.y;

      const targetX = originalX + offsetX;
      const targetY = originalY + offsetY;

      const startTime = performance.now();

      while (true) {
        const elapsed =
          performance.now() - startTime;

        const progress =
          Math.min(elapsed / duration, 1);

        this.position.set(
          startX +
            (targetX - startX) * progress,

          startY +
            (targetY - startY) * progress,
        );

        if (progress >= 1) {
          break;
        }

        await new Promise<void>((resolve) => {
          requestAnimationFrame(() => resolve());
        });
      }
    };

    const fadeFlash = async () => {
      const duration = 100;
      const startTime = performance.now();

      while (true) {
        const elapsed =
          performance.now() - startTime;

        const progress =
          Math.min(elapsed / duration, 1);

        flash.alpha = 1 - progress;

        if (progress >= 1) {
          break;
        }

        await new Promise<void>((resolve) => {
          requestAnimationFrame(() => resolve());
        });
      }

      flash.destroy();
    };

    const flashPromise = fadeFlash();

    await moveTo(-40, 3, 60);
    await moveTo(30, -2, 85);
    await moveTo(-20, 1, 105);
    await moveTo(10, 0, 125);
    await moveTo(-4, 0, 110);
    await moveTo(0, 0, 90);

    await flashPromise;

    this.position.set(
      originalX,
      originalY,
    );
  }

  setDisabled(value: boolean) {
    this.settingsButton.setDisabled(value)

  }
}
