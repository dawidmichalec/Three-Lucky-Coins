import { BaseScene } from "./BaseScene";
import { SceneManager } from "../SceneManager";
import { RoundedButton } from "../../ui/buttons/RoundedButton";
import { ButtonTheme } from "../../ui/buttons/ButtonTheme";

export class MainMenuScene extends BaseScene {

    constructor(
        private sceneManager: SceneManager
    ) {
        super();

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
    
}