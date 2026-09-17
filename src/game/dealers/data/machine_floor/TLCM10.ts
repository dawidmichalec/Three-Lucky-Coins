import { DealerData } from "../../DealerData.ts";
import { ObjectiveType } from "../../../objectives/ObjectiveTypes.ts";
import { DealerGroup } from "../../DealerGroup.ts";
import { DealerRole } from "../../DealerRole.ts";
import { TLCM10_PROFILE } from "../../../probability/DealerOddsProfiles.ts";

export const TLCM10_DATA: DealerData = {
  id: "tlcm-10",

  name: "TLCM-10",

  title: "machine",

  avatarNormal: "/assets/main/icons/casino_staff_icons/tlcm-10_icon.png",

  avatarSmall: "/assets/main/icons/casino_staff_icons/tlcm-10_icon_small.png",

  avatarLocked: "/assets/main/icons/casino_staff_icons/locked_dealer_icon.png",

  signatureToken:
    "/assets/main/icons/signature_token_icons/machine_floor/tlcm-10/tlcm-10_signature_token_icon.png",
  signatureTokenName: "certifiedTlcmChip",
  signatureTokenDescription: "certifiedTlcmChipDescription",

  group: DealerGroup.MACHINE_FLOOR,
  role: DealerRole.REGULAR,

  oddsProfile: TLCM10_PROFILE,

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

  skills: [],

  dealerDescription: "tlcm10Description",

  saying: "machineSaying",
};
