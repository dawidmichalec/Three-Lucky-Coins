import { DealerData } from "../../DealerData.ts";
import { ObjectiveType } from "../../../objectives/ObjectiveTypes.ts";
import { DealerGroup } from "../../DealerGroup.ts";
import { DealerRole } from "../../DealerRole.ts";
import { DealerSkillId } from "../../DealerSkill.ts";
import { LAWRENCE_PROFILE } from "../../../probability/DealerOddsProfiles.ts";

export const LAWRENCE_DATA: DealerData = {
  id: "lawrence",

  name: "Lawrence",

  title: "vicePresident",

  avatarNormal: "/assets/main/icons/casino_staff_icons/lawrence_icon.png",

  avatarSmall: "/assets/main/icons/casino_staff_icons/lawrence_icon_small.png",

  avatarLocked: "/assets/main/icons/casino_staff_icons/locked_dealer_icon.png",

  signatureToken:
    "/assets/main/icons/signature_token_icons/vice_president/lawrence/lawrence_signature_token_icon.png",
  signatureTokenName: "lawrenceExecutiveFountainPen",
  signatureTokenDescription: "lawrenceExecutiveFountainPenDescription",

  group: DealerGroup.VICE_PRESIDENT,
  role: DealerRole.SUPERVISOR,

  oddsProfile: LAWRENCE_PROFILE,

  objectiveType: ObjectiveType.INCREASE_BALANCE,

  objectiveValue: 2000,

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
      id: DealerSkillId.MULTIPLIER_LOCK,
      name: "multiplierLockSkillName",
      description: "multiplierLockSkillDescription",
      icon: "/assets/main/icons/dealer_skill_icons/vice_president/lawrence/multiplier_lock.png",
    },

    {
      id: DealerSkillId.BET_LIMITATION,
      name: "betLimitationSkillName",
      description: "betLimitationSkillDescription",
      icon: "/assets/main/icons/dealer_skill_icons/vice_president/lawrence/bet_limitation.png",
    },
  ],

  dealerDescription: "lawrenceDescription",

  saying: "lawrenceSaying",
};
