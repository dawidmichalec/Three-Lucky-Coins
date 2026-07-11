import { Application, Container } from "pixi.js";
import { PopupManager } from "../ui/popups/PopupManager";
import { GameScene } from "./scenes/GameScene";
import { MainMenuScene } from "./scenes/MainMenuScene";
import { BaseScene } from "./scenes/BaseScene";

export class SceneManager {

    private currentScene?: Container;

    constructor(
        private app: Application,
        private popupManager: PopupManager
    ) {}

    async changeScene(scene: Container) {

        if (this.currentScene) {

            await this.fadeOut(this.currentScene);

            if (this.currentScene instanceof BaseScene) {
                this.currentScene.cleanup();
            }

            this.app.stage.removeChild(this.currentScene);

            this.currentScene.destroy();
        }

        this.currentScene = scene;

        this.app.stage.addChild(scene);

        await this.fadeIn(scene);

        this.app.stage.addChild(this.popupManager);
    }

    private fadeOut(scene: Container): Promise<void> {

        return new Promise(resolve => {

            const ticker = this.app.ticker;

            const update = () => {

                scene.alpha -= 0.02;

                if (scene.alpha <= 0) {

                    scene.alpha = 0;

                    ticker.remove(update);

                    resolve();
                }
            };

            ticker.add(update);

        });

    }

    private fadeIn(scene: Container): Promise<void> {

        return new Promise(resolve => {

            scene.alpha = 0;

            const ticker = this.app.ticker;

            const update = () => {

                scene.alpha += 0.02;

                if (scene.alpha >= 1) {

                    scene.alpha = 1;

                    ticker.remove(update);

                    resolve();
                }
            };

            ticker.add(update);

        });

    }

    showGame() {

        console.log("SHOW GAME");
        this.changeScene(
            new GameScene(
                this.app,
                this.popupManager,
                this
        ));
    }

    showMainMenu() {
        this.changeScene(
            new MainMenuScene(this)
        );
    }

}