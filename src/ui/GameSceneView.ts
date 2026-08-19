import { Container } from "pixi.js";
import { GameUI } from "./GameUI";
import { GameControls } from "./controls/GameControls";
import { HamburgerMenu } from "./menus/HamburgerMenu";
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


interface GameSceneViewOptions {

    onBetDown:() => void;

    onBetUp:() => void;

    onPrevCombo:() => void;

    onNextCombo:() => void;

    onToss:() => void;

    onRestartRun:() => void;

    onMainMenu:() => void;

    onGambleForMoreYes:() => void;

    onGambleForMoreNo:() => void;

    onGambleForMoreColorSelected:(color: CardColor) => void;

    onPerkRewardConfirm: (reward: PerkReward) => void;

    onPerkRewardSkip: () => void;

}


export class GameSceneView
    extends Container {

    readonly gameUI: GameUI;

    readonly controls: GameControls;

    readonly optionsPanel: OptionsPanel;

    readonly statsPanel: StatsPanel;

    readonly runSummaryPanel: RunSummaryPanel;

    readonly hamburgerMenu: HamburgerMenu;

    readonly gameMessageOverlay: GameMessageOverlay;

    readonly gameOverOverlay:GameOverOverlay;

    readonly gambleForMoreOverlay: GambleForMoreOverlay;

    readonly perkRewardOverlay: PerkRewardOverlay;


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

        this.controls =
            new GameControls({
                onBetDown:
                    options.onBetDown,

                onBetUp:
                    options.onBetUp,

                onPrevCombo:
                    options.onPrevCombo,

                onNextCombo:
                    options.onNextCombo,

                onToss:
                    options.onToss
            });

        this.addChild(
            this.controls
        );


        // OPTIONS

        this.optionsPanel =
            new OptionsPanel(
                layout.DESIGN_WIDTH,
                layout.DESIGN_HEIGHT,
                () => {
                    this.optionsPanel
                        .hide();
                }
            );

        this.optionsPanel.visible =
            false;

        this.optionsPanel.zIndex =
            1000;

        this.addChild(
            this.optionsPanel
        );


        // STATS

        this.statsPanel =
            new StatsPanel(
                layout.DESIGN_WIDTH,
                layout.DESIGN_HEIGHT,
                () => {
                    this.statsPanel
                        .hide();
                }
            );

        this.statsPanel.visible =
            false;

        this.statsPanel.zIndex =
            1000;

        this.addChild(
            this.statsPanel
        );


        // RUN SUMMARY

        this.runSummaryPanel =
            new RunSummaryPanel(
                layout.DESIGN_WIDTH,
                layout.DESIGN_HEIGHT,
                options.onRestartRun,
                options.onMainMenu
            );

        this.runSummaryPanel.visible =
            false;

        this.runSummaryPanel.zIndex =
            2000;

        this.addChild(
            this.runSummaryPanel
        );


        // HAMBURGER MENU

        this.hamburgerMenu =
            new HamburgerMenu(
                sceneManager,
                popupManager,

                () => {
                    this.optionsPanel
                        .show();
                },

                () => {
                    this.statsPanel
                        .show();
                }
            );

        this.addChild(
            this.hamburgerMenu
        );


        // DEALER VICTORY

        this.gameMessageOverlay =
            new GameMessageOverlay(
                layout.DESIGN_WIDTH,
                layout.DESIGN_HEIGHT
            );

        this.gameMessageOverlay
            .zIndex = 5000;

        this.addChild(
            this.gameMessageOverlay
        );


        // GAME OVER

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


        // GAMBLE FOR MORE OVERLAY

        this.gambleForMoreOverlay =
            new GambleForMoreOverlay(
                options.onGambleForMoreYes,
                options.onGambleForMoreNo,
                options.onGambleForMoreColorSelected
            );
            
        this.gambleForMoreOverlay.zIndex = 4000;

        this.addChild(
            this.gambleForMoreOverlay
        );


        //PERK REWARD

        this.perkRewardOverlay =
            new PerkRewardOverlay(
                layout.DESIGN_WIDTH,
                layout.DESIGN_HEIGHT,
                options.onPerkRewardConfirm,
                options.onPerkRewardSkip
            );
        this.perkRewardOverlay.zIndex = 4000;
        this.addChild(this.perkRewardOverlay);

    }

    async init():
        Promise<void> {

        await Promise.all([
            this.gambleForMoreOverlay.init(),
            this.perkRewardOverlay.init()
        ]);
    }
}