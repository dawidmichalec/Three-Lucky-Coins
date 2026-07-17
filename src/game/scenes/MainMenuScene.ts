import { BaseScene } from "./BaseScene";
import { SceneManager } from "../SceneManager";
import { RoundedButton } from "../../ui/buttons/RoundedButton";
import { ButtonTheme } from "../../ui/buttons/ButtonTheme";
import { CreditsPanel } from "../../ui/panels/CreditsPanel";
import { OptionsPanel } from "../../ui/panels/OptionsPanel";
import { StatsManager } from "../../core/StatsManager";
import { CollectionsPanel } from "../../ui/panels/CollectionsPanel";

export class MainMenuScene extends BaseScene {

    private creditsPanel!: CreditsPanel;
    private optionsPanel!: OptionsPanel;
    private collectionsPanel!: CollectionsPanel;

    constructor(
        private sceneManager: SceneManager
    ) {

        super();

        this.createCreditsPanel();
        this.createOptionsPanel();
        this.createCollectionPanel();

        const playButton = new RoundedButton({

            text: 'PLAY',
            theme: ButtonTheme.GREEN,
            onClick:() => {

                this.sceneManager.showGame();
            
            }

        });

        // PLAY BUTTON

        playButton.position.set(300, 350);

        // COLLECTIONS BUTTON

        const collectionsButton = new RoundedButton({
            text: 'COLLECTIONS',
            theme: ButtonTheme.YELLOW,
            onClick:() => {
                this.collectionsPanel.show();
            },
        });

        collectionsButton.position.set(650, 350);

        // OPTIONS BUTTON

        const optionsButton = new RoundedButton({
            text: 'OPTIONS',
            theme: ButtonTheme.BLUE,
            onClick:() => {
                this.optionsPanel.show();
            }
        })



        optionsButton.position.set(1000, 350);

        // CREDITS BUTTON

        const creditsButton = new RoundedButton({
            text: 'CREDITS',
            theme: ButtonTheme.MAGENTA,
            onClick:() => {
                this.creditsPanel.show();
            }
        })

        creditsButton.position.set(470, 480);

        // QUIT BUTTON

        const quitButton = new RoundedButton({
            text: 'QUIT',
            theme: ButtonTheme.RED,
            onClick:() => {

            }
        });

        quitButton.position.set(830, 480);

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
            window.innerWidth,
            window.innerHeight,

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
            window.innerWidth,
            window.innerHeight,
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
            window.innerWidth,
            window.innerHeight,
            () => {
                this.optionsPanel.hide();
            }
        );

        this.optionsPanel.visible = false;
        this.optionsPanel.zIndex = 100;

        this.addChild(this.optionsPanel);

    }
        
}