import { DealerData } from "../../DealerData.ts";
import { ObjectiveType } from "../../../objectives/ObjectiveTypes.ts";
import { DealerGroup } from "../../DealerGroup.ts";
import { DealerRole } from "../../DealerRole.ts";
import { DealerSkillId } from "../../DealerSkill.ts";
import { TLCM1_PROFILE } from "../../../probability/DealerOddsProfiles.ts";

export const TLCM1_DATA: DealerData = {
  id: "tlcm-1",

  name: "TLCM-1",

  title: "machine",

  avatarNormal: "/assets/main/icons/casino_staff_icons/tlcm-1_icon.png",

  avatarSmall: "/assets/main/icons/casino_staff_icons/tlcm-1_icon_small.png",

  avatarLocked: "/assets/main/icons/casino_staff_icons/locked_dealer_icon.png",

  signatureToken:
    "/assets/main/icons/signature_token_icons/machine_floor/tlcm-1/tlcm-1_signature_token_icon.png",
  signatureTokenName: "tlcm1ControlBoard",
  signatureTokenDescription: "tlcm1ControlBoardDescription",

  group: DealerGroup.MACHINE_FLOOR,
  role: DealerRole.REGULAR,

  oddsProfile: TLCM1_PROFILE,

  objectiveType: ObjectiveType.INCREASE_BALANCE,

  objectiveValue: 2000,

  goldenCoinSettings: {
    enabled: false,
    baseChance: 0.015,
    chanceMultiplier: 0,
    maximumGoldenCoins: 0,
  },

  gambleForMoreSettings: {
    enabled: true,
    triggerChance: 0.5,
  },

  skills: [
    {
        id: DealerSkillId.GOLDEN_COINS_NOT_SUPPORTED,
        name: "goldenCoinsNotSupportedSkillName",
        description: "goldenCoinsNotSupportedSkillDescription",
        icon: "/assets/main/icons/dealer_skill_icons/machine_floor/tlcm-1/golden_coins_not_supported.png",
    },
  ],

  dealerDescription: "tlcm1Description",

  saying: "machineSaying",
};
