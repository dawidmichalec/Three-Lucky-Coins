import { DealerData } from "../../DealerData";
import { DealerSkillId } from "../../DealerSkill";
import { ObjectiveType } from "../../../objectives/ObjectiveTypes";
import { DealerGroup } from "../../DealerGroup";
import { DealerRole } from "../../DealerRole";
import { ANTHONY_PROFILE } from "../../../probability/DealerOddsProfiles";

export const ANTHONY_DATA: DealerData = {
  id: "anthony",

  name: "Anthony",

  title: "midDealer",

  avatarNormal: "/assets/main/icons/casino_staff_icons/anthony_icon.png",

  avatarSmall: "/assets/main/icons/casino_staff_icons/anthony_icon_small.png",

  avatarLocked: "/assets/main/icons/casino_staff_icons/locked_dealer_icon.png",

  signatureToken:
    "/assets/main/icons/signature_token_icons/mid_dealers/anthony/anthony_signature_token_icon.png",
  signatureTokenName: "anthonySlotMachine",
  signatureTokenDescription: "anthonySlotMachineDescription",

  group: DealerGroup.MID,
  role: DealerRole.REGULAR,

  oddsProfile: ANTHONY_PROFILE,

  objectiveType: ObjectiveType.WIN_GAMBLE_FOR_MORE,

  objectiveValue: 2,

  goldenCoinSettings: {
    baseChance: 0.0075,
    chanceMultiplier: 0.75,
    maximumGoldenCoins: 3,
  },

  gambleForMoreSettings: {
    enabled: true,
    triggerChance: 0.5,
  },

  skills: [
    {
      id: DealerSkillId.MANDATORY_GAMBLE_FOR_MORE,

      name: "mandatoryGambleForMoreSkillName",

      description: "mandatoryGambleForMoreSkillDescription",

      icon: "/assets/main/icons/dealer_skill_icons/mid_dealers/anthony/mandatory_gamble_for_more.png",

    },
  ],

  dealerDescription: "anthonyDescription",

  saying: "anthonySaying",
};