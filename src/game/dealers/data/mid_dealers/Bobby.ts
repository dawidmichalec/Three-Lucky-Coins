import { DealerData } from "../../DealerData.ts";
import { ObjectiveType } from "../../../objectives/ObjectiveTypes.ts";
import { DealerGroup } from "../../DealerGroup.ts";
import { DealerRole } from "../../DealerRole.ts";
import { DealerSkillId } from "../../DealerSkill.ts";
import { BOBBY_PROFILE } from "../../../probability/DealerOddsProfiles.ts";

export const BOBBY_DATA: DealerData = {
  id: "bobby",

  name: "Bobby",

  title: "midDealer",

  avatarNormal: "/assets/main/icons/casino_staff_icons/bobby_icon.png",

  avatarSmall: "/assets/main/icons/casino_staff_icons/bobby_icon_small.png",

  avatarLocked: "/assets/main/icons/casino_staff_icons/locked_dealer_icon.png",

  signatureToken:
    "/assets/main/icons/signature_token_icons/mid_dealers/bobby/bobby_signature_token_icon.png",
  signatureTokenName: "bobbysGoldChain",
  signatureTokenDescription: "bobbysGoldChainDescription",

  group: DealerGroup.MID,
  role: DealerRole.REGULAR,

  oddsProfile: BOBBY_PROFILE,

  objectiveType: ObjectiveType.INCREASE_BALANCE,

  objectiveValue: 700,

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
      id: DealerSkillId.CLOSE_ENOUGH,
      name: "closeEnoughSkillName",
      description: "closeEnoughSkillDescription",
      icon: "/assets/main/icons/dealer_skill_icons/mid_dealers/bobby/close_enough.png",
      triggerChance: 1,
    },
  ],

  dealerDescription: "bobbyDescription",

  saying: "bobbySaying",
};
