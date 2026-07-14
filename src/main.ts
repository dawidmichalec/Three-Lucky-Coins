import { Application, Sprite, Assets} from 'pixi.js';
import { PopupManager } from './ui/popups/PopupManager';
import { SceneManager } from './game/SceneManager';
import { MainMenuScene } from './game/scenes/MainMenuScene';
import { AudioManager } from './core/AudioManager';
import { SettingsManager } from './core/SettingsManager';
import { SoundId } from './audio/SoundId';
import { DisplayManager } from './core/DisplayManager';

(async () => {
  const app = new Application();

    await app.init({
        background: '#0f0f0f',
        width: window.innerWidth,
        height: window.innerHeight,
    });

    app.stage.sortableChildren = true;

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

    // SETTINGS

    const settingsManager = SettingsManager.getInstance();

    // DISPLAY

    const displayManager =
        DisplayManager.getInstance(
            app.stage
        );

    displayManager.setBrightness(
        settingsManager.get().brightness
    );

    
    // PopupManager

    const popupManager = new PopupManager(app.screen.width, app.screen.height);

    popupManager.zIndex = 1000;

    app.stage.addChild(popupManager);

    const sceneManager = new SceneManager(app, popupManager);

    const mainMenu = new MainMenuScene(
        sceneManager
    );

    // SceneManager

    sceneManager.changeScene(mainMenu);

    // AUDIO

    const audioManager = AudioManager.getInstance(settingsManager);
    

    await audioManager.loadAll();

    audioManager.play(
        SoundId.MAIN_THEME,
        {
            loop:true
        }
    );

})();
