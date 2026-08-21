import { DealerData } from "../../DealerData.ts";
import { ObjectiveType } from "../../../objectives/ObjectiveTypes.ts";
import { DealerGroup } from "../../DealerGroup.ts";
import { DealerRole } from "../../DealerRole.ts";
import { MELANIE_PROFILE } from "../../../probability/DealerOddsProfiles.ts";

export const MELANIE_DATA: DealerData = {
  id: "melanie",

  name: "Melanie",

  title: "juniorSupervisor",

  avatarNormal: "/assets/main/icons/casino_staff_icons/melanie_icon.png",

  avatarSmall: "/assets/main/icons/casino_staff_icons/melanie_icon_small.png",

  avatarLocked: "/assets/main/icons/casino_staff_icons/locked_dealer_icon.png",

  signatureToken:
    "/assets/main/icons/signature_token_icons/junior_dealers/melanie/melanie_signature_token_icon.png",
  signatureTokenName: "melanieReadingGlasses",
  signatureTokenDescription: "melanieReadingGlassesDescription",

  group: DealerGroup.JUNIOR,
  role: DealerRole.SUPERVISOR,

  oddsProfile: MELANIE_PROFILE,

  objectiveType: ObjectiveType.INCREASE_BALANCE,

  objectiveValue: 300,

  goldenCoinSettings: {
    baseChance: 0.0075,
    chanceMultiplier: 1,
    maximumGoldenCoins: 1,
  },

  gambleForMoreSettings: {
    enabled: true,
    triggerChance: 0.5,
  },

  skills: [],

  dealerDescription: "melanieDescription",

  saying: "melanieSaying",
};
