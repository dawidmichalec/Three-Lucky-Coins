import { BaseScene } from "./BaseScene";
import { SceneManager } from "../SceneManager";
import { RoundedButton } from "../../ui/buttons/RoundedButton";
import { ButtonTheme } from "../../ui/buttons/ButtonTheme";
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

        const playButton = new RoundedButton({

            text: "play",
            theme: ButtonTheme.GREEN,
            onClick:() => {

                this.sceneManager.showGame();
            
            }

        });

        // PLAY BUTTON

        playButton.position.set(340.4, 566.1);

        // COLLECTIONS BUTTON

        const collectionsButton = new RoundedButton({
            text: "collections",
            theme: ButtonTheme.YELLOW,
            onClick:() => {
                this.collectionsPanel.show();
            },
        });

        collectionsButton.position.set(798, 566.1);

        // OPTIONS BUTTON

        const optionsButton = new RoundedButton({
            text: "options",
            theme: ButtonTheme.BLUE,
            onClick:() => {
                this.optionsPanel.show();
            }
        })



        optionsButton.position.set(1256, 566.1);

        // CREDITS BUTTON

        const creditsButton = new RoundedButton({
            text: "credits",
            theme: ButtonTheme.MAGENTA,
            onClick:() => {
                this.creditsPanel.show();
            }
        })

        creditsButton.position.set(555.4, 751);

        // QUIT BUTTON

        const quitButton = new RoundedButton({
            text: "quit",
            theme: ButtonTheme.RED,
            onClick:() => {

            }
        });

        quitButton.position.set(1043, 751);

        this.addChild(
            playButton,
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