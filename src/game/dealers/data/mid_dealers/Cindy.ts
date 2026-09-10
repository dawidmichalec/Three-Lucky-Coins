import { DealerData } from "../../DealerData.ts";
import { ObjectiveType } from "../../../objectives/ObjectiveTypes.ts";
import { DealerGroup } from "../../DealerGroup.ts";
import { DealerRole } from "../../DealerRole.ts";
import { DealerSkillId } from "../../DealerSkill.ts";
import { CINDY_PROFILE } from "../../../probability/DealerOddsProfiles.ts";

export const CINDY_DATA: DealerData = {
  id: "cindy",

  name: "Cindy",

  title: "midDealer",

  avatarNormal: "/assets/main/icons/casino_staff_icons/cindy_icon.png",

  avatarSmall: "/assets/main/icons/casino_staff_icons/cindy_icon_small.png",

  avatarLocked: "/assets/main/icons/casino_staff_icons/locked_dealer_icon.png",

  signatureToken:
    "/assets/main/icons/signature_token_icons/mid_dealers/cindy/cindy_signature_token_icon.png",
  signatureTokenName: "cindyKeychain",
  signatureTokenDescription: "cindyKeychainDescription",

  group: DealerGroup.MID,
  role: DealerRole.REGULAR,

  oddsProfile: CINDY_PROFILE,

  objectiveType: ObjectiveType.WIN_BETS,

  objectiveValue: 25,

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
      id: DealerSkillId.MILESTONE_BONUS,
      name: "milestoneBonusSkillName",
      description: "milestoneBonusSkillDescription",
      icon: "/assets/main/icons/dealer_skill_icons/mid_dealers/cindy/milestone_bonus.png",
    },
  ],

  dealerDescription: "cindyDescription",

  saying: "cindySaying",
};
