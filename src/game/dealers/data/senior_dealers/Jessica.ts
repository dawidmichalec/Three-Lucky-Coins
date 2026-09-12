import { DealerData } from "../../DealerData.ts";
import { ObjectiveType } from "../../../objectives/ObjectiveTypes.ts";
import { DealerGroup } from "../../DealerGroup.ts";
import { DealerRole } from "../../DealerRole.ts";
import { DealerSkillId } from "../../DealerSkill.ts";
import { JESSICA_PROFILE } from "../../../probability/DealerOddsProfiles.ts";

export const JESSICA_DATA: DealerData = {
  id: "jessica",

  name: "Jessica",

  title: "seniorDealer",

  avatarNormal: "/assets/main/icons/casino_staff_icons/jessica_icon.png",

  avatarSmall: "/assets/main/icons/casino_staff_icons/jessica_icon_small.png",

  avatarLocked: "/assets/main/icons/casino_staff_icons/locked_dealer_icon.png",

  signatureToken:
    "/assets/main/icons/signature_token_icons/senior_dealers/jessica/jessica_signature_token_icon.png",
  signatureTokenName: "jessicaRubiksCube",
  signatureTokenDescription: "jessicaRubiksCubeDescription",

  group: DealerGroup.SENIOR,
  role: DealerRole.REGULAR,

  oddsProfile: JESSICA_PROFILE,

  objectiveType: ObjectiveType.REACH_MULTIPLIER,

  objectiveValue: 10,

  goldenCoinSettings: {
    baseChance: 0.0075,
    chanceMultiplier: 1,
    maximumGoldenCoins: 3,
  },

  gambleForMoreSettings: {
    enabled: true,
    triggerChance: 0.5,
  },

  skills: [
    {
      id: DealerSkillId.PATTERN_BREAKER ,
      name: "patternBreakerSkillName",
      description: "patternBreakerSkillDescription",
      icon: "/assets/main/icons/dealer_skill_icons/senior_dealers/jessica/pattern_breaker.png",
    },
  ],

  dealerDescription: "jessicaDescription",

  saying: "jessicaSaying",
};
