import { DealerData } from "../../DealerData.ts";
import { ObjectiveType } from "../../../objectives/ObjectiveTypes.ts";
import { DealerGroup } from "../../DealerGroup.ts";
import { DealerRole } from "../../DealerRole.ts";
import { DealerSkillId } from "../../DealerSkill.ts";
import { FINN_PROFILE } from "../../../probability/DealerOddsProfiles.ts";

export const FINN_DATA: DealerData = {
  id: "finn",

  name: "Finn",

  title: "seniorDealer",

  avatarNormal: "/assets/main/icons/casino_staff_icons/finn_icon.png",

  avatarSmall: "/assets/main/icons/casino_staff_icons/finn_icon_small.png",

  avatarLocked: "/assets/main/icons/casino_staff_icons/locked_dealer_icon.png",

  signatureToken:
    "/assets/main/icons/signature_token_icons/senior_dealers/finn/finn_signature_token_icon.png",
  signatureTokenName: "finnLighter",
  signatureTokenDescription: "finnLighterDescription",

  group: DealerGroup.SENIOR,
  role: DealerRole.REGULAR,

  oddsProfile: FINN_PROFILE,

  objectiveType: ObjectiveType.WIN_BETS,

  objectiveValue: 20,

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
      id: DealerSkillId.DELAYED_DECAY,
      name: "delayedDecaySkillName",
      description: "delayedDecaySkillDescription",
      icon: "/assets/main/icons/dealer_skill_icons/senior_dealers/finn/delayed_decay.png",
    },
  ],

  dealerDescription: "finnDescription",

  saying: "finnSaying",
};
