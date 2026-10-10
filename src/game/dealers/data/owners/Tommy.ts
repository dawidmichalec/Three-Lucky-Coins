import { DealerData } from "../../DealerData.ts";
import { ObjectiveType } from "../../../objectives/ObjectiveTypes.ts";
import { DealerGroup } from "../../DealerGroup.ts";
import { DealerRole } from "../../DealerRole.ts";
import { DealerSkillId } from "../../DealerSkill.ts";
import { TOMMY_PROFILE } from "../../../probability/DealerOddsProfiles.ts";

export const TOMMY_DATA: DealerData = {
  id: "tommy",

  name: "Tommy",

  title: "owner",

  avatarNormal: "/assets/main/icons/casino_staff_icons/tommy_icon.png",

  avatarSmall: "/assets/main/icons/casino_staff_icons/tommy_icon_small.png",

  avatarLocked: "/assets/main/icons/casino_staff_icons/locked_dealer_icon.png",

  signatureToken:
    "/assets/main/icons/signature_token_icons/owners/tommy/tommy_signature_token_icon.png",
  signatureTokenName: "tommyGoldenRing",
  signatureTokenDescription: "tommyGoldenRingDescription",

  group: DealerGroup.OWNER,
  role: DealerRole.REGULAR,

  oddsProfile: TOMMY_PROFILE,

  objectiveType: ObjectiveType.INCREASE_BALANCE,

  objectiveValue: 1000,

  goldenCoinSettings: {
    enabled: false,
    baseChance: 0.0075,
    chanceMultiplier: 0,
    maximumGoldenCoins: 3,
  },

  gambleForMoreSettings: {
    enabled: true,
    triggerChance: 0.5,
  },

  skills: [
    {
      id: DealerSkillId.HARD_MULTIPLIER_RESET,
      name: "multiplierCollapseSkillName",
      description: "multiplierCollapseSkillDescription",
      icon: "/assets/main/icons/dealer_skill_icons/owners/tommy/multiplier_collapse.png",
    },

    {
      id: DealerSkillId.MIRROR,
      name: "mirrorSkillName",
      description: "mirrorSkillDescription",
      icon: "/assets/main/icons/dealer_skill_icons/owners/tommy/mirror.png",
      triggerChance: 0.05,
    },
  ],

  dealerDescription: "tommyDescription",

  saying: "tommySaying",
};
