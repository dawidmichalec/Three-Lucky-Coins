import { DealerData } from "../DealerData";
import { DealerSkillId } from "../DealerSkill";
import { ObjectiveType } from "../../objectives/ObjectiveTypes";

export const TIMOTHY_DATA: DealerData = {

    id: "timothy",

    name: "Timothy",

    title: "midDealer",

    avatarNormal:
        "/assets/main/icons/casino_staff_icons/timothy_icon.png",

    avatarSmall:
        "/assets/main/icons/casino_staff_icons/timothy_icon_small.png",

    objectiveType:
        ObjectiveType.INCREASE_BALANCE,

    objectiveValue: 200,

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