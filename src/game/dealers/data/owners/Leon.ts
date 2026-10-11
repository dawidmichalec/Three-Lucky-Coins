import { DealerData } from "../../DealerData.ts";
import { ObjectiveType } from "../../../objectives/ObjectiveTypes.ts";
import { DealerGroup } from "../../DealerGroup.ts";
import { DealerRole } from "../../DealerRole.ts";
import { DealerSkillId } from "../../DealerSkill.ts";
import { LEON_PROFILE } from "../../../probability/DealerOddsProfiles.ts";

export const LEON_DATA: DealerData = {
  id: "leon",

  name: "Leon",

  title: "owner",

  avatarNormal: "/assets/main/icons/casino_staff_icons/leon_icon.png",

  avatarSmall: "/assets/main/icons/casino_staff_icons/leon_icon_small.png",

  avatarLocked: "/assets/main/icons/casino_staff_icons/locked_dealer_icon.png",

  signatureToken:
    "/assets/main/icons/signature_token_icons/owners/leon/leon_signature_token_icon.png",
  signatureTokenName: "leonPipe",
  signatureTokenDescription: "leonPipeDescription",

  group: DealerGroup.OWNER,
  role: DealerRole.REGULAR,

  oddsProfile: LEON_PROFILE,

  objectiveType: ObjectiveType.INCREASE_BALANCE,

  objectiveValue: 130,

  goldenCoinSettings: {
    enabled: false,
    baseChance: 0.0075,
    chanceMultiplier: 0,
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
      icon: "/assets/main/icons/dealer_skill_icons/owners/leon/time_is_money_leon.png",
      timeLimit: 10,
    },

    {
      id: DealerSkillId.DEADLINE,
      name: "deadlineSkillName",
      description: "deadlineSkillDescription",
      icon: "/assets/main/icons/dealer_skill_icons/owners/leon/deadline.png",
    },
  ],

  dealerDescription: "leonDescription",

  saying: "leonSaying",
};
