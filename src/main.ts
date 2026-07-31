import { Application, Sprite, Assets, Container} from 'pixi.js';
import { PopupManager } from './ui/popups/PopupManager';
import { SceneManager } from './game/SceneManager';
import { MainMenuScene } from './game/scenes/MainMenuScene';
import { AudioManager } from './core/AudioManager';
import { SettingsManager } from './core/SettingsManager';
import { SoundId } from './audio/SoundId';
import { DisplayManager } from './core/DisplayManager';
import { StatsManager } from './core/StatsManager';
import { LayoutManager } from './core/LayoutManager';
import { RotateDeviceOverlay } from './ui/overlays/RotateDeviceOverlay';
import { LocalizationManager } from './core/LocalizationManager';

(async () => {
  const app = new Application();

    await app.init({
        background: '#0f0f0f',
        width: 1920,
        height: 1080,
        resizeTo: window
    });

    app.stage.sortableChildren = true;

    document.body.appendChild(app.canvas);

    app.canvas.style.position = 'fixed';
    app.canvas.style.top = '0';
    app.canvas.style.left = '0';
    app.canvas.style.width = "100%";
    app.canvas.style.height = "100%";
    document.body.style.margin = "0";
    document.body.style.overflow = "hidden";

    // LAYOUT MANAGER

    const layout = LayoutManager.getInstance();
    layout.initialize(app);

    // GAME ROOT

    const gameRoot = new Container();

    app.stage.addChild(gameRoot);

    // BACKGROUND

    const backgroundImage = await Assets.load('/assets/main/background image.png');
    const background = new Sprite(backgroundImage);
    background.width = layout.DESIGN_WIDTH;
    background.height = layout.DESIGN_HEIGHT;

    // ORIENTATION OVERLAY

    const orientationOverlay = new RotateDeviceOverlay();

    orientationOverlay.zIndex = 9999;

    app.stage.addChild(
        orientationOverlay
    );

    gameRoot.addChild(
        background,
        orientationOverlay
    );

    const updateLayout = () => {

    gameRoot.scale.set(
            layout.scale
        );


        gameRoot.position.set(
            layout.offsetX,
            layout.offsetY
        );

    };


    layout.register({

        onLayoutChanged(){

            updateLayout();

        }

    });


    updateLayout();

    // FONT

    const font = new FontFace( 'Oswald-Bold', 'url(/assets/main/fonts/Oswald/static/Oswald-Bold.ttf)' ); 
    await font.load(); 
    document.fonts.add(font); 
    await document.fonts.ready;

    // STATS MANAGER

    const statsManager =
        StatsManager.getInstance();

    statsManager.startSession();

    // SETTINGS

    const settingsManager = SettingsManager.getInstance();

    // LOCALIZATION

    const localization =
        LocalizationManager.getInstance();

    localization.setLanguage(
        settingsManager.get().language
    );

    // DISPLAY

    const displayManager =
        DisplayManager.getInstance(
            app.stage
        );

    displayManager.setBrightness(
        settingsManager.get().brightness
    );

    
    // PopupManager

    const popupManager = new PopupManager(layout.DESIGN_WIDTH, layout.DESIGN_HEIGHT);

    popupManager.zIndex = 1000;

    app.stage.addChild(popupManager);

    const sceneManager = new SceneManager(app, popupManager, gameRoot);

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