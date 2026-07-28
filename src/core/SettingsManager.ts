import { GameSettings } from "../config/GameSettings";
import { Language } from "../localization/Language";
import { LocalizationManager } from "./LocalizationManager";


export class SettingsManager {


    private static instance: SettingsManager;


    static getInstance(){

        if(!SettingsManager.instance){

            SettingsManager.instance =
                new SettingsManager();

        }


        return SettingsManager.instance;

    }



    private constructor(){}



    private settings: GameSettings = {

        audioEnabled:false,

        musicVolume:0.8,

        sfxVolume:1,

        brightness:1,

        language: Language.EN,

        spaceToSpin:true,

        fullScreen: false

    };



    get(){

        return this.settings;

    }



    setAudio(enabled:boolean){

        this.settings.audioEnabled = enabled;

    }


    setMusicVolume(volume:number){

        this.settings.musicVolume = volume;

    }


    setSfxVolume(volume:number){

        this.settings.sfxVolume = volume;

    }


    setBrightness(value:number){

        this.settings.brightness=value;

    }


    setLanguage(language: Language){

        this.settings.language = language;

        LocalizationManager
            .getInstance()
            .setLanguage(language);

    }


    setSpaceToSpin(enabled:boolean){

        this.settings.spaceToSpin=enabled;

    }

    setFullScreen(enabled:boolean){

        this.settings.fullScreen=enabled;

    }

}