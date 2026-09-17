import { DealerData } from "../../DealerData.ts";
import { ObjectiveType } from "../../../objectives/ObjectiveTypes.ts";
import { DealerGroup } from "../../DealerGroup.ts";
import { DealerRole } from "../../DealerRole.ts";
import { DealerSkillId } from "../../DealerSkill.ts";
import { TLCM3_3_PROFILE } from "../../../probability/DealerOddsProfiles.ts";

export const TLCM3_3_DATA: DealerData = {
  id: "tlcm-3_3",

  name: "TLCM-3",

  title: "machine",

  avatarNormal: "/assets/main/icons/casino_staff_icons/tlcm-3_icon.png",

  avatarSmall: "/assets/main/icons/casino_staff_icons/tlcm-3_icon_small.png",

  avatarLocked: "/assets/main/icons/casino_staff_icons/locked_dealer_icon.png",

  signatureToken:
    "/assets/main/icons/signature_token_icons/machine_floor/tlcm-3/tlcm-3_signature_token_icon.png",
  signatureTokenName: "tlcm3BetMemoryModule",
  signatureTokenDescription: "tlcm3BetMemoryModuleDescription",

  group: DealerGroup.MACHINE_FLOOR,
  role: DealerRole.REGULAR,

  oddsProfile: TLCM3_3_PROFILE,

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
          id: DealerSkillId.DYNAMIC_BET_LOCK,
          name: "dynamicBetLockSkillName",
          description: "dynamicBetLockSkillDescription",
          icon: "/assets/main/icons/dealer_skill_icons/machine_floor/tlcm-3_3/dynamic_bet_lock.png",
      },
    ],

  dealerDescription: "tlcm3Description",

  saying: "machineSaying",
};
