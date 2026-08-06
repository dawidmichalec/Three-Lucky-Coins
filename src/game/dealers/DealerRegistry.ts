import { DealerData } from "./DealerData";
import { DealerSkillId } from "./DealerSkill";
import { ObjectiveType } from "../objectives/ObjectiveTypes";

export const BEN_DATA: DealerData = {
    id: "ben",

    name: "Ben",
    title: "juniorDealer",

    avatarNormal:
        "/assets/main/icons/casino_staff_icons/ben_icon.png",

    avatarSmall:
        "/assets/main/icons/casino_staff_icons/ben_icon_small.png",

    objectiveType:
        ObjectiveType.REACH_BALANCE,

    objectiveValue: 50,

    skills: [],

    dealerDescription:
        "benDescription",

    saying:
        "benSaying"
};

export const HILLARY_DATA: DealerData = {
    id: "hillary",

    name: "Hillary",
    title: "midDealer",

    avatarNormal:
        "/assets/main/icons/casino_staff_icons/hillary_icon.png",

    avatarSmall:
        "/assets/main/icons/casino_staff_icons/hillary_icon_small.png",

    objectiveType:
        ObjectiveType.REACH_BALANCE,

    objectiveValue: 100,

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

export const TIMOTHY_DATA: DealerData = {
    id: "timothy",

    name: "Timothy",
    title: "midDealer",

    avatarNormal:
        "/assets/main/icons/casino_staff_icons/timothy_icon.png",

    avatarSmall:
        "/assets/main/icons/casino_staff_icons/timothy_icon_small.png",

    objectiveType:
        ObjectiveType.REACH_BALANCE,

    objectiveValue: 200,

    skills: [
        {
            id:
                DealerSkillId.MANDATORY_TIP,

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