import { Application, Sprite, Assets} from 'pixi.js';
import { GameScene } from './game/GameScene';
import { PopupManager } from './ui/popups/PopupManager';

(async () => {
  const app = new Application();

    await app.init({
        background: '#0f0f0f',
        width: window.innerWidth,
        height: window.innerHeight,
    });

    document.body.appendChild(app.canvas);

    app.canvas.style.position = 'fixed';
    app.canvas.style.top = '0';
    app.canvas.style.left = '0';

    const backgroundImage = await Assets.load('/assets/main/background image.png');
    const background = new Sprite(backgroundImage);
    background.width = app.screen.width;
    background.height = app.screen.height;
    app.stage.addChild(background);

    // PopupManager

    const popupManager = new PopupManager(app.screen.width, app.screen.height);

    // GameScene

    const gameScene = new GameScene(app, popupManager);

    app.stage.sortableChildren = true;

    app.stage.addChild(gameScene);
    app.stage.addChild(popupManager);

})();
