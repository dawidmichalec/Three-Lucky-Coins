import { Container, Assets, Sprite, Text } from "pixi.js";
import { Overlay } from "../popups/Overlay";
import { SceneManager } from "../../game/SceneManager";
import { PopupManager } from "../popups/PopupManager";
import { MenuButton } from "../buttons/MenuButton";
import { ClosePanelButton } from "../buttons/ClosePanelButton";
import { LayoutManager } from "../../core/LayoutManager";


export class InGameMenu extends Container {

    private logoSprite!: Sprite;
    private layoutManager = LayoutManager.getInstance();

    constructor(
        private sceneManager: SceneManager,
        private popupManager: PopupManager,
        private onOpenOptions: () => void,
        private onOpenStats: () => void,
    ) {
        super();

        this.createOverlay(this.layoutManager.DESIGN_WIDTH, this.layoutManager.DESIGN_HEIGHT);

        // SAVE
        
        const saveButton = new MenuButton({
            text: "save",
            onClick: () => {
                // MIEJSCE NA SAVE W PRZYSZŁOŚCI
            },
        });
    
        saveButton.position.set(650, 423);
    
        // OPTIONS
    
        const optionsButton = new MenuButton({
            text: "options",
            onClick: () => {
                this.onOpenOptions();
            },
        });
    
        optionsButton.position.set(650, 503);
    
        // RUN STATISTICS
    
        const runStatisticsButton = new MenuButton({
            text: "runStatistics",
            onClick: () => {
                this.onOpenStats();
            },
        });
    
        runStatisticsButton.position.set(650, 583);
    
        // CREDITS
    
        const restartRunButton = new MenuButton({
            text: "restartRun",
            onClick: () => {
                this.popupManager.showConfirmation(
                    "restartRunButtonText",

                    () => {
                    this.sceneManager.showGame();
                    },
                );
            },
        });
    
        restartRunButton.position.set(650, 663);
    
        // QUIT BUTTON
    
        const quitToMainMenuButton = new MenuButton({
            text: "quitToMainMenu",
            onClick: () => {
                this.popupManager.showConfirmation(
                    "homeButtonText",

                    () => {
                    this.sceneManager.showMainMenu();
                    },
                );
            },
        });
    
        quitToMainMenuButton.position.set(650, 743);
    
        this.addChild(
            saveButton,
            optionsButton,
            restartRunButton,
            runStatisticsButton,
            quitToMainMenuButton,
        );
    }

    async init(): Promise<void> {
        await this.createLogo();
        await this.createCloseButton();
    }

    private async createLogo() {
        const texture = await Assets.load("/assets/main/logo.png");
    
        this.logoSprite = new Sprite(texture);
    
        this.logoSprite.width = 900;
        this.logoSprite.height = 212;
        this.logoSprite.position.set(495.6, 154.5);
    
        this.addChild(this.logoSprite);
    }

    async createCloseButton() {
        const close = new ClosePanelButton();

        await close.init();

        close.on("pointerdown", () => {
            close.scale.set(0.95);
        });

        close.on("pointerup", () => {
            close.scale.set(1);
        });

        close.on("pointerupoutside", () => {
            close.scale.set(1);
        });

        close.on("pointertap", () => {
            this.hide();
        });

        close.position.set(1750, 108);

        this.addChild(close);
    }

    private createOverlay(width: number, height: number) {
        const overlay = new Overlay(width, height);

        this.addChild(overlay);
    }

    show() {

        this.visible = true;

    }

    hide() {

        this.visible = false;

    }

}