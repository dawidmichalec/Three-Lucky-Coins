import { Container, Text } from "pixi.js";
import { Overlay } from "../popups/Overlay";
import { ButtonTheme } from "../buttons/ButtonTheme";
import { RoundedButton } from "../buttons/RoundedButton";
import { AudioManager } from "../../core/AudioManager";
import { SettingsManager } from "../../core/SettingsManager";
import { TriangleButton } from "../buttons/TriangleButton";
import { ToggleButton } from "../buttons/ToggleButton";
import {Slider} from "../controls/Slider"
import { ConfirmationPopup } from "../popups/ConfirmationPopup";
import { DisplayManager } from "../../core/DisplayManager";
import { ClosePanelButton } from "../buttons/ClosePanelButton";
import { LocalizedText } from "../../localization/LocalizedText";
import { LANGUAGE_CONFIG } from "../../localization/LanguageConfig";

export class OptionsPanel extends Container {

    private left!: TriangleButton;
    private right!: TriangleButton;

    private saveButton!: RoundedButton;

    private settingsManager: SettingsManager;
    private audioManager: AudioManager;
    private displayManager: DisplayManager;

    private languageLabel!: Text;

    private currentLanguageIndex = 0;

    private audioToggle!: ToggleButton;
    private musicSlider!: Slider;
    private sfxSlider!: Slider;

    private fullScreenToggle!: ToggleButton;

    constructor(
        width: number,
        height: number,
        private onClose: ()=>void
    ) {
        super();

        this.settingsManager = SettingsManager.getInstance();

        this.audioManager = AudioManager.getInstance(
            this.settingsManager
        );

        this.displayManager = DisplayManager.getInstance();

        this.createOverlay(width, height);

        this.createTitle(width);

        this.createLabelsForOptions();

        this.createCloseButton();

        this.createTriangleButtons();

        this.createLanguageSelector();

        this.createAudioToggleButton();

        this.createMusicSlider();

        this.createSfxSlider();

        this.createBrightnessSlider();

        this.createSaveButton();

        this.createFullScreenToggleButton();

        this.syncAudioState();

    }

    // OVERLAY

    private createOverlay(width:number,height:number){

        const overlay = new Overlay(
            width,
            height
        );

        this.addChild(overlay);

    }

    // TITLE

    private createTitle(width: number){

        const title = new LocalizedText(

            "options",

            {
                fill:0xffffff,
                font: 'Open Sans',
                fontSize:52,
                fontWeight:"bold"
            }
        );


        title.anchor.set(0.5);


        title.position.set(
            width/2,
            108
        );


        this.addChild(title);

    }

    // MUSIC SLIDER

    private createMusicSlider() {

        this.musicSlider = new Slider({

            initialValue:
                this.settingsManager.get().musicVolume,

            onChange:(value)=>{

                this.settingsManager
                    .setMusicVolume(value);

                this.audioManager.updateVolumes();

            }

        });


        this.musicSlider.position.set(
            1235.7,
            350.1
        );


        this.addChild(this.musicSlider);

    }

    // SFX SLIDER

    private createSfxSlider() {

        this.sfxSlider = new Slider({

            initialValue:
                this.settingsManager.get().sfxVolume,

            onChange:(value)=>{

                this.settingsManager
                    .setSfxVolume(value);

                this.audioManager.updateVolumes();

            }

        });


        this.sfxSlider.position.set(
            1235.7,
            440.3
        );


        this.addChild(this.sfxSlider);

    }

    // BRIGHTNESS SLIDER

    private createBrightnessSlider() {

        const slider = new Slider({

            initialValue:
                this.settingsManager.get().brightness,

            onChange:(value)=>{

                this.settingsManager
                    .setBrightness(value);


                this.displayManager
                    .setBrightness(value);


            }

        });


        slider.position.set(
            1235.7,
            530.3
        );


        this.addChild(slider);

    }


    // LABELS CREATION

    private createLabelsForOptions() {

        const audioLabel = new LocalizedText(
            "audio",
            {
                fill:0xffffff,
                font: 'Open Sans',
                fontSize:32,
                fontWeight:"bold"
            }
        );

        audioLabel.position.set(434.2, 260.3);


        const musicLabel = new LocalizedText(
            "music",
            {
                fill:0xffffff,
                font: 'Open Sans',
                fontSize:32,
                fontWeight:"bold"
            }
        );

        musicLabel.position.set(434.2, 350.3);


        const soundEffectsLabel = new LocalizedText(
            "soundEffects",
            {
                fill:0xffffff,
                font: 'Open Sans',
                fontSize:32,
                fontWeight:"bold"
            }
        );

        soundEffectsLabel.position.set(434.2, 440.3);


        const brightnessLabel = new LocalizedText(
            "brightness",
            {
                fill:0xffffff,
                font: 'Open Sans',
                fontSize:32,
                fontWeight:"bold"
            }
        );

        brightnessLabel.position.set(434.2, 530.3);


        const fullScreenLabel = new LocalizedText(
            "fullscreen",
            {
                fill:0xffffff,
                font: 'Open Sans',
                fontSize:32,
                fontWeight:"bold"
            }
        );

        fullScreenLabel.position.set(434.2, 620.2);



        const languageLabel = new LocalizedText(
            "language",
            {
                fill:0xffffff,
                font: 'Open Sans',
                fontSize:32,
                fontWeight:"bold"
            }
        );

        languageLabel.position.set(434.2, 710.2);

        this.addChild(
            audioLabel,
            musicLabel,
            soundEffectsLabel,
            brightnessLabel,
            fullScreenLabel,
            languageLabel
        );

    }

