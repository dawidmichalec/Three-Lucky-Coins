import { DealerData } from "../../DealerData.ts";
import { ObjectiveType } from "../../../objectives/ObjectiveTypes.ts";
import { DealerGroup } from "../../DealerGroup.ts";
import { DealerRole } from "../../DealerRole.ts";
import { DealerSkillId } from "../../DealerSkill.ts";
import { GRACE_PROFILE } from "../../../probability/DealerOddsProfiles.ts";

export const GRACE_DATA: DealerData = {
  id: "grace",

  name: "Grace",

  title: "manager",

  avatarNormal: "/assets/main/icons/casino_staff_icons/grace_icon.png",

  avatarSmall: "/assets/main/icons/casino_staff_icons/grace_icon_small.png",

  avatarLocked: "/assets/main/icons/casino_staff_icons/locked_dealer_icon.png",

  signatureToken:
    "/assets/main/icons/signature_token_icons/managers/grace/grace_signature_token_icon.png",
  signatureTokenName: "graceTermsAndConditions",
  signatureTokenDescription: "graceTermsAndConditionsDescription",

  group: DealerGroup.MANAGER,
  role: DealerRole.REGULAR,

  oddsProfile: GRACE_PROFILE,

  objectiveType: ObjectiveType.WIN_BETS,

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
      id: DealerSkillId.CASINO_POLICY,
      name: "casinoPolicySkillName",
      description: "casinoPolicySkillDescription",
      icon: "/assets/main/icons/dealer_skill_icons/managers/grace/casino_policy.png",
    },
  ],

  dealerDescription: "graceDescription",

  saying: "graceSaying",
};
