import { DealerData } from "../../DealerData.ts";
import { ObjectiveType } from "../../../objectives/ObjectiveTypes.ts";
import { DealerGroup } from "../../DealerGroup.ts";
import { DealerRole } from "../../DealerRole.ts";
import { DealerSkillId } from "../../DealerSkill.ts";
import { ANDY_PROFILE } from "../../../probability/DealerOddsProfiles.ts";

export const ANDY_DATA: DealerData = {
  id: "andy",

  name: "Andy",

  title: "juniorDealer",

  avatarNormal: "/assets/main/icons/casino_staff_icons/andy_icon.png",

  avatarSmall: "/assets/main/icons/casino_staff_icons/andy_icon_small.png",

  avatarLocked: "/assets/main/icons/casino_staff_icons/locked_dealer_icon.png",

  signatureToken:
    "/assets/main/icons/signature_token_icons/junior_dealers/andy/andy_signature_token_icon.png",
  signatureTokenName: "andyCoffeeMug",
  signatureTokenDescription: "andyCoffeeMugDescription",

  group: DealerGroup.JUNIOR,
  role: DealerRole.REGULAR,

  oddsProfile: ANDY_PROFILE,

  objectiveType: ObjectiveType.WIN_BETS,

  objectiveValue: 20,

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
      id: DealerSkillId.BETTER_PAY_FOR_NOT_THE_SAME,
      name: "betterPayForNotTheSameSkillName",
      description: "betterPayForNotTheSameSkillDescription",
      icon: "/assets/main/icons/dealer_skill_icons/junior_dealers/andy/better_pay_for_not_the_same.png",
    },
  ],

  dealerDescription: "andyDescription",

  saying: "andySaying",
};
