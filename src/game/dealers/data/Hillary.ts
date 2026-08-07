import { DealerData } from "../DealerData";
import { DealerSkillId } from "../DealerSkill";
import { ObjectiveType } from "../../objectives/ObjectiveTypes";

export const HILLARY_DATA: DealerData = {

    id: "hillary",

    name: "Hillary",

    title: "midDealer",

    avatarNormal:
        "/assets/main/icons/casino_staff_icons/hillary_icon.png",

    avatarSmall:
        "/assets/main/icons/casino_staff_icons/hillary_icon_small.png",

    objectiveType:
        ObjectiveType.INCREASE_BALANCE,

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