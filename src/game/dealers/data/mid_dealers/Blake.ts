import { DealerData } from "../../DealerData.ts";
import { ObjectiveType } from "../../../objectives/ObjectiveTypes.ts";
import { DealerGroup } from "../../DealerGroup.ts";
import { DealerRole } from "../../DealerRole.ts";
import { DealerSkillId } from "../../DealerSkill.ts";
import { BLAKE_PROFILE } from "../../../probability/DealerOddsProfiles.ts";

export const BLAKE_DATA: DealerData = {
  id: "blake",

  name: "Blake",

  title: "midDealer",

  avatarNormal: "/assets/main/icons/casino_staff_icons/blake_icon.png",

  avatarSmall: "/assets/main/icons/casino_staff_icons/blake_icon_small.png",

  avatarLocked: "/assets/main/icons/casino_staff_icons/locked_dealer_icon.png",

  signatureToken:
    "/assets/main/icons/signature_token_icons/mid_dealers/blake/blake_signature_token_icon.png",
  signatureTokenName: "blakeNotebook",
  signatureTokenDescription: "blakeNotebookDescription",

  group: DealerGroup.MID,
  role: DealerRole.REGULAR,

  oddsProfile: BLAKE_PROFILE,

  objectiveType: ObjectiveType.INCREASE_BALANCE,

  objectiveValue: 800,

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
      id: DealerSkillId.TIME_IS_MONEY,
      name: "timeIsMoneySkillName",
      description: "timeIsMoneySkillDescription",
      icon: "/assets/main/icons/dealer_skill_icons/mid_dealers/blake/time_is_money.png",
      timeLimit: 10
    },
  ],

  dealerDescription: "blakeDescription",

  saying: "blakeSaying",
};
