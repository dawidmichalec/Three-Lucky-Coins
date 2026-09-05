import { DealerData } from "../../DealerData.ts";
import { ObjectiveType } from "../../../objectives/ObjectiveTypes.ts";
import { DealerGroup } from "../../DealerGroup.ts";
import { DealerRole } from "../../DealerRole.ts";
import { DealerSkillId } from "../../DealerSkill.ts";
import { MIKE_PROFILE } from "../../../probability/DealerOddsProfiles.ts";

export const MIKE_DATA: DealerData = {
  id: "mike",

  name: "Mike",

  title: "midDealer",

  avatarNormal: "/assets/main/icons/casino_staff_icons/mike_icon.png",

  avatarSmall: "/assets/main/icons/casino_staff_icons/mike_icon_small.png",

  avatarLocked: "/assets/main/icons/casino_staff_icons/locked_dealer_icon.png",

  signatureToken:
    "/assets/main/icons/signature_token_icons/mid_dealers/mike/mike_signature_token_icon.png",
  signatureTokenName: "mikeGummyBears",
  signatureTokenDescription: "mikeGummyBearsDescription",

  group: DealerGroup.MID,
  role: DealerRole.REGULAR,

  oddsProfile: MIKE_PROFILE,

  objectiveType: ObjectiveType.REACH_MULTIPLIER,

  objectiveValue: 11,

  goldenCoinSettings: {
    baseChance: 0.0075,
    chanceMultiplier: 1,
    maximumGoldenCoins: 3,
  },

  gambleForMoreSettings: {
    enabled: true,
    triggerChance: 0.3,
  },

  skills: [
    {
      id: DealerSkillId.NO_REPEATS,
      name: "noRepeatsSkillName",
      description: "noRepeatsSkillDescription",
      icon: "/assets/main/icons/dealer_skill_icons/mid_dealers/mike/no_repeats.png",
    },
  ],

  dealerDescription: "mikeDescription",

  saying: "mikeSaying",
};
