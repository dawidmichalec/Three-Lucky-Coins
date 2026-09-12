import { DealerData } from "../../DealerData.ts";
import { ObjectiveType } from "../../../objectives/ObjectiveTypes.ts";
import { DealerGroup } from "../../DealerGroup.ts";
import { DealerRole } from "../../DealerRole.ts";
import { DealerSkillId } from "../../DealerSkill.ts";
import { TED_PROFILE } from "../../../probability/DealerOddsProfiles.ts";

export const TED_DATA: DealerData = {
  id: "ted",

  name: "Ted",

  title: "seniorDealer",

  avatarNormal: "/assets/main/icons/casino_staff_icons/ted_icon.png",

  avatarSmall: "/assets/main/icons/casino_staff_icons/ted_icon_small.png",

  avatarLocked: "/assets/main/icons/casino_staff_icons/locked_dealer_icon.png",

  signatureToken:
    "/assets/main/icons/signature_token_icons/senior_dealers/ted/ted_signature_token_icon.png",
  signatureTokenName: "tedCigaretteCase",
  signatureTokenDescription: "tedCigaretteCaseDescription",

  group: DealerGroup.SENIOR,
  role: DealerRole.REGULAR,

  oddsProfile: TED_PROFILE,

  objectiveType: ObjectiveType.INCREASE_BALANCE,

  objectiveValue: 1200,

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
      id: DealerSkillId.DEJA_VU,
      name: "dejaVuSkillName",
      description: "dejaVuSkillDescription",
      icon: "/assets/main/icons/dealer_skill_icons/senior_dealers/ted/deja_vu.png",
    },
  ],

  dealerDescription: "tedDescription",

  saying: "tedSaying",
};
