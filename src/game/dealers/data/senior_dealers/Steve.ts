import { DealerData } from "../../DealerData.ts";
import { ObjectiveType } from "../../../objectives/ObjectiveTypes.ts";
import { DealerGroup } from "../../DealerGroup.ts";
import { DealerRole } from "../../DealerRole.ts";
import { DealerSkillId } from "../../DealerSkill.ts";
import { STEVE_PROFILE } from "../../../probability/DealerOddsProfiles.ts";

export const STEVE_DATA: DealerData = {
  id: "steve",

  name: "Steve",

  title: "seniorDealer",

  avatarNormal: "/assets/main/icons/casino_staff_icons/steve_icon.png",

  avatarSmall: "/assets/main/icons/casino_staff_icons/steve_icon_small.png",

  avatarLocked: "/assets/main/icons/casino_staff_icons/locked_dealer_icon.png",

  signatureToken:
    "/assets/main/icons/signature_token_icons/senior_dealers/steve/steve_signature_token_icon.png",
  signatureTokenName: "steveHairComb",
  signatureTokenDescription: "steveHairCombDescription",

  group: DealerGroup.SENIOR,
  role: DealerRole.REGULAR,

  oddsProfile: STEVE_PROFILE,

  objectiveType: ObjectiveType.INCREASE_BALANCE,

  objectiveValue: 800,

  goldenCoinSettings: {
    baseChance: 0.0075,
    chanceMultiplier: 0.7,
    maximumGoldenCoins: 3,
  },

  gambleForMoreSettings: {
    enabled: true,
    triggerChance: 0.5,
  },

  skills: [
    {
      id: DealerSkillId.TIME_IS_MONEY_PLUS,
      name: "timeIsMoneyPlusSkillName",
      description: "timeIsMoneyPlusSkillDescription",
      icon: "/assets/main/icons/dealer_skill_icons/senior_dealers/steve/time_is_money_plus.png",
      timeLimit: 7
    },
  ],

  dealerDescription: "steveDescription",

  saying: "steveSaying",
};
