import { Language } from "../localization/Language";

export interface GameSettings {

    audioEnabled: boolean;

    musicVolume: number;

    sfxVolume: number;

    brightness: number;

    language: Language;

    spaceToSpin: boolean;

    fullScreen: boolean;

}