    // AUDIO TOGGLE BUTTON

    createAudioToggleButton() {

        const settings = this.settingsManager.get();

        this.audioToggle = new ToggleButton({

            initialState: settings.audioEnabled,

            onChange: (enabled) => {

                this.settingsManager.setAudio(enabled);

                this.musicSlider.setEnabled(enabled);
                this.sfxSlider.setEnabled(enabled);

                this.audioManager.refresh();
            }
        });


        this.audioToggle.position.set(
            1327.4,
            248.2
        );


        this.addChild(this.audioToggle);

    }

    // FULLSCREEN TOGGLE BUTTON

    createFullScreenToggleButton(){

        const settings = this.settingsManager.get();

        this.fullScreenToggle = new ToggleButton({

            initialState: settings.fullScreen,

            onChange: (enabled) => {

                this.settingsManager.setFullScreen(enabled);

                this.displayManager.toggleFullscreen();

            }

        });

        this.displayManager.setFullscreenListener(
            (enabled)=>{

                this.fullScreenToggle.setState(enabled);

                this.settingsManager
                    .setFullScreen(enabled);

            }
        );

        this.fullScreenToggle.position.set(1327.4, 610.2)

        this.addChild(this.fullScreenToggle);

    }

    //

    private updateLanguageLabel(){

        this.languageLabel.text =
            LANGUAGE_CONFIG[
                this.currentLanguageIndex
            ].name;

    }


    private createLanguageSelector(){

        this.languageLabel = new Text({

            text:
                LANGUAGE_CONFIG[
                    this.currentLanguageIndex
                ].name,

            style:{
                fill:0xffffff,
                font:'Open Sans',
                fontSize:32,
                fontWeight:"bold"
            }

        });


        this.languageLabel.anchor.set(0.5);


        this.languageLabel.position.set(
            1385,
            735.2
        );


        this.addChild(
            this.languageLabel
        );

    }

    // TRIANGLE BUTTONS

    createTriangleButtons() {

        const left = new TriangleButton({
            direction: 'left',
            label: '',
            onClick: () => {

                this.currentLanguageIndex--;

                if(this.currentLanguageIndex < 0){

                    this.currentLanguageIndex =
                        LANGUAGE_CONFIG.length - 1;

                }

                this.updateLanguageLabel();

                this.saveButton.visible = true;

            },
        });

        const right = new TriangleButton({
            direction: 'right',
            label: '',
            onClick: () => {

                this.currentLanguageIndex++;

                if(this.currentLanguageIndex >= LANGUAGE_CONFIG.length){

                    this.currentLanguageIndex = 0;

                }

                this.updateLanguageLabel();

                this.saveButton.visible = true;

            },
        });

        left.position.set(1239.3, 714.2);
        right.position.set(1499.5, 714.2);

        this.left = left;
        this.right = right;

        this.addChild(left, right);

    }

    // CLOSE BUTTON


    async createCloseButton() {
        const close = new ClosePanelButton();

        await close.init();

        close.on("pointerdown", () => {
            close.scale.set(0.95);
        });

        close.on("pointerup", () => {
            close.scale.set(1);
        });

        close.on("pointerupoutside", () => {
            close.scale.set(1);
        });

        close.on("pointertap", () => {
            this.hide();
        });

        close.position.set(
            1750,
            108
        );

        this.addChild(close);
    }

    // SAVE BUTTON

    private createSaveButton() {

        this.saveButton = new RoundedButton({
            text: "save",
            theme: ButtonTheme.GREEN,
            onClick:() => {

                const selectedLanguage =
                LANGUAGE_CONFIG[
                    this.currentLanguageIndex
                ].id;


                this.settingsManager
                    .setLanguage(selectedLanguage);

                this.saveButton.visible = false;

            }
        });

        this.saveButton.position.set(792.8, 887.9);

        this.saveButton.visible = false;

        this.addChild(this.saveButton);


    }


    private syncAudioState() {

        const enabled =
            this.settingsManager.get().audioEnabled;

        this.musicSlider.setEnabled(enabled);
        this.sfxSlider.setEnabled(enabled);

    }



    show(){

        const currentLanguage =
        this.settingsManager.get().language;


        this.currentLanguageIndex =
            LANGUAGE_CONFIG.findIndex(
                lang => lang.id === currentLanguage
            );


        this.updateLanguageLabel();

        this.saveButton.visible = false;


        this.visible = true;

    }


    hide(){

        this.visible = false;

    }

}