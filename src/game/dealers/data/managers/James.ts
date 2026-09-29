import { DealerData } from "../../DealerData.ts";
import { ObjectiveType } from "../../../objectives/ObjectiveTypes.ts";
import { DealerGroup } from "../../DealerGroup.ts";
import { DealerRole } from "../../DealerRole.ts";
import { DealerSkillId } from "../../DealerSkill.ts";
import { JAMES_PROFILE } from "../../../probability/DealerOddsProfiles.ts";

export const JAMES_DATA: DealerData = {
  id: "james",

  name: "James",

  title: "manager",

  avatarNormal: "/assets/main/icons/casino_staff_icons/james_icon.png",

  avatarSmall: "/assets/main/icons/casino_staff_icons/james_icon_small.png",

  avatarLocked: "/assets/main/icons/casino_staff_icons/locked_dealer_icon.png",

  signatureToken:
    "/assets/main/icons/signature_token_icons/managers/james/james_signature_token_icon.png",
  signatureTokenName: "jamesOldPhotograph",
  signatureTokenDescription: "jamesOldPhotographDescription",

  group: DealerGroup.MANAGER,
  role: DealerRole.REGULAR,

  oddsProfile: JAMES_PROFILE,

  objectiveType: ObjectiveType.INCREASE_BALANCE,

  objectiveValue: 2800,

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
      id: DealerSkillId.TIME_IS_UP ,
      name: "timeIsUpSkillName",
      description: "timeIsUpSkillDescription",
      icon: "/assets/main/icons/dealer_skill_icons/managers/james/time_is_up.png",
      timeLimit: 5,
    },
  ],

  dealerDescription: "jamesDescription",

  saying: "jamesSaying",
};
