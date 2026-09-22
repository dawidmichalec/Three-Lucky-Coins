import { DealerData } from "../../DealerData.ts";
import { ObjectiveType } from "../../../objectives/ObjectiveTypes.ts";
import { DealerGroup } from "../../DealerGroup.ts";
import { DealerRole } from "../../DealerRole.ts";
import { KEVIN_PROFILE } from "../../../probability/DealerOddsProfiles.ts";

export const KEVIN_DATA: DealerData = {
  id: "kevin",

  name: "Kevin",

  title: "juniorDealer",

  avatarNormal: "/assets/main/icons/casino_staff_icons/kevin_icon.png",

  avatarSmall: "/assets/main/icons/casino_staff_icons/kevin_icon_small.png",

  avatarLocked: "/assets/main/icons/casino_staff_icons/locked_dealer_icon.png",

  signatureToken:
    "/assets/main/icons/signature_token_icons/junior_dealers/kevin/kevin_signature_token_icon.png",
  signatureTokenName: "kevinMotorcycleHelmet",
  signatureTokenDescription: "kevinMotorcycleHelmetDescription",

  group: DealerGroup.JUNIOR,
  role: DealerRole.REGULAR,

  oddsProfile: KEVIN_PROFILE,

  objectiveType: ObjectiveType.REACH_MULTIPLIER,

  objectiveValue: 4,

  goldenCoinSettings: {
    baseChance: 0.015,
    chanceMultiplier: 1,
    maximumGoldenCoins: 3,
  },

  gambleForMoreSettings: {
    enabled: true,
    triggerChance: 0.5,
  },

  skills: [],

  dealerDescription: "kevinDescription",

  saying: "kevinSaying",
};
