import { DealerData } from "../../DealerData.ts";
import { ObjectiveType } from "../../../objectives/ObjectiveTypes.ts";
import { DealerGroup } from "../../DealerGroup.ts";
import { DealerRole } from "../../DealerRole.ts";
import { ZACK_PROFILE } from "../../../probability/DealerOddsProfiles.ts";

export const ZACK_DATA: DealerData = {
  id: "zack",

  name: "Zack",

  title: "juniorDealer",

  avatarNormal: "/assets/main/icons/casino_staff_icons/zack_icon.png",

  avatarSmall: "/assets/main/icons/casino_staff_icons/zack_icon_small.png",

  avatarLocked: "/assets/main/icons/casino_staff_icons/locked_dealer_icon.png",

  signatureToken:
    "/assets/main/icons/signature_token_icons/junior_dealers/zack/zack_signature_token_icon.png",
  signatureTokenName: "zackStudentId",
  signatureTokenDescription: "zackStudentIdDescription",

  group: DealerGroup.JUNIOR,
  role: DealerRole.REGULAR,

  oddsProfile: ZACK_PROFILE,

  objectiveType: ObjectiveType.INCREASE_BALANCE,

  objectiveValue: 200,

  goldenCoinSettings: {
    baseChance: 0.0075,
    chanceMultiplier: 1,
    maximumGoldenCoins: 3,
  },

  gambleForMoreSettings: {
    enabled: true,
    triggerChance: 0.5,
  },

  skills: [],

  dealerDescription: "zackDescription",

  saying: "zackSaying",
};
