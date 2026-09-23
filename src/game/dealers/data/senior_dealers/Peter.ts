import { DealerData } from "../../DealerData.ts";
import { ObjectiveType } from "../../../objectives/ObjectiveTypes.ts";
import { DealerGroup } from "../../DealerGroup.ts";
import { DealerRole } from "../../DealerRole.ts";
import { DealerSkillId } from "../../DealerSkill.ts";
import { PETER_PROFILE } from "../../../probability/DealerOddsProfiles.ts";

export const PETER_DATA: DealerData = {
  id: "peter",

  name: "Peter",

  title: "seniorDealer",

  avatarNormal: "/assets/main/icons/casino_staff_icons/peter_icon.png",

  avatarSmall: "/assets/main/icons/casino_staff_icons/peter_icon_small.png",

  avatarLocked: "/assets/main/icons/casino_staff_icons/locked_dealer_icon.png",

  signatureToken:
    "/assets/main/icons/signature_token_icons/senior_dealers/peter/peter_signature_token_icon.png",
  signatureTokenName: "peterWhiskeyBottle",
  signatureTokenDescription: "peterWhiskeyBottleDescription",

  group: DealerGroup.SENIOR,
  role: DealerRole.REGULAR,

  oddsProfile: PETER_PROFILE,

  objectiveType: ObjectiveType.WIN_BETS,

  objectiveValue: 35,

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
      id: DealerSkillId.BET_VALUE_MANIPULATION,
      name: "betValueManipulationSkillName",
      description: "betValueManipulationSkillDescription",
      icon: "/assets/main/icons/dealer_skill_icons/senior_dealers/peter/bet_value_manipulation.png",
    },
  ],

  dealerDescription: "peterDescription",

  saying: "peterSaying",
};
