import { TranslationKey } from "../../core/LocalizationManager";
import { PerkRarity } from "./PerkRarity";


export interface PerkAssets {
    small: string;
    mid: string;
    big: string;
}


export interface PerkVariant<TConfig = unknown> {
    rarity: PerkRarity;

    description: TranslationKey;

    assets: PerkAssets;

    config: TConfig;
}


export interface PerkData<TConfig = unknown> {
    id: string;

    name: TranslationKey;

    variants: readonly PerkVariant<TConfig>[];
}