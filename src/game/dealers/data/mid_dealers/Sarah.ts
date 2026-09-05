import { DealerData } from "../../DealerData.ts";
import { ObjectiveType } from "../../../objectives/ObjectiveTypes.ts";
import { DealerGroup } from "../../DealerGroup.ts";
import { DealerRole } from "../../DealerRole.ts";
import { DealerSkillId } from "../../DealerSkill.ts";
import { SARAH_PROFILE } from "../../../probability/DealerOddsProfiles.ts";

export const SARAH_DATA: DealerData = {
  id: "sarah",

  name: "Sarah",

  title: "midDealer",

  avatarNormal: "/assets/main/icons/casino_staff_icons/sarah_icon.png",

  avatarSmall: "/assets/main/icons/casino_staff_icons/sarah_icon_small.png",

  avatarLocked: "/assets/main/icons/casino_staff_icons/locked_dealer_icon.png",

  signatureToken:
    "/assets/main/icons/signature_token_icons/mid_dealers/sarah/sarah_signature_token_icon.png",
  signatureTokenName: "sarahPerfume",
  signatureTokenDescription: "sarahPerfumeDescription",

  group: DealerGroup.MID,
  role: DealerRole.REGULAR,

  oddsProfile: SARAH_PROFILE,

  objectiveType: ObjectiveType.REACH_MULTIPLIER,

  objectiveValue: 11,

  goldenCoinSettings: {
    baseChance: 0.0075,
    chanceMultiplier: 1,
    maximumGoldenCoins: 3,
  },

  gambleForMoreSettings: {
    enabled: true,
    triggerChance: 0.3,
  },

  skills: [
    {
      id: DealerSkillId.BET_VARIETY,
      name: "betVarietySkillName",
      description: "betVarietySkillDescription",
      icon: "/assets/main/icons/dealer_skill_icons/mid_dealers/sarah/bet_variety.png",
    },
  ],

  dealerDescription: "sarahDescription",

  saying: "sarahSaying",
};
