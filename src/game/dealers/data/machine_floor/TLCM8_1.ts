import { DealerData } from "../../DealerData.ts";
import { ObjectiveType } from "../../../objectives/ObjectiveTypes.ts";
import { DealerGroup } from "../../DealerGroup.ts";
import { DealerRole } from "../../DealerRole.ts";
import { DealerSkillId } from "../../DealerSkill.ts";
import { TLCM8_1_PROFILE } from "../../../probability/DealerOddsProfiles.ts";

export const TLCM8_1_DATA: DealerData = {
  id: "tlcm-8_1",

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

  oddsProfile: TLCM8_1_PROFILE,

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
          id: DealerSkillId.MULTIPLIER_SYSTEM_MALFUNCTION,
          name: "multiplierSystemMalfunctionSkillName",
          description: "multiplierSystemMalfunctionSkillDescription",
          icon: "/assets/main/icons/dealer_skill_icons/machine_floor/tlcm-8_1/multiplier_system_malfunction.png",
      },
    ],

  dealerDescription: "tlcm8Description",

  saying: "machineSaying",
};
