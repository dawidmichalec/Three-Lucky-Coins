import { BaseScene } from "./BaseScene";
import { SceneManager } from "../SceneManager";
import { RoundedButton } from "../../ui/buttons/RoundedButton";
import { ButtonTheme } from "../../ui/buttons/ButtonTheme";
import { CreditsPanel } from "../../ui/panels/CreditsPanel";

export class MainMenuScene extends BaseScene {

    private creditsPanel!: CreditsPanel;

    constructor(
        private sceneManager: SceneManager
    ) {

        super();

        this.createCreditsPanel();

        const playButton = new RoundedButton({

            text: 'PLAY',
            theme: ButtonTheme.GREEN,
            onClick:() => {

                console.log("PLAY");

                this.sceneManager.showGame();
            
            }

        });

        // PLAY BUTTON

        playButton.position.set(300, 350);

        const collectionsButton = new RoundedButton({
            text: 'COLLECTIONS',
            theme: ButtonTheme.YELLOW,
            onClick:() => {
                
            },
        });

        // COLLECTIONS BUTTON

        collectionsButton.position.set(650, 350);

        const optionsButton = new RoundedButton({
            text: 'OPTIONS',
            theme: ButtonTheme.BLUE,
            onClick:() => {

            }
        })

        // OPTIONS BUTTON

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
        
}