import { DealerData } from "../../DealerData.ts";
import { ObjectiveType } from "../../../objectives/ObjectiveTypes.ts";
import { DealerGroup } from "../../DealerGroup.ts";
import { DealerRole } from "../../DealerRole.ts";
import { DealerSkillId } from "../../DealerSkill.ts";
import { VICTOR_PROFILE } from "../../../probability/DealerOddsProfiles.ts";

export const VICTOR_DATA: DealerData = {
  id: "victor",

  name: "Victor",

  title: "manager",

  avatarNormal: "/assets/main/icons/casino_staff_icons/victor_icon.png",

  avatarSmall: "/assets/main/icons/casino_staff_icons/victor_icon_small.png",

  avatarLocked: "/assets/main/icons/casino_staff_icons/locked_dealer_icon.png",

  signatureToken:
    "/assets/main/icons/signature_token_icons/managers/victor/victor_signature_token_icon.png",
  signatureTokenName: "victorStackOfCasinoChips",
  signatureTokenDescription: "victorStackOfCasinoChipsDescription",

  group: DealerGroup.MANAGER,
  role: DealerRole.REGULAR,

  oddsProfile: VICTOR_PROFILE,

  objectiveType: ObjectiveType.INCREASE_BALANCE,

  objectiveValue: 3500,

  goldenCoinSettings: {
    baseChance: 0.0075,
    chanceMultiplier: 1,
    maximumGoldenCoins: 3,
  },

  gambleForMoreSettings: {
    enabled: true,
    triggerChance: 0.5,
  },

  skills: [
    {
      id: DealerSkillId.HIGH_STAKES,
      name: "highStakesSkillName",
      description: "highStakesSkillDescription",
      icon: "/assets/main/icons/dealer_skill_icons/managers/victor/high_stakes.png",
    },
  ],

  dealerDescription: "victorDescription",

  saying: "victorSaying",
};
