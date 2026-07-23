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

export class OptionsPanel extends Container {

    private left!: TriangleButton;
    private right!: TriangleButton;

    private settingsManager: SettingsManager;
    private audioManager: AudioManager;
    private displayManager: DisplayManager;

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

        this.createAudioToggleButton();

        this.createMusicSlider();

        this.createSfxSlider();

        this.createBrightnessSlider();

        this.createSaveButton();

        this.createFullScreenToggleButton();

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

        const title = new Text({

            text:"OPTIONS",

            style:{
                fill:0xffffff,
                font: 'Open Sans',
                fontSize:52,
                fontWeight:"bold"
            }

        });


        title.anchor.set(0.5);


        title.position.set(
            width/2,
            108
        );


        this.addChild(title);

    }

    // MUSIC SLIDER

    private createMusicSlider() {

        const slider = new Slider({

            initialValue:
                this.settingsManager.get().musicVolume,

            onChange:(value)=>{

                this.settingsManager
                    .setMusicVolume(value);

                this.audioManager.updateVolumes();

            }

        });


        slider.position.set(
            1235.7,
            350.1
        );


        this.addChild(slider);

    }

    // SFX SLIDER

    private createSfxSlider() {

        const slider = new Slider({

            initialValue:
                this.settingsManager.get().sfxVolume,

            onChange:(value)=>{

                this.settingsManager
                    .setSfxVolume(value);

                this.audioManager.updateVolumes();

            }

        });


        slider.position.set(
            1235.7,
            440.3
        );


        this.addChild(slider);

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

        const audioLabel = new Text({
            text: "Audio",
            style: {
                fill:0xffffff,
                font: 'Open Sans',
                fontSize:32,
                fontWeight:"bold"
            }
        });

        audioLabel.position.set(434.2, 260.3);


        const musicLabel = new Text({
            text: "Music",
            style: {
                fill:0xffffff,
                font: 'Open Sans',
                fontSize:32,
                fontWeight:"bold"
            }
        });

        musicLabel.position.set(434.2, 350.3);


        const soundEffectsLabel = new Text({
            text: "Sound Effects",
            style: {
                fill:0xffffff,
                font: 'Open Sans',
                fontSize:32,
                fontWeight:"bold"
            }
        });

        soundEffectsLabel.position.set(434.2, 440.3);


        const brightnessLabel = new Text({
            text: "Brightness",
            style: {
                fill:0xffffff,
                font: 'Open Sans',
                fontSize:32,
                fontWeight:"bold"
            }
        });

        brightnessLabel.position.set(434.2, 530.3);


        const fullScreenLabel = new Text({
            text: "Fullscreen",
            style: {
                fill:0xffffff,
                font: 'Open Sans',
                fontSize:32,
                fontWeight:"bold"
            }
        });

        fullScreenLabel.position.set(434.2, 620.2);



        const languageLabel = new Text({
            text: "Language",
            style: {
                fill:0xffffff,
                font: 'Open Sans',
                fontSize:32,
                fontWeight:"bold"
            }
        });

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

        const audioToggle = new ToggleButton({
            initialState: settings.audioEnabled,

            onChange: (enabled) => {

                this.settingsManager.setAudio(enabled);

                this.audioManager.refresh();
            }
        });


        audioToggle.position.set(
            1327.4,
            248.2
        );


        this.addChild(audioToggle);

    }

    // FULLSCREEN TOGGLE BUTTON

    createFullScreenToggleButton(){

        const settings = this.settingsManager.get();

        const fullScreenToggle = new ToggleButton({

            initialState: settings.fullScreen,

            onChange: (enabled) => {

                this.settingsManager.setFullScreen(enabled);

                this.displayManager.toggleFullscreen();

            }

        });

        fullScreenToggle.position.set(1327.4, 610.2)

        this.addChild(fullScreenToggle);

    }

    // TRIANGLE BUTTONS

    createTriangleButtons() {

        const left = new TriangleButton({
            direction: 'left',
            label: '',
            onClick: () => {

            },
        });

        const right = new TriangleButton({
            direction: 'right',
            label: '',
            onClick: () => {

            },
        });

        left.position.set(1259.3, 714.2);
        right.position.set(1489.5, 714.2);

        this.left = left;
        this.right = right;

        this.addChild(left, right);

    }

    // CLOSE BUTTON


    async createCloseButton() {
        const close = new ClosePanelButton();

        await close.init();

        close.on("click", () => {
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

        const saveButton = new RoundedButton({
            text: 'SAVE',
            theme: ButtonTheme.GREY,
            onClick:() => {

            }
        });

        saveButton.position.set(792.8, 887.9);

        this.addChild(saveButton);


    }

    show(){

        this.visible = true;

    }


    hide(){

        this.visible = false;

    }

}