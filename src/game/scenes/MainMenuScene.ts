import { BaseScene } from "./BaseScene";
import { SceneManager } from "../SceneManager";
import { MenuButton } from "../../ui/buttons/MenuButton";
import { CreditsPanel } from "../../ui/panels/CreditsPanel";
import { OptionsPanel } from "../../ui/panels/OptionsPanel";
import { StatsManager } from "../../core/StatsManager";
import { CollectionsPanel } from "../../ui/panels/CollectionsPanel";
import { LayoutManager } from "../../core/LayoutManager";
import { LocalizedText } from "../../localization/LocalizedText";
import { Assets, Sprite } from "pixi.js";

export class MainMenuScene extends BaseScene {

    private creditsPanel!: CreditsPanel;
    private optionsPanel!: OptionsPanel;
    private collectionsPanel!: CollectionsPanel;
    private layout!: LayoutManager;
    private logoSprite!: Sprite;

    constructor(
        private sceneManager: SceneManager
    ) {

        super();

        this.layout = LayoutManager.getInstance();

        this.createLogo();
        this.createCreditsPanel();
        this.createOptionsPanel();
        this.createCollectionPanel();

        // CONTINUE BUTTON

        const continueButton = new MenuButton({
            text: "continue",
            onClick:() => {

            }
        });

        continueButton.position.set(650, 413);

        // NEW RUN

        const newRunButton = new MenuButton({
            text: "newRun",
            onClick:() => {

                this.sceneManager.showGame();

            }
        });

        newRunButton.position.set(650, 493);

        // COLLECTIONS 

        const collectionsButton = new MenuButton({
            text: "collections",
            onClick:() => {

                this.collectionsPanel.show();

            }
        });

        collectionsButton.position.set(650, 573);

        // OPTIONS

        const optionsButton = new MenuButton({
            text: "options",
            onClick:() => {

                this.optionsPanel.show();

            }
        });

        optionsButton.position.set(650, 653);

        // CREDITS

        const creditsButton = new MenuButton({
            text: "credits",
            onClick:() => {

                this.creditsPanel.show();

            }
        });

        creditsButton.position.set(650, 733);

        // QUIT BUTTON

        const quitButton = new MenuButton({
            text: "quit",
            onClick:() => {

            }

        });

        quitButton.position.set(650, 813);


        this.addChild(
            continueButton,
            newRunButton,
            collectionsButton,
            optionsButton,
            creditsButton,
            quitButton
        );
    }

    cleanup() {

    }


    private createCollectionPanel() {

        this.collectionsPanel = new CollectionsPanel(
            this.layout.DESIGN_WIDTH,
            this.layout.DESIGN_HEIGHT,

            () => {
                this.collectionsPanel.hide();
            }
        );

        this.collectionsPanel.visible = false;
        this.collectionsPanel.zIndex = 100;

        this.addChild(this.collectionsPanel);

    }



    private createCreditsPanel() {

        this.creditsPanel = new CreditsPanel(
            this.layout.DESIGN_WIDTH,
            this.layout.DESIGN_HEIGHT,
            () => {
                this.creditsPanel.hide();
            }
        );

        this.creditsPanel.visible = false;
        this.creditsPanel.zIndex = 100;

        this.addChild(this.creditsPanel);

    }

    private createOptionsPanel() {

        this.optionsPanel = new OptionsPanel(
            this.layout.DESIGN_WIDTH,
            this.layout.DESIGN_HEIGHT,
            () => {
                this.optionsPanel.hide();
            }
        );

        this.optionsPanel.visible = false;
        this.optionsPanel.zIndex = 100;

        this.addChild(this.optionsPanel);

    }

    // LOGO

    private async createLogo() {

        const texture = await Assets.load("/assets/main/logo.png");

        this.logoSprite = new Sprite(texture);

        this.logoSprite.width = 900;
        this.logoSprite.height = 212;
        this.logoSprite.position.set(495.6, 154.5);

        this.addChild(this.logoSprite);
    }

    override update(delta: number) {

        if (!this.logoSprite) return;

        this.logoSprite.alpha =
            0.85 + Math.sin(performance.now() * 0.006) * 0.30;

    }
        
}