import { DealerData } from "../../DealerData.ts";
import { ObjectiveType } from "../../../objectives/ObjectiveTypes.ts";
import { DealerGroup } from "../../DealerGroup.ts";
import { DealerRole } from "../../DealerRole.ts";
import { DealerSkillId } from "../../DealerSkill.ts";
import { JOHNNY_PROFILE } from "../../../probability/DealerOddsProfiles.ts";

export const JOHNNY_DATA: DealerData = {
  id: "johnny",

  name: "Johnny",

  title: "juniorDealer",

  avatarNormal: "/assets/main/icons/casino_staff_icons/johnny_icon.png",

  avatarSmall: "/assets/main/icons/casino_staff_icons/johnny_icon_small.png",

  avatarLocked: "/assets/main/icons/casino_staff_icons/locked_dealer_icon.png",

  signatureToken:
    "/assets/main/icons/signature_token_icons/junior_dealers/johnny/johnny_signature_token_icon.png",
  signatureTokenName: "johnnysSharkToothBracelet",
  signatureTokenDescription: "johnnysSharkToothBraceletDescription",

  group: DealerGroup.JUNIOR,
  role: DealerRole.REGULAR,

  oddsProfile: JOHNNY_PROFILE,

  objectiveType: ObjectiveType.INCREASE_BALANCE,

  objectiveValue: 350,

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
      id: DealerSkillId.ALMOST,
      name: "almostSkillName",
      description: "almostSkillDescription",
      icon: "/assets/main/icons/dealer_skill_icons/junior_dealers/johnny/almost.png",
      triggerChance: 1,
    },
  ],

  dealerDescription: "johnnyDescription",

  saying: "johnnySaying",
};
