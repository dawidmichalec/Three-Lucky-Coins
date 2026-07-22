import { BaseScene } from "./BaseScene";
import { SceneManager } from "../SceneManager";
import { RoundedButton } from "../../ui/buttons/RoundedButton";
import { ButtonTheme } from "../../ui/buttons/ButtonTheme";
import { CreditsPanel } from "../../ui/panels/CreditsPanel";
import { OptionsPanel } from "../../ui/panels/OptionsPanel";
import { StatsManager } from "../../core/StatsManager";
import { CollectionsPanel } from "../../ui/panels/CollectionsPanel";
import { LayoutManager } from "../../core/LayoutManager";

export class MainMenuScene extends BaseScene {

    private creditsPanel!: CreditsPanel;
    private optionsPanel!: OptionsPanel;
    private collectionsPanel!: CollectionsPanel;
    private layout!: LayoutManager;

    constructor(
        private sceneManager: SceneManager
    ) {

        super();

        this.layout = LayoutManager.getInstance();

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

        playButton.position.set(340.4, 566.1);

        // COLLECTIONS BUTTON

        const collectionsButton = new RoundedButton({
            text: 'COLLECTIONS',
            theme: ButtonTheme.YELLOW,
            onClick:() => {
                this.collectionsPanel.show();
            },
        });

        collectionsButton.position.set(798, 566.1);

        // OPTIONS BUTTON

        const optionsButton = new RoundedButton({
            text: 'OPTIONS',
            theme: ButtonTheme.BLUE,
            onClick:() => {
                this.optionsPanel.show();
            }
        })



        optionsButton.position.set(1256, 566.1);

        // CREDITS BUTTON

        const creditsButton = new RoundedButton({
            text: 'CREDITS',
            theme: ButtonTheme.MAGENTA,
            onClick:() => {
                this.creditsPanel.show();
            }
        })

        creditsButton.position.set(555.4, 751);

        // QUIT BUTTON

        const quitButton = new RoundedButton({
            text: 'QUIT',
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
        
}