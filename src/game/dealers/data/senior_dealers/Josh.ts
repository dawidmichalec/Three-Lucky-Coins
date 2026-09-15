import { DealerData } from "../../DealerData.ts";
import { ObjectiveType } from "../../../objectives/ObjectiveTypes.ts";
import { DealerGroup } from "../../DealerGroup.ts";
import { DealerRole } from "../../DealerRole.ts";
import { DealerSkillId } from "../../DealerSkill.ts";
import { JOSH_PROFILE } from "../../../probability/DealerOddsProfiles.ts";

export const JOSH_DATA: DealerData = {
  id: "josh",

  name: "Josh",

  title: "seniorDealer",

  avatarNormal: "/assets/main/icons/casino_staff_icons/josh_icon.png",

  avatarSmall: "/assets/main/icons/casino_staff_icons/josh_icon_small.png",

  avatarLocked: "/assets/main/icons/casino_staff_icons/locked_dealer_icon.png",

  signatureToken:
    "/assets/main/icons/signature_token_icons/senior_dealers/josh/josh_signature_token_icon.png",
  signatureTokenName: "joshCufflink",
  signatureTokenDescription: "joshCufflinkDescription",

  group: DealerGroup.SENIOR,
  role: DealerRole.REGULAR,

  oddsProfile: JOSH_PROFILE,

  objectiveType: ObjectiveType.INCREASE_BALANCE,

  objectiveValue: 750,

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
      id: DealerSkillId.TAILS_CURSE ,
      name: "tailsCurseSkillName",
      description: "tailsCurseSkillDescription",
      icon: "/assets/main/icons/dealer_skill_icons/senior_dealers/josh/tails_curse.png",
    },
  ],

  dealerDescription: "joshDescription",

  saying: "joshSaying",
};
