import { DealerData } from "../../DealerData";
import { DealerSkillId } from "../../DealerSkill";
import { ObjectiveType } from "../../../objectives/ObjectiveTypes";
import { DealerGroup } from "../../DealerGroup";
import { DealerRole } from "../../DealerRole";
import { DARRYL_PROFILE } from "../../../probability/DealerOddsProfiles";

export const DARRYL_DATA: DealerData = {
  id: "darryl",

  name: "Darryl",

  title: "juniorDealer",

  avatarNormal: "/assets/main/icons/casino_staff_icons/darryl_icon.png",

  avatarSmall: "/assets/main/icons/casino_staff_icons/darryl_icon_small.png",

  avatarLocked: "/assets/main/icons/casino_staff_icons/locked_dealer_icon.png",

  signatureToken:
    "/assets/main/icons/signature_token_icons/junior_dealers/darryl/darryl_signature_token_icon.png",
  signatureTokenName: "darrylGoldenTurtle",
  signatureTokenDescription: "darrylGoldenTurtleDescription",

  group: DealerGroup.JUNIOR,
  role: DealerRole.REGULAR,

  oddsProfile: DARRYL_PROFILE,

  objectiveType: ObjectiveType.REACH_MULTIPLIER,

  objectiveValue: 4,

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
      id: DealerSkillId.DARRYL_SLOWER_MULTIPLIER_GROWTH,

      name: "darrylSlowerMultiplierGrowthSkillName",

      description: "darrylSlowerMultiplierGrowthSkillDescription",

      icon: "/assets/main/icons/dealer_skill_icons/junior_dealers/darryl/darryl_slower_multiplier_growth.png",

      streakGrowthModifier: 0.75,
    },
  ],

  dealerDescription: "darrylDescription",

  saying: "darrylSaying",
};
