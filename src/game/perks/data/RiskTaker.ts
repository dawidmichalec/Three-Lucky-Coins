import { PerkData } from "../PerkData";
import { PerkRarity } from "../PerkRarity";

export interface RiskTakerConfig {
    payoutMultiplier: number;
}

export const RISK_TAKER_DATA: PerkData<RiskTakerConfig> = {

    id: "risk_taker",

    name: "riskTakerName",

    variants: [
        {
            rarity: PerkRarity.UNCOMMON,

            description: "riskTakerDescriptionUncommon",

            assets: {
                small: "/assets/main/icons/perk_icons/risk_taker/uncommon/risk_taker_small_icon_uncommon.png",
                mid: "/assets/main/icons/perk_icons/risk_taker/uncommon/risk_taker_mid_icon_uncommon.png",
                big: "/assets/main/icons/perk_icons/risk_taker/uncommon/risk_taker_big_icon_uncommon.png"
            },

            config: {
                payoutMultiplier: 1.125
            }
        }
    ]
};