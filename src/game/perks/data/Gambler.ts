import { PerkData } from "../PerkData";
import { PerkRarity } from "../PerkRarity";

export interface GamblerConfig {
    payoutMultiplier: number;
}

export const GAMBLER_DATA: PerkData<GamblerConfig> = {

    id: "gambler",

    name: "gamblerName",

    variants: [
        {
            rarity: PerkRarity.UNCOMMON,

            description: "gamblerDescriptionUncommon",

            assets: {
                small: "/assets/main/icons/perk_icons/gambler/uncommon/gambler_small_icon_uncommon.png",
                mid: "/assets/main/icons/perk_icons/gambler/uncommon/gambler_mid_icon_uncommon.png",
                big: "/assets/main/icons/perk_icons/gambler/uncommon/gambler_big_icon_uncommon.png"
            },

            config: {
                payoutMultiplier: 1.30
            }
        }
    ]
};