import { DealerData } from "../../DealerData";
import { DealerSkillId } from "../../DealerSkill";
import { ObjectiveType } from "../../../objectives/ObjectiveTypes";
import { DealerGroup } from "../../DealerGroup";
import { DealerRole } from "../../DealerRole";
import { HILLARY_PROFILE } from "../../../probability/DealerOddsProfiles";

export const HILLARY_DATA: DealerData = {

    id: "hillary",

    name: "Hillary",

    title: "midDealer",

    avatarNormal:
        "/assets/main/icons/casino_staff_icons/hillary_icon.png",

    avatarSmall:
        "/assets/main/icons/casino_staff_icons/hillary_icon_small.png",

    avatarLocked:
        "/assets/main/icons/casino_staff_icons/locked_dealer_icon.png",

    signatureToken:
        "/assets/main/icons/signature_token_icons/mid_dealers/hillary/hillary_signature_token_icon.png",

    group: DealerGroup.MID,
    role: DealerRole.REGULAR,

    oddsProfile: HILLARY_PROFILE,

    objectiveType:
        ObjectiveType.INCREASE_BALANCE,

    objectiveValue: 500,

    goldenCoinSettings: {
        baseChance: 0.0075,
        chanceMultiplier: 1,
        maximumGoldenCoins: 3
    },

    gambleForMoreSettings: {
        enabled: true,
        triggerChance: 0.5
    },


    skills: [
        {
            id:
                DealerSkillId
                    .SLOWER_MULTIPLIER_GROWTH,

            name:
                "slowerMultiplierGrowthSkillName",

            description:
                "slowerMultiplierGrowthSkillDescription"
        }
    ],

    dealerDescription:
        "hillaryDescription",

    saying:
        "hillarySaying"
};