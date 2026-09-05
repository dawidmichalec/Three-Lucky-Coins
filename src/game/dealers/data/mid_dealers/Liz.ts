import { DealerData } from "../../DealerData.ts";
import { ObjectiveType } from "../../../objectives/ObjectiveTypes.ts";
import { DealerGroup } from "../../DealerGroup.ts";
import { DealerRole } from "../../DealerRole.ts";
import { DealerSkillId } from "../../DealerSkill.ts";
import { LIZ_PROFILE } from "../../../probability/DealerOddsProfiles.ts";

export const LIZ_DATA: DealerData = {
  id: "liz",

  name: "Liz",

  title: "midDealer",

  avatarNormal: "/assets/main/icons/casino_staff_icons/liz_icon.png",

  avatarSmall: "/assets/main/icons/casino_staff_icons/liz_icon_small.png",

  avatarLocked: "/assets/main/icons/casino_staff_icons/locked_dealer_icon.png",

  signatureToken:
    "/assets/main/icons/signature_token_icons/mid_dealers/liz/liz_signature_token_icon.png",
  signatureTokenName: "lizEyeliner",
  signatureTokenDescription: "lizEyelinerDescription",

  group: DealerGroup.MID,
  role: DealerRole.REGULAR,

  oddsProfile: LIZ_PROFILE,

  objectiveType: ObjectiveType.INCREASE_BALANCE,

  objectiveValue: 700,

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
      id: DealerSkillId.NO_SAME_BETS,
      name: "noSameBetsSkillName",
      description: "noSameBetsSkillDescription",
      icon: "/assets/main/icons/dealer_skill_icons/mid_dealers/liz/no_same_bets.png",
    },
  ],

  dealerDescription: "lizDescription",

  saying: "lizSaying",
};
