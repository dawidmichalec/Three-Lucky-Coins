import { DealerData } from "../../DealerData.ts";
import { ObjectiveType } from "../../../objectives/ObjectiveTypes.ts";
import { DealerGroup } from "../../DealerGroup.ts";
import { DealerRole } from "../../DealerRole.ts";
import { DealerSkillId } from "../../DealerSkill.ts";
import { IVY_PROFILE } from "../../../probability/DealerOddsProfiles.ts";

export const IVY_DATA: DealerData = {
  id: "ivy",

  name: "Ivy",

  title: "seniorDealer",

  avatarNormal: "/assets/main/icons/casino_staff_icons/ivy_icon.png",

  avatarSmall: "/assets/main/icons/casino_staff_icons/ivy_icon_small.png",

  avatarLocked: "/assets/main/icons/casino_staff_icons/locked_dealer_icon.png",

  signatureToken:
    "/assets/main/icons/signature_token_icons/senior_dealers/ivy/ivy_signature_token_icon.png",
  signatureTokenName: "ivyHairpin",
  signatureTokenDescription: "ivyHairpinDescription",

  group: DealerGroup.SENIOR,
  role: DealerRole.SUPERVISOR,

  oddsProfile: IVY_PROFILE,

  objectiveType: ObjectiveType.INCREASE_BALANCE,

  objectiveValue: 1800,

  goldenCoinSettings: {
    baseChance: 0.0075,
    chanceMultiplier: 0.7,
    maximumGoldenCoins: 3,
  },

  gambleForMoreSettings: {
    enabled: true,
    triggerChance: 0.5,
  },

  skills: [
    {
      id: DealerSkillId.MY_WAY_OR_THE_HIGHWAY,
      name: "myWayOrTheHighwaySkillName",
      description: "myWayOrTheHighwaySkillDescription",
      icon: "/assets/main/icons/dealer_skill_icons/senior_dealers/ivy/my_way_or_the_highway.png",
    },
  ],

  dealerDescription: "ivyDescription",

  saying: "ivySaying",
};
