import { DealerData } from "../../DealerData.ts";
import { ObjectiveType } from "../../../objectives/ObjectiveTypes.ts";
import { DealerGroup } from "../../DealerGroup.ts";
import { DealerRole } from "../../DealerRole.ts";
import { DEBRA_PROFILE } from "../../../probability/DealerOddsProfiles.ts";

export const DEBRA_DATA: DealerData = {
  id: "debra",

  name: "Debra",

  title: "juniorDealer",

  avatarNormal: "/assets/main/icons/casino_staff_icons/debra_icon.png",

  avatarSmall: "/assets/main/icons/casino_staff_icons/debra_icon_small.png",

  avatarLocked: "/assets/main/icons/casino_staff_icons/locked_dealer_icon.png",

  signatureToken:
    "/assets/main/icons/signature_token_icons/junior_dealers/debra/debra_signature_token_icon.png",
  signatureTokenName: "debraVolleyball",
  signatureTokenDescription: "debraVolleyballDescription",

  group: DealerGroup.JUNIOR,
  role: DealerRole.REGULAR,

  oddsProfile: DEBRA_PROFILE,

  objectiveType: ObjectiveType.COLLECT_GOLDEN_COINS,

  objectiveValue: 1,

  goldenCoinSettings: {
    baseChance: 0.015,
    chanceMultiplier: 1,
    maximumGoldenCoins: 3,
  },

  gambleForMoreSettings: {
    enabled: true,
    triggerChance: 0.5,
  },

  skills: [],

  dealerDescription: "debraDescription",

  saying: "debraSaying",
};
