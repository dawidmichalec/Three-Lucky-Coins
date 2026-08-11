import { Container } from "pixi.js";
import { GameUI } from "./GameUI";
import { GameControls } from "./controls/GameControls";
import { HamburgerMenu } from "./menus/HamburgerMenu";
import { OptionsPanel } from "./panels/OptionsPanel";
import { StatsPanel } from "./panels/StatsPanel";
import { RunSummaryPanel } from "./panels/RunSummaryPanel";
import { DealerVictoryOverlay } from "./overlays/DealerVictoryOverlay";
import { GameOverOverlay } from "./overlays/GameOverOverlay";
import { DealerData } from "../game/dealers/DealerData";
import { SceneManager } from "../game/SceneManager";
import { PopupManager } from "./popups/PopupManager";
import { LayoutManager } from "../core/LayoutManager";
import { GambleForMoreOverlay } from "./gambleForMore/GambleForMoreOverlay";

interface GameSceneViewOptions {

    onBetDown:() => void;

    onBetUp:() => void;

    onPrevCombo:() => void;

    onNextCombo:() => void;

    onToss:() => void;

    onRestartRun:() => void;

    onMainMenu:() => void;
}


export class GameSceneView
    extends Container {

    readonly gameUI: GameUI;

    readonly controls: GameControls;

    readonly optionsPanel: OptionsPanel;

    readonly statsPanel: StatsPanel;

    readonly runSummaryPanel: RunSummaryPanel;

    readonly hamburgerMenu: HamburgerMenu;

    readonly dealerVictoryOverlay: DealerVictoryOverlay;

    readonly gameOverOverlay:GameOverOverlay;

    readonly gambleForMoreOverlay: GambleForMoreOverlay;


    constructor(
        dealer: DealerData,

        sceneManager: SceneManager,

        popupManager: PopupManager,

        options: GameSceneViewOptions
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

        this.dealerVictoryOverlay =
            new DealerVictoryOverlay(
                layout.DESIGN_WIDTH,
                layout.DESIGN_HEIGHT
            );

        this.dealerVictoryOverlay
            .zIndex = 5000;

        this.addChild(
            this.dealerVictoryOverlay
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
            new GambleForMoreOverlay();

        this.gambleForMoreOverlay.zIndex = 4000;

        this.addChild(
            this.gambleForMoreOverlay
        );

    }


    async init():
        Promise<void> {

        await this.gambleForMoreOverlay
            .init();
    }
}