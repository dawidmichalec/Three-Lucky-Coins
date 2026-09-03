import { DealerData } from "../../DealerData";
import { DealerSkillId } from "../../DealerSkill";
import { ObjectiveType } from "../../../objectives/ObjectiveTypes";
import { DealerGroup } from "../../DealerGroup";
import { DealerRole } from "../../DealerRole";
import { ALEX_PROFILE } from "../../../probability/DealerOddsProfiles";

export const ALEX_DATA: DealerData = {
  id: "alex",

  name: "Alex",

  title: "midDealer",

  avatarNormal: "/assets/main/icons/casino_staff_icons/alex_icon.png",

  avatarSmall: "/assets/main/icons/casino_staff_icons/alex_icon_small.png",

  avatarLocked: "/assets/main/icons/casino_staff_icons/locked_dealer_icon.png",

  signatureToken:
    "/assets/main/icons/signature_token_icons/mid_dealers/alex/alex_signature_token_icon.png",
  signatureTokenName: "alexBoxingGloves",
  signatureTokenDescription: "alexBoxingGlovesDescription",

  group: DealerGroup.MID,
  role: DealerRole.REGULAR,

  oddsProfile: ALEX_PROFILE,

  objectiveType: ObjectiveType.REACH_MULTIPLIER,

  objectiveValue: 8,

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
      id: DealerSkillId.MULTIPLIER_KNOCKOUT,

      name: "multiplierKnockoutSkillName",

      description: "multiplierKnockoutSkillDescription",

      icon: "/assets/main/icons/dealer_skill_icons/mid_dealers/alex/multiplier_knockout.png",

      triggerChance: 0.15,
    },
  ],

  dealerDescription: "alexDescription",

  saying: "alexSaying",
};