import { DealerData } from "../../DealerData.ts";
import { ObjectiveType } from "../../../objectives/ObjectiveTypes.ts";
import { DealerGroup } from "../../DealerGroup.ts";
import { DealerRole } from "../../DealerRole.ts";
import { DealerSkillId } from "../../DealerSkill.ts";
import { BECKY_PROFILE } from "../../../probability/DealerOddsProfiles.ts";

export const BECKY_DATA: DealerData = {

    id: "becky",

    name: "Becky",

    title: "juniorDealer",

    avatarNormal:
        "/assets/main/icons/casino_staff_icons/becky_icon.png",

    avatarSmall:
        "/assets/main/icons/casino_staff_icons/becky_icon_small.png",

    avatarLocked:
        "/assets/main/icons/casino_staff_icons/locked_dealer_icon.png",

    signatureToken:
        "/assets/main/icons/signature_token_icons/junior_dealers/becky/becky_signature_token_icon.png",

    group: DealerGroup.JUNIOR,
    role: DealerRole.REGULAR,

    oddsProfile: BECKY_PROFILE,

    objectiveType:
        ObjectiveType.INCREASE_BALANCE,

    objectiveValue: 250,

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
                DealerSkillId.OOPS_I_PAID_YOU_TWICE,

            name:
                "oopsIPaidYouTwiceSkillName",

            description:
                "oopsIPaidYouTwiceSkillDescription"

        }
    ],

    dealerDescription:
        "beckyDescription",

    saying:
        "beckySaying"
};