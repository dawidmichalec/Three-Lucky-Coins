import { GameSettings } from "../config/GameSettings";

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

        audioEnabled:true,

        musicVolume:0.8,

        sfxVolume:1,

        brightness:1,

        language:"en",

        spaceToSpin:true

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


    setLanguage(language:string){

        this.settings.language=language;

    }


    setSpaceToSpin(enabled:boolean){

        this.settings.spaceToSpin=enabled;

    }

}