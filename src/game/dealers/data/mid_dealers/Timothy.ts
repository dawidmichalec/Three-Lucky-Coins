import { DealerData } from "../../DealerData";
import { DealerSkillId } from "../../DealerSkill";
import { ObjectiveType } from "../../../objectives/ObjectiveTypes";
import { DealerGroup } from "../../DealerGroup";
import { DealerRole } from "../../DealerRole";

export const TIMOTHY_DATA: DealerData = {

    id: "timothy",

    name: "Timothy",

    title: "midDealer",

    avatarNormal:
        "/assets/main/icons/casino_staff_icons/timothy_icon.png",

    avatarSmall:
        "/assets/main/icons/casino_staff_icons/timothy_icon_small.png",

    avatarLocked:
        "/assets/main/icons/casino_staff_icons/locked_dealer_icon.png",

    signatureToken:
        "/assets/main/icons/signature_token_icons/mid_dealers/timothy/timothy_signature_token_icon.png",

    group: DealerGroup.MID,
    role: DealerRole.REGULAR,

    objectiveType:
        ObjectiveType.INCREASE_BALANCE,

    objectiveValue: 700,

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
                    .MANDATORY_TIP,

            name:
                "mandatoryTipSkillName",

            description:
                "mandatoryTipSkillDescription"
        }
    ],

    dealerDescription:
        "timothyDescription",

    saying:
        "timothySaying"
};