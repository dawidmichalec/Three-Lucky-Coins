import { DealerData } from "../../DealerData.ts";
import { ObjectiveType } from "../../../objectives/ObjectiveTypes.ts";
import { DealerGroup } from "../../DealerGroup.ts";
import { DealerRole } from "../../DealerRole.ts";
import { DealerSkillId } from "../../DealerSkill.ts";
import { TLCM8_2_PROFILE } from "../../../probability/DealerOddsProfiles.ts";

export const TLCM8_2_DATA: DealerData = {
  id: "tlcm-8_2",

  name: "TLCM-8",

  title: "machine",

  avatarNormal: "/assets/main/icons/casino_staff_icons/tlcm-8_icon.png",

  avatarSmall: "/assets/main/icons/casino_staff_icons/tlcm-8_icon_small.png",

  avatarLocked: "/assets/main/icons/casino_staff_icons/locked_dealer_icon.png",

  signatureToken:
    "/assets/main/icons/signature_token_icons/machine_floor/tlcm-8/tlcm-8_signature_token_icon.png",
  signatureTokenName: "tlcm8MultiplierProcessor",
  signatureTokenDescription: "tlcm8MultiplierProcessorDescription",

  group: DealerGroup.MACHINE_FLOOR,
  role: DealerRole.REGULAR,

  oddsProfile: TLCM8_2_PROFILE,

  objectiveType: ObjectiveType.REACH_MULTIPLIER,

  objectiveValue: 8,

  goldenCoinSettings: {
    baseChance: 0.015,
    chanceMultiplier: 1,
    maximumGoldenCoins: 3,
  },

  gambleForMoreSettings: {
    enabled: true,
    triggerChance: 0.5,
  },

  skills: [
      {
          id: DealerSkillId.HARD_MULTIPLIER_RESET,
          name: "hardMultiplierResetSkillName",
          description: "hardMultiplierResetSkillDescription",
          icon: "/assets/main/icons/dealer_skill_icons/machine_floor/tlcm-8_2/hard_multiplier_reset.png",
      },
    ],

  dealerDescription: "tlcm8Description",

  saying: "machineSaying",
};
