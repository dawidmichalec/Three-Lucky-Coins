import { DealerData } from "../../DealerData.ts";
import { ObjectiveType } from "../../../objectives/ObjectiveTypes.ts";
import { DealerGroup } from "../../DealerGroup.ts";
import { DealerRole } from "../../DealerRole.ts";
import { DealerSkillId } from "../../DealerSkill.ts";
import { DAN_PROFILE } from "../../../probability/DealerOddsProfiles.ts";

export const DAN_DATA: DealerData = {
  id: "dan",

  name: "Dan",

  title: "manager",

  avatarNormal: "/assets/main/icons/casino_staff_icons/dan_icon.png",

  avatarSmall: "/assets/main/icons/casino_staff_icons/dan_icon_small.png",

  avatarLocked: "/assets/main/icons/casino_staff_icons/locked_dealer_icon.png",

  signatureToken:
    "/assets/main/icons/signature_token_icons/managers/dan/dan_signature_token_icon.png",
  signatureTokenName: "danOldWallet",
  signatureTokenDescription: "danOldWalletDescription",

  group: DealerGroup.MANAGER,
  role: DealerRole.REGULAR,

  oddsProfile: DAN_PROFILE,

  objectiveType: ObjectiveType.INCREASE_BALANCE,

  objectiveValue: 2500,

  goldenCoinSettings: {
    enabled: false,
    baseChance: 0.015,
    chanceMultiplier: 0,
    maximumGoldenCoins: 0,
  },

  gambleForMoreSettings: {
    enabled: true,
    triggerChance: 0.5,
  },

  skills: [
    {
      id: DealerSkillId.THE_HOUSE_ALWAYS_WINS,
      name: "theHouseAlwaysWinsSkillName",
      description: "theHouseAlwaysWinsSkillDescription",
      icon: "/assets/main/icons/dealer_skill_icons/managers/dan/the_house_always_wins.png",
    },
  ],

  dealerDescription: "danDescription",

  saying: "danSaying",
};
