import { DealerData } from "../../DealerData.ts";
import { ObjectiveType } from "../../../objectives/ObjectiveTypes.ts";
import { DealerGroup } from "../../DealerGroup.ts";
import { DealerRole } from "../../DealerRole.ts";
import { DealerSkillId } from "../../DealerSkill.ts";
import { TLCM7_2_PROFILE } from "../../../probability/DealerOddsProfiles.ts";

export const TLCM7_2_DATA: DealerData = {
  id: "tlcm-7_2",

  name: "TLCM-7",

  title: "machine",

  avatarNormal: "/assets/main/icons/casino_staff_icons/tlcm-7_icon.png",

  avatarSmall: "/assets/main/icons/casino_staff_icons/tlcm-7_icon_small.png",

  avatarLocked: "/assets/main/icons/casino_staff_icons/locked_dealer_icon.png",

  signatureToken:
    "/assets/main/icons/signature_token_icons/machine_floor/tlcm-7/tlcm-7_signature_token_icon.png",
  signatureTokenName: "tlcm7CombinationSelector",
  signatureTokenDescription: "tlcm7CombinationSelectorDescription",

  group: DealerGroup.MACHINE_FLOOR,
  role: DealerRole.REGULAR,

  oddsProfile: TLCM7_2_PROFILE,

  objectiveType: ObjectiveType.WIN_BETS,

  objectiveValue: 3,

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
          id: DealerSkillId.FIXED_COMBINATION_LOCK,
          name: "fixedCombinationLockSkillName",
          description: "fixedCombinationLockSkillDescription",
          icon: "/assets/main/icons/dealer_skill_icons/machine_floor/tlcm-7_2/fixed_combination_lock.png",
      },
    ],

  dealerDescription: "tlcm7Description",

  saying: "machineSaying",
};
