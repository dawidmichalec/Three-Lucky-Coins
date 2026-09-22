import { DealerData } from "../../DealerData.ts";
import { ObjectiveType } from "../../../objectives/ObjectiveTypes.ts";
import { DealerGroup } from "../../DealerGroup.ts";
import { DealerRole } from "../../DealerRole.ts";
import { DealerSkillId } from "../../DealerSkill.ts";
import { TLCM6_2_PROFILE } from "../../../probability/DealerOddsProfiles.ts";

export const TLCM6_2_DATA: DealerData = {
  id: "tlcm-6_2",

  name: "TLCM-6",

  title: "machine",

  avatarNormal: "/assets/main/icons/casino_staff_icons/tlcm-6_icon.png",

  avatarSmall: "/assets/main/icons/casino_staff_icons/tlcm-6_icon_small.png",

  avatarLocked: "/assets/main/icons/casino_staff_icons/locked_dealer_icon.png",

  signatureToken:
    "/assets/main/icons/signature_token_icons/machine_floor/tlcm-7/tlcm-6_signature_token_icon.png",
  signatureTokenName: "tlcm6ProbabilityDisplayModule",
  signatureTokenDescription: "tlcm6ProbabilityDisplayModuleDescription",

  group: DealerGroup.MACHINE_FLOOR,
  role: DealerRole.REGULAR,

  oddsProfile: TLCM6_2_PROFILE,

  objectiveType: ObjectiveType.INCREASE_BALANCE,

  objectiveValue: 2000,

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
          id: DealerSkillId.BROKEN_PROBABILITY_DISPLAY,
          name: "brokenProbabilityDisplaySkillName",
          description: "brokenProbabilityDisplaySkillDescription",
          icon: "/assets/main/icons/dealer_skill_icons/machine_floor/tlcm-6_2/broken_probability_display.png",
      },
    ],

  dealerDescription: "tlcm6Description",

  saying: "machineSaying",
};
