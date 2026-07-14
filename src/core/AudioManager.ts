import { sound, PlayOptions, IMediaInstance } from "@pixi/sound";

import { SoundId } from "../audio/SoundId";
import { AUDIO_PATHS } from "../audio/AudioPaths";
import { AUDIO_REGISTRY } from "../audio/AudioRegistry";
import { AudioCategory } from "../audio/AudioCategory";

import { SettingsManager } from "./SettingsManager";


export class AudioManager {


    private static instance: AudioManager;


    static getInstance(
        settingsManager?: SettingsManager
    ){

        if(!AudioManager.instance){

            if(!settingsManager){
                throw new Error(
                    "SettingsManager required"
                );
            }


            AudioManager.instance =
                new AudioManager(settingsManager);

        }


        return AudioManager.instance;

    }



    private constructor(
        private settingsManager: SettingsManager
    ){}



    async load(
        id: SoundId,
        path:string
    ){

        if(sound.exists(id))
            return;


        await sound.add(id,{
            url:path,
            preload:true
        });

    }



    async loadAll(){

        await Promise.all(

            Object.entries(AUDIO_PATHS)
                .map(([id,path])=>
                    this.load(
                        id as SoundId,
                        path
                    )
                )

        );

    }



    play(
        id: SoundId,
        options?: PlayOptions
    ){

        const settings =
            this.settingsManager.get();


        if(!settings.audioEnabled)
            return;


        const category =
            AUDIO_REGISTRY[id];


        const volume =
            category === AudioCategory.MUSIC
                ? settings.musicVolume
                : settings.sfxVolume;


        sound.play(id,{
            volume,
            ...options
        });

    }



    stop(id: SoundId){

        sound.stop(id);

    }



    stopAll(){

        sound.stopAll();

    }



    refresh(){

        const settings =
            this.settingsManager.get();



        if(settings.audioEnabled){

            sound.resumeAll();

        }
        else{

            sound.pauseAll();

        }

    }



    updateVolumes(){

        const settings =
            this.settingsManager.get();


        Object.entries(AUDIO_REGISTRY)
            .forEach(([id, category])=>{

                const volume =
                    category === AudioCategory.MUSIC
                    ? settings.musicVolume
                    : settings.sfxVolume;


                const audio = sound.find(id);

                if(audio){

                    audio.volume = volume;

                }

            });

    }


}