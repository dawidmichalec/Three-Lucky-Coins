import { DealerData } from "../../DealerData.ts";
import { ObjectiveType } from "../../../objectives/ObjectiveTypes.ts";
import { DealerGroup } from "../../DealerGroup.ts";
import { DealerRole } from "../../DealerRole.ts";
import { DealerSkillId } from "../../DealerSkill.ts";
import { TLCM9_PROFILE } from "../../../probability/DealerOddsProfiles.ts";

export const TLCM9_DATA: DealerData = {
  id: "tlcm-9",

  name: "TLCM-9",

  title: "machine",

  avatarNormal: "/assets/main/icons/casino_staff_icons/tlcm-9_icon.png",

  avatarSmall: "/assets/main/icons/casino_staff_icons/tlcm-9_icon_small.png",

  avatarLocked: "/assets/main/icons/casino_staff_icons/locked_dealer_icon.png",

  signatureToken:
    "/assets/main/icons/signature_token_icons/machine_floor/tlcm-9/tlcm-9_signature_token_icon.png",
  signatureTokenName: "tlcm9BalanceModule",
  signatureTokenDescription: "tlcm9BalanceModuleDescription",

  group: DealerGroup.MACHINE_FLOOR,
  role: DealerRole.REGULAR,

  oddsProfile: TLCM9_PROFILE,

  objectiveType: ObjectiveType.WIN_BETS,

  objectiveValue: 40,

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
          id: DealerSkillId.BALANCE_MODULE_MALFUNCTION,
          name: "balanceModuleMalfunctionSkillName",
          description: "balanceModuleMalfunctionSkillDescription",
          icon: "/assets/main/icons/dealer_skill_icons/machine_floor/tlcm-9/balance_module_malfunction.png",
      },
    ],

  dealerDescription: "tlcm9Description",

  saying: "machineSaying",
};
