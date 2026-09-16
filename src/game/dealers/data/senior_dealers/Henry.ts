import { DealerData } from "../../DealerData.ts";
import { ObjectiveType } from "../../../objectives/ObjectiveTypes.ts";
import { DealerGroup } from "../../DealerGroup.ts";
import { DealerRole } from "../../DealerRole.ts";
import { DealerSkillId } from "../../DealerSkill.ts";
import { HENRY_PROFILE } from "../../../probability/DealerOddsProfiles.ts";

export const HENRY_DATA: DealerData = {
  id: "henry",

  name: "Henry",

  title: "seniorDealer",

  avatarNormal: "/assets/main/icons/casino_staff_icons/henry_icon.png",

  avatarSmall: "/assets/main/icons/casino_staff_icons/henry_icon_small.png",

  avatarLocked: "/assets/main/icons/casino_staff_icons/locked_dealer_icon.png",

  signatureToken:
    "/assets/main/icons/signature_token_icons/senior_dealers/henry/henry_signature_token_icon.png",
  signatureTokenName: "henryPocketWatch",
  signatureTokenDescription: "henryPocketWatchDescription",

  group: DealerGroup.SENIOR,
  role: DealerRole.REGULAR,

  oddsProfile: HENRY_PROFILE,

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
      id: DealerSkillId.KEEP_IT_MOVING,
      name: "keepItMovingSkillName",
      description: "keepItMovingSkillDescription",
      icon: "/assets/main/icons/dealer_skill_icons/senior_dealers/henry/keep_it_moving.png",
    },
  ],

  dealerDescription: "henryDescription",

  saying: "henrySaying",
};
