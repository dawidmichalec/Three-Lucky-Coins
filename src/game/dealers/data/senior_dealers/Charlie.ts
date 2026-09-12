import { DealerData } from "../../DealerData.ts";
import { ObjectiveType } from "../../../objectives/ObjectiveTypes.ts";
import { DealerGroup } from "../../DealerGroup.ts";
import { DealerRole } from "../../DealerRole.ts";
import { DealerSkillId } from "../../DealerSkill.ts";
import { CHARLIE_PROFILE } from "../../../probability/DealerOddsProfiles.ts";

export const CHARLIE_DATA: DealerData = {
  id: "charlie",

  name: "Charlie",

  title: "seniorDealer",

  avatarNormal: "/assets/main/icons/casino_staff_icons/charlie_icon.png",

  avatarSmall: "/assets/main/icons/casino_staff_icons/charlie_icon_small.png",

  avatarLocked: "/assets/main/icons/casino_staff_icons/locked_dealer_icon.png",

  signatureToken:
    "/assets/main/icons/signature_token_icons/senior_dealers/charlie/charlie_signature_token_icon.png",
  signatureTokenName: "charlieFidgetRing",
  signatureTokenDescription: "charlieFidgetRingDescription",

  group: DealerGroup.SENIOR,
  role: DealerRole.REGULAR,

  oddsProfile: CHARLIE_PROFILE,

  objectiveType: ObjectiveType.INCREASE_BALANCE,

  objectiveValue: 1200,

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
      id: DealerSkillId.HABIT_BREAKER ,
      name: "habitBreakerSkillName",
      description: "habitBreakerSkillDescription",
      icon: "/assets/main/icons/dealer_skill_icons/senior_dealers/charlie/habit_breaker.png",
    },
  ],

  dealerDescription: "charlieDescription",

  saying: "charlieSaying",
};
