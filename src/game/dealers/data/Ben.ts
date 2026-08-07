import { DealerData } from "../DealerData";
import { ObjectiveType } from "../../objectives/ObjectiveTypes";

export const BEN_DATA: DealerData = {

    id: "ben",

    name: "Ben",

    title: "juniorDealer",

    avatarNormal:
        "/assets/main/icons/casino_staff_icons/ben_icon.png",

    avatarSmall:
        "/assets/main/icons/casino_staff_icons/ben_icon_small.png",

    objectiveType:
        ObjectiveType.INCREASE_BALANCE,

    objectiveValue: 50,

    skills: [],

    dealerDescription:
        "benDescription",

    saying:
        "benSaying"
};