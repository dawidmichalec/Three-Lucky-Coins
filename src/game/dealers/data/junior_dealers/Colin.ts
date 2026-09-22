import { DealerData } from "../../DealerData.ts";
import { ObjectiveType } from "../../../objectives/ObjectiveTypes.ts";
import { DealerGroup } from "../../DealerGroup.ts";
import { DealerRole } from "../../DealerRole.ts";
import { COLIN_PROFILE } from "../../../probability/DealerOddsProfiles.ts";

export const COLIN_DATA: DealerData = {
  id: "colin",

  name: "Colin",

  title: "juniorDealer",

  avatarNormal: "/assets/main/icons/casino_staff_icons/colin_icon.png",

  avatarSmall: "/assets/main/icons/casino_staff_icons/colin_icon_small.png",

  avatarLocked: "/assets/main/icons/casino_staff_icons/locked_dealer_icon.png",

  signatureToken:
    "/assets/main/icons/signature_token_icons/junior_dealers/colin/colin_signature_token_icon.png",
  signatureTokenName: "colinHeadphones",
  signatureTokenDescription: "colinHeadphonesDescription",

  group: DealerGroup.JUNIOR,
  role: DealerRole.REGULAR,

  oddsProfile: COLIN_PROFILE,

  objectiveType: ObjectiveType.COLLECT_GOLDEN_COINS,

  objectiveValue: 2,

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

  dealerDescription: "colinDescription",

  saying: "colinSaying",
};
