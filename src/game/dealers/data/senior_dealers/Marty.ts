import { DealerData } from "../../DealerData.ts";
import { ObjectiveType } from "../../../objectives/ObjectiveTypes.ts";
import { DealerGroup } from "../../DealerGroup.ts";
import { DealerRole } from "../../DealerRole.ts";
import { DealerSkillId } from "../../DealerSkill.ts";
import { MARTY_PROFILE } from "../../../probability/DealerOddsProfiles.ts";

export const MARTY_DATA: DealerData = {
  id: "marty",

  name: "Marty",

  title: "seniorDealer",

  avatarNormal: "/assets/main/icons/casino_staff_icons/marty_icon.png",

  avatarSmall: "/assets/main/icons/casino_staff_icons/marty_icon_small.png",

  avatarLocked: "/assets/main/icons/casino_staff_icons/locked_dealer_icon.png",

  signatureToken:
    "/assets/main/icons/signature_token_icons/senior_dealers/marty/marty_signature_token_icon.png",
  signatureTokenName: "martyOversizedBowTie",
  signatureTokenDescription: "martyOversizedBowTieDescription",

  group: DealerGroup.SENIOR,
  role: DealerRole.REGULAR,

  oddsProfile: MARTY_PROFILE,

  objectiveType: ObjectiveType.COLLECT_GOLDEN_COINS,

  objectiveValue: 2,

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
      id: DealerSkillId.ADDITIONAL_COIN_TOSS,
      name: "additionalCoinTossSkillName",
      description: "additionalCoinTossSkillDescription",
      icon: "/assets/main/icons/dealer_skill_icons/senior_dealers/marty/additional_coin_toss.png",
    },
  ],

  dealerDescription: "martyDescription",

  saying: "martySaying",
};
