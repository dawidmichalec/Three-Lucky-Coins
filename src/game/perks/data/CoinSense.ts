import { PerkData } from "../PerkData";
import { PerkRarity } from "../PerkRarity";

export interface CoinSenseConfig {
    revealedTossesPerFight: number;
    payoutMultiplier: number;
}

export const COIN_SENSE_DATA: PerkData<CoinSenseConfig> = {

    id: "coin_sense",

    name: "coinSenseName",

    variants: [
        {
            rarity: PerkRarity.COMMON,

            description: "coinSenseDescriptionCommon",

            assets: {
                small: "/assets/main/icons/perk_icons/coin_sense/common/coin_sense_small_icon_common.png",
                mid: "/assets/main/icons/perk_icons/coin_sense/common/coin_sense_mid_icon_common.png",
                big: "/assets/main/icons/perk_icons/coin_sense/common/coin_sense_big_icon_common.png"
            },

            config: {
                revealedTossesPerFight: 1,
                payoutMultiplier: 0.75
            }
        }
    ]
};