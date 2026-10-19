import { DealerData } from "../../DealerData.ts";
import { ObjectiveType } from "../../../objectives/ObjectiveTypes.ts";
import { DealerGroup } from "../../DealerGroup.ts";
import { DealerRole } from "../../DealerRole.ts";
import { DealerSkillId } from "../../DealerSkill.ts";
import { THE_HOUSE_PROFILE_PHASE_1 } from "../../../probability/DealerOddsProfiles.ts";

export const THE_HOUSE_DATA: DealerData = {
  id: "the_house",

  name: "The House",

  title: "casino",

  avatarNormal: "/assets/main/icons/casino_staff_icons/the_house_icon.png",

  avatarSmall: "/assets/main/icons/casino_staff_icons/the_house_icon_small.png",

  avatarLocked: "/assets/main/icons/casino_staff_icons/locked_dealer_icon.png",

  signatureToken:
    "/assets/main/icons/signature_token_icons/the_house/the_house/the_house_signature_token_icon.png",
  signatureTokenName: "theHouseBrokenNeon",
  signatureTokenDescription: "theHouseBrokenNeonDescription",

  group: DealerGroup.THE_HOUSE,
  role: DealerRole.REGULAR,

  oddsProfile: THE_HOUSE_PROFILE_PHASE_1,

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
      id: DealerSkillId.CASINO_ARSENAL,
      name: "casinoArsenalSkillName",
      description: "casinoArsenalSkillDescription",
    },
  ],

  dealerDescription: "theHouseDescription",

  saying: "theHouseSaying",
};
