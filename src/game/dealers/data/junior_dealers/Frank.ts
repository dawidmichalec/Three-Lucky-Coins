import { DealerData } from "../../DealerData.ts";
import { ObjectiveType } from "../../../objectives/ObjectiveTypes.ts";
import { DealerGroup } from "../../DealerGroup.ts";
import { DealerRole } from "../../DealerRole.ts";
import { FRANK_PROFILE } from "../../../probability/DealerOddsProfiles.ts";

export const FRANK_DATA: DealerData = {
  id: "frank",

  name: "Frank",

  title: "juniorDealer",

  avatarNormal: "/assets/main/icons/casino_staff_icons/frank_icon.png",

  avatarSmall: "/assets/main/icons/casino_staff_icons/frank_icon_small.png",

  avatarLocked: "/assets/main/icons/casino_staff_icons/locked_dealer_icon.png",

  signatureToken:
    "/assets/main/icons/signature_token_icons/junior_dealers/frank/frank_signature_token_icon.png",
  signatureTokenName: "frankPokerChip",
  signatureTokenDescription: "frankPokerChipDescription",

  group: DealerGroup.JUNIOR,
  role: DealerRole.REGULAR,

  oddsProfile: FRANK_PROFILE,

  objectiveType: ObjectiveType.WIN_GAMBLE_FOR_MORE,

  objectiveValue: 5,

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

  dealerDescription: "frankDescription",

  saying: "frankSaying",
};
