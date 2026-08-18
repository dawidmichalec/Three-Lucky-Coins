import { PerkData } from "../PerkData";
import { PerkRarity } from "../PerkRarity";


interface MultiplierBoosterConfig {
    streakMultiplierIncrease: number;
}


export const MULTIPLIER_BOOSTER_DATA:
PerkData<MultiplierBoosterConfig> = {

    id: "multiplier_booster",

    name: "multiplierBoosterName",

    variants: [
        {
            rarity:
                PerkRarity.COMMON,

            description:
                "multiplierBoosterDescriptionCommon",

            assets: {
                small:
                    "/assets/main/icons/perk_icons/multiplier_booster/common/multiplier_booster_small_icon_common.png",

                mid:
                    "/assets/main/icons/perks/multiplier_booster/common/multiplier_booster_mid_icon_common.png",

                big:
                    "/assets/main/icons/perks/multiplier_booster/common/multiplier_booster_big_icon_common.png"
            },

            config: {
                streakMultiplierIncrease:
                    0.25
            }
        }
    ]
};