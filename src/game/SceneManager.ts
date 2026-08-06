import { Application, Container } from "pixi.js";
import { PopupManager } from "../ui/popups/PopupManager";
import { GameScene } from "./scenes/GameScene";
import { MainMenuScene } from "./scenes/MainMenuScene";
import { BaseScene } from "./scenes/BaseScene";
import { StatsManager } from "../core/StatsManager";

export class SceneManager {

    private currentScene?: BaseScene;

    constructor(
        private app: Application,
        private popupManager: PopupManager,
        private sceneContainer: Container
    ) {

        this.app.ticker.add((ticker) => {

            this.currentScene?.update(ticker.deltaTime);

        });

    }

    async changeScene(
        scene: BaseScene
    ) {

        if (this.currentScene) {

            await this.fadeOut(
                this.currentScene
            );

            this.currentScene.cleanup();

            this.sceneContainer.removeChild(
                this.currentScene
            );

            this.currentScene.destroy({
                children: true
            });
        }

        /*
            Scena nie znajduje się jeszcze na ekranie.
            Czekamy na avatar, monety i overlay.
        */
        await scene.init();

        this.currentScene = scene;

        this.sceneContainer.addChild(
            scene
        );

        await this.fadeIn(
            scene
        );

        this.sceneContainer.addChild(
            this.popupManager
        );
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

        const statsManager = StatsManager.getInstance();

        statsManager.startRun();

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