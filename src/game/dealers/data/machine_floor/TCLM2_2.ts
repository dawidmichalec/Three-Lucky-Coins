import { DealerData } from "../../DealerData.ts";
import { ObjectiveType } from "../../../objectives/ObjectiveTypes.ts";
import { DealerGroup } from "../../DealerGroup.ts";
import { DealerRole } from "../../DealerRole.ts";
import { DealerSkillId } from "../../DealerSkill.ts";
import { TLCM2_2_PROFILE } from "../../../probability/DealerOddsProfiles.ts";

export const TLCM2_2_DATA: DealerData = {
  id: "tlcm-2_2",

  name: "TLCM-2",

  title: "machine",

  avatarNormal: "/assets/main/icons/casino_staff_icons/tlcm-2_icon.png",

  avatarSmall: "/assets/main/icons/casino_staff_icons/tlcm-2_icon_small.png",

  avatarLocked: "/assets/main/icons/casino_staff_icons/locked_dealer_icon.png",

  signatureToken:
    "/assets/main/icons/signature_token_icons/machine_floor/tlcm-2/tlcm-2_signature_token_icon.png",
  signatureTokenName: "tlcm2BetControlModule",
  signatureTokenDescription: "tlcm2BetControlModuleDescription",

  group: DealerGroup.MACHINE_FLOOR,
  role: DealerRole.REGULAR,

  oddsProfile: TLCM2_2_PROFILE,

  objectiveType: ObjectiveType.COLLECT_GOLDEN_COINS,

  objectiveValue: 2,

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
          id: DealerSkillId.BET_INCREASE_LOCK,
          name: "betIncreaseLockSkillName",
          description: "betIncreaseLockSkillDescription",
          icon: "/assets/main/icons/dealer_skill_icons/machine_floor/tlcm-2_2/bet_increase_lock.png",
      },
    ],

  dealerDescription: "tlcm2Description",

  saying: "machineSaying",
};
