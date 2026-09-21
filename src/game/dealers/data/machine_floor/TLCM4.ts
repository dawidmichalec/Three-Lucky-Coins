import { DealerData } from "../../DealerData.ts";
import { ObjectiveType } from "../../../objectives/ObjectiveTypes.ts";
import { DealerGroup } from "../../DealerGroup.ts";
import { DealerRole } from "../../DealerRole.ts";
import { DealerSkillId } from "../../DealerSkill.ts";
import { TLCM4_PROFILE } from "../../../probability/DealerOddsProfiles.ts";

export const TLCM4_DATA: DealerData = {
  id: "tlcm-4",

  name: "TLCM-4",

  title: "machine",

  avatarNormal: "/assets/main/icons/casino_staff_icons/tlcm-4_icon.png",

  avatarSmall: "/assets/main/icons/casino_staff_icons/tlcm-4_icon_small.png",

  avatarLocked: "/assets/main/icons/casino_staff_icons/locked_dealer_icon.png",

  signatureToken:
    "/assets/main/icons/signature_token_icons/machine_floor/tlcm-4/tlcm-4_signature_token_icon.png",
  signatureTokenName: "tlcm4DeductionController",
  signatureTokenDescription: "tlcm4DeductionControllerDescription",

  group: DealerGroup.MACHINE_FLOOR,
  role: DealerRole.REGULAR,

  oddsProfile: TLCM4_PROFILE,

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
          id: DealerSkillId.BET_DEDUCTION_SYSTEM_MALFUNCTION,
          name: "betDeductionSystemMalfunctionSkillName",
          description: "betDeductionSystemMalfunctionSkillDescription",
          icon: "/assets/main/icons/dealer_skill_icons/machine_floor/tlcm-4/bet_deduction_system_malfunction.png",
      },
    ],

  dealerDescription: "tlcm4Description",

  saying: "machineSaying",
};
