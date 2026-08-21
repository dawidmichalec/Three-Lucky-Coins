import { PerkData } from "../PerkData";
import { PerkRarity } from "../PerkRarity";

export interface CasinoBonusConfig {
    freeBetsPerFight: number;
    maximumFreeBet: number;
}

export const CASINO_BONUS_DATA: PerkData<CasinoBonusConfig> = {

    id: "casino_bonus",

    name: "casinoBonusName",

    variants: [
        {
            rarity: PerkRarity.COMMON,

            description: "casinoBonusDescriptionCommon",

            assets: {
                small: "/assets/main/icons/perk_icons/casino_bonus/common/casino_bonus_small_icon_common.png",
                mid: "/assets/main/icons/perk_icons/casino_bonus/common/casino_bonus_mid_icon_common.png",
                big: "/assets/main/icons/perk_icons/casino_bonus/common/casino_bonus_big_icon_common.png"
            },

            config: {
                freeBetsPerFight: 1,
                maximumFreeBet: 10
            }
        }
    ]
};