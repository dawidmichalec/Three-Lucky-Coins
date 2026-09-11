import { DealerData } from "../../DealerData.ts";
import { ObjectiveType } from "../../../objectives/ObjectiveTypes.ts";
import { DealerGroup } from "../../DealerGroup.ts";
import { DealerRole } from "../../DealerRole.ts";
import { DealerSkillId } from "../../DealerSkill.ts";
import { GARY_PROFILE } from "../../../probability/DealerOddsProfiles.ts";

export const GARY_DATA: DealerData = {
  id: "gary",

  name: "Gary",

  title: "seniorDealer",

  avatarNormal: "/assets/main/icons/casino_staff_icons/gary_icon.png",

  avatarSmall: "/assets/main/icons/casino_staff_icons/gary_icon_small.png",

  avatarLocked: "/assets/main/icons/casino_staff_icons/locked_dealer_icon.png",

  signatureToken:
    "/assets/main/icons/signature_token_icons/senior_dealers/gary/gary_signature_token_icon.png",
  signatureTokenName: "garyCigarCutter",
  signatureTokenDescription: "garyCigarCutterDescription",

  group: DealerGroup.SENIOR,
  role: DealerRole.REGULAR,

  oddsProfile: GARY_PROFILE,

  objectiveType: ObjectiveType.WIN_BETS,

  objectiveValue: 25,

  goldenCoinSettings: {
    baseChance: 0.0075,
    chanceMultiplier: 0.5,
    maximumGoldenCoins: 3,
  },

  gambleForMoreSettings: {
    enabled: true,
    triggerChance: 0.7,
  },

  skills: [
    {
      id: DealerSkillId.HOUSE_CUT ,
      name: "houseCutSkillName",
      description: "houseCutSkillDescription",
      icon: "/assets/main/icons/dealer_skill_icons/senior_dealers/gary/house_cut.png",
    },
  ],

  dealerDescription: "garyDescription",

  saying: "garySaying",
};
