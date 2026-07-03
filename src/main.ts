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

    const logoImage = await Assets.load('/assets/main/logo.png');

    const logoSprite = new Sprite(logoImage);
    logoSprite.width = 700;
    logoSprite.height = 300;

    app.stage.addChild(logoSprite);

    const font = new FontFace( 'Oswald-Bold', 'url(/assets/main/fonts/Oswald/static/Oswald-Bold.ttf)' ); 
    await font.load(); 
    document.fonts.add(font); 
    await document.fonts.ready;

    logoSprite.position.set(420, 30);

    app.ticker.add(() => {
      logoSprite.alpha =
          0.85 + Math.sin(performance.now() * 0.006) * 0.30;
     });

    // PopupManager

    const popupManager = new PopupManager(app.screen.width, app.screen.height);

    // GameScene

    const gameScene = new GameScene(app, popupManager);

    app.stage.sortableChildren = true;

    app.stage.addChild(gameScene);
    app.stage.addChild(popupManager);

})();
