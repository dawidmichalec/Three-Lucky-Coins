import { DealerData } from "../../DealerData.ts";
import { ObjectiveType } from "../../../objectives/ObjectiveTypes.ts";
import { DealerGroup } from "../../DealerGroup.ts";
import { DealerRole } from "../../DealerRole.ts";

export const BEN_DATA: DealerData = {

    id: "ben",

    name: "Ben",

    title: "juniorDealer",

    avatarNormal:
        "/assets/main/icons/casino_staff_icons/ben_icon.png",

    avatarSmall:
        "/assets/main/icons/casino_staff_icons/ben_icon_small.png",

    avatarLocked:
        "/assets/main/icons/casino_staff_icons/locked_dealer_icon.png",

    signatureToken:
        "/assets/main/icons/signature_token_icons/junior_dealers/ben/ben_signature_token_icon.png",

    group: DealerGroup.JUNIOR,
    role: DealerRole.REGULAR,

    objectiveType:
        ObjectiveType.INCREASE_BALANCE,

    objectiveValue: 50,

    goldenCoinSettings: {
        baseChance: 0.015,
        chanceMultiplier: 1,
        maximumGoldenCoins: 3
    },

    gambleForMoreSettings: {
        enabled: true,
        triggerChance: 0.75
    },

    skills: [],

    dealerDescription:
        "benDescription",

    saying:
        "benSaying"
};