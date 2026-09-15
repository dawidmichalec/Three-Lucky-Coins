import { DealerData } from "../../DealerData.ts";
import { ObjectiveType } from "../../../objectives/ObjectiveTypes.ts";
import { DealerGroup } from "../../DealerGroup.ts";
import { DealerRole } from "../../DealerRole.ts";
import { DealerSkillId } from "../../DealerSkill.ts";
import { JACK_PROFILE } from "../../../probability/DealerOddsProfiles.ts";

export const JACK_DATA: DealerData = {
  id: "jack",

  name: "Jack",

  title: "seniorDealer",

  avatarNormal: "/assets/main/icons/casino_staff_icons/jack_icon.png",

  avatarSmall: "/assets/main/icons/casino_staff_icons/jack_icon_small.png",

  avatarLocked: "/assets/main/icons/casino_staff_icons/locked_dealer_icon.png",

  signatureToken:
    "/assets/main/icons/signature_token_icons/senior_dealers/jack/jack_signature_token_icon.png",
  signatureTokenName: "jackCufflink",
  signatureTokenDescription: "jackCufflinkDescription",

  group: DealerGroup.SENIOR,
  role: DealerRole.REGULAR,

  oddsProfile: JACK_PROFILE,

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
      id: DealerSkillId.HEADS_CURSE ,
      name: "headsCurseSkillName",
      description: "headsCurseSkillDescription",
      icon: "/assets/main/icons/dealer_skill_icons/senior_dealers/jack/heads_curse.png",
    },
  ],

  dealerDescription: "jackDescription",

  saying: "jackSaying",
};
