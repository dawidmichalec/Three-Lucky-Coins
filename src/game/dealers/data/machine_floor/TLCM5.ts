import { DealerData } from "../../DealerData.ts";
import { ObjectiveType } from "../../../objectives/ObjectiveTypes.ts";
import { DealerGroup } from "../../DealerGroup.ts";
import { DealerRole } from "../../DealerRole.ts";
import { DealerSkillId } from "../../DealerSkill.ts";
import { TLCM5_PROFILE } from "../../../probability/DealerOddsProfiles.ts";

export const TLCM5_DATA: DealerData = {
  id: "tlcm-5",

  name: "TLCM-5",

  title: "machine",

  avatarNormal: "/assets/main/icons/casino_staff_icons/tlcm-5_icon.png",

  avatarSmall: "/assets/main/icons/casino_staff_icons/tlcm-5_icon_small.png",

  avatarLocked: "/assets/main/icons/casino_staff_icons/locked_dealer_icon.png",

  signatureToken:
    "/assets/main/icons/signature_token_icons/machine_floor/tlcm-5/tlcm-5_signature_token_icon.png",
  signatureTokenName: "tlcm5TossMotor",
  signatureTokenDescription: "tlcm5TossMotorDescription",

  group: DealerGroup.MACHINE_FLOOR,
  role: DealerRole.REGULAR,

  oddsProfile: TLCM5_PROFILE,

  objectiveType: ObjectiveType.INCREASE_BALANCE,

  objectiveValue: 2000,

  goldenCoinSettings: {
    baseChance: 0.015,
    chanceMultiplier: 1,
    maximumGoldenCoins: 3,
  },

  gambleForMoreSettings: {
    enabled: true,
    triggerChance: 0.8,
  },

  skills: [
      {
          id: DealerSkillId.PROLONGED_TOSS_ANIMATION,
          name: "prolongedTossAnimationSkillName",
          description: "prolongedTossAnimationSkillDescription",
          icon: "/assets/main/icons/dealer_skill_icons/machine_floor/tlcm-5/prolonged_toss_animation.png",
      },
    ],

  dealerDescription: "tlcm5Description",

  saying: "machineSaying",
};
