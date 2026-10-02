import { DealerData } from "../../DealerData.ts";
import { ObjectiveType } from "../../../objectives/ObjectiveTypes.ts";
import { DealerGroup } from "../../DealerGroup.ts";
import { DealerRole } from "../../DealerRole.ts";
import { DealerSkillId } from "../../DealerSkill.ts";
import { LIONEL_PROFILE } from "../../../probability/DealerOddsProfiles.ts";

export const LIONEL_DATA: DealerData = {
  id: "lionel",

  name: "Lionel",

  title: "manager",

  avatarNormal: "/assets/main/icons/casino_staff_icons/lionel_icon.png",

  avatarSmall: "/assets/main/icons/casino_staff_icons/lionel_icon_small.png",

  avatarLocked: "/assets/main/icons/casino_staff_icons/locked_dealer_icon.png",

  signatureToken:
    "/assets/main/icons/signature_token_icons/managers/lionel/lionel_signature_token_icon.png",
  signatureTokenName: "lionelSecurityCard",
  signatureTokenDescription: "lionelSecurityCardDescription",

  group: DealerGroup.MANAGER,
  role: DealerRole.REGULAR,

  oddsProfile: LIONEL_PROFILE,

  objectiveType: ObjectiveType.INCREASE_BALANCE,

  objectiveValue: 3000,

  goldenCoinSettings: {
    baseChance: 0.0075,
    chanceMultiplier: 0.5,
    maximumGoldenCoins: 3,
  },

  gambleForMoreSettings: {
    enabled: true,
    triggerChance: 0.5,
  },

  skills: [
    {
      id: DealerSkillId.SECURITY_CHECK,
      name: "securityCheckSkillName",
      description: "securityCheckSkillDescription",
      icon: "/assets/main/icons/dealer_skill_icons/managers/lionel/security_check.png",
      triggerChance: 0.7,
    },
  ],

  dealerDescription: "lionelDescription",

  saying: "lionelSaying",
};
