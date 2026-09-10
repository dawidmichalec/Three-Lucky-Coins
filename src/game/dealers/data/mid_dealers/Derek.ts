import { DealerData } from "../../DealerData.ts";
import { ObjectiveType } from "../../../objectives/ObjectiveTypes.ts";
import { DealerGroup } from "../../DealerGroup.ts";
import { DealerRole } from "../../DealerRole.ts";
import { DealerSkillId } from "../../DealerSkill.ts";
import { DEREK_PROFILE } from "../../../probability/DealerOddsProfiles.ts";

export const DEREK_DATA: DealerData = {
  id: "derek",

  name: "Derek",

  title: "midDealer",

  avatarNormal: "/assets/main/icons/casino_staff_icons/derek_icon.png",

  avatarSmall: "/assets/main/icons/casino_staff_icons/derek_icon_small.png",

  avatarLocked: "/assets/main/icons/casino_staff_icons/locked_dealer_icon.png",

  signatureToken:
    "/assets/main/icons/signature_token_icons/mid_dealers/derek/derek_signature_token_icon.png",
  signatureTokenName: "derekDeckOfCards",
  signatureTokenDescription: "derekDeckOfCardsDescription",

  group: DealerGroup.MID,
  role: DealerRole.REGULAR,

  oddsProfile: DEREK_PROFILE,

  objectiveType: ObjectiveType.INCREASE_BALANCE,

  objectiveValue: 1000,

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
      id: DealerSkillId.VARIETY_PAYS,
      name: "varietyPaysSkillName",
      description: "varietyPaysSkillDescription",
      icon: "/assets/main/icons/dealer_skill_icons/mid_dealers/derek/variety_pays.png",
    },
  ],

  dealerDescription: "derekDescription",

  saying: "derekSaying",
};
