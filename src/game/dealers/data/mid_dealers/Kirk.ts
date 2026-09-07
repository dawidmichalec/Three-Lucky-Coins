import { DealerData } from "../../DealerData.ts";
import { ObjectiveType } from "../../../objectives/ObjectiveTypes.ts";
import { DealerGroup } from "../../DealerGroup.ts";
import { DealerRole } from "../../DealerRole.ts";
import { DealerSkillId } from "../../DealerSkill.ts";
import { KIRK_PROFILE } from "../../../probability/DealerOddsProfiles.ts";

export const KIRK_DATA: DealerData = {
  id: "kirk",

  name: "Kirk",

  title: "midDealer",

  avatarNormal: "/assets/main/icons/casino_staff_icons/kirk_icon.png",

  avatarSmall: "/assets/main/icons/casino_staff_icons/kirk_icon_small.png",

  avatarLocked: "/assets/main/icons/casino_staff_icons/locked_dealer_icon.png",

  signatureToken:
    "/assets/main/icons/signature_token_icons/mid_dealers/mike/mike_signature_token_icon.png",
  signatureTokenName: "kirkWristwatch",
  signatureTokenDescription: "kirkWristwatchDescription",

  group: DealerGroup.MID,
  role: DealerRole.REGULAR,

  oddsProfile: KIRK_PROFILE,

  objectiveType: ObjectiveType.WIN_BETS,

  objectiveValue: 15,

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
      id: DealerSkillId.NO_DUPLICATES,
      name: "noDuplicatesSkillName",
      description: "noDuplicatesSkillDescription",
      icon: "/assets/main/icons/dealer_skill_icons/mid_dealers/kirk/no_duplicates.png",
    },
  ],

  dealerDescription: "kirkDescription",

  saying: "kirkSaying",
};
