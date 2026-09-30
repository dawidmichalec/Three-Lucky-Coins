import { DealerData } from "../../DealerData.ts";
import { ObjectiveType } from "../../../objectives/ObjectiveTypes.ts";
import { DealerGroup } from "../../DealerGroup.ts";
import { DealerRole } from "../../DealerRole.ts";
import { DealerSkillId } from "../../DealerSkill.ts";
import { MARCUS_PROFILE } from "../../../probability/DealerOddsProfiles.ts";

export const MARCUS_DATA: DealerData = {
  id: "marcus",

  name: "Marcus",

  title: "manager",

  avatarNormal: "/assets/main/icons/casino_staff_icons/marcus_icon.png",

  avatarSmall: "/assets/main/icons/casino_staff_icons/marcus_icon_small.png",

  avatarLocked: "/assets/main/icons/casino_staff_icons/locked_dealer_icon.png",

  signatureToken:
    "/assets/main/icons/signature_token_icons/managers/marcus/marcus_signature_token_icon.png",
  signatureTokenName: "marcusAccountingJournal",
  signatureTokenDescription: "marcusAccountingJournalDescription",

  group: DealerGroup.MANAGER,
  role: DealerRole.REGULAR,

  oddsProfile: MARCUS_PROFILE,

  objectiveType: ObjectiveType.INCREASE_BALANCE,

  objectiveValue: 2500,

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
      id: DealerSkillId.WINNING_TAX,
      name: "winningTaxSkillName",
      description: "winningTaxSkillDescription",
      icon: "/assets/main/icons/dealer_skill_icons/managers/marcus/winning_tax.png",
    },
  ],

  dealerDescription: "marcusDescription",

  saying: "marcusSaying",
};
