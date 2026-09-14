import { DealerData } from "../../DealerData.ts";
import { ObjectiveType } from "../../../objectives/ObjectiveTypes.ts";
import { DealerGroup } from "../../DealerGroup.ts";
import { DealerRole } from "../../DealerRole.ts";
import { DealerSkillId } from "../../DealerSkill.ts";
import { PAULIE_PROFILE } from "../../../probability/DealerOddsProfiles.ts";

export const PAULIE_DATA: DealerData = {
  id: "paulie",

  name: "Paulie",

  title: "seniorDealer",

  avatarNormal: "/assets/main/icons/casino_staff_icons/paulie_icon.png",

  avatarSmall: "/assets/main/icons/casino_staff_icons/paulie_icon_small.png",

  avatarLocked: "/assets/main/icons/casino_staff_icons/locked_dealer_icon.png",

  signatureToken:
    "/assets/main/icons/signature_token_icons/senior_dealers/paulie/paulie_signature_token_icon.png",
  signatureTokenName: "paulieVintageDice",
  signatureTokenDescription: "paulieVintageDiceDescription",

  group: DealerGroup.SENIOR,
  role: DealerRole.REGULAR,

  oddsProfile: PAULIE_PROFILE,

  objectiveType: ObjectiveType.WIN_GAMBLE_FOR_MORE,

  objectiveValue: 20,

  goldenCoinSettings: {
    baseChance: 0.0075,
    chanceMultiplier: 0.7,
    maximumGoldenCoins: 3,
  },

  gambleForMoreSettings: {
    enabled: true,
    triggerChance: 0.5,
  },

  skills: [
    {
      id: DealerSkillId.FORCED_RANDOM_TOSS,
      name: "forcedRandomTossSkillName",
      description: "forcedRandomTossSkillDescription",
      icon: "/assets/main/icons/dealer_skill_icons/senior_dealers/paulie/forced_random_toss.png",
    },
  ],

  dealerDescription: "paulieDescription",

  saying: "paulieSaying",
};
