import { DealerData } from "../../DealerData.ts";
import { ObjectiveType } from "../../../objectives/ObjectiveTypes.ts";
import { DealerGroup } from "../../DealerGroup.ts";
import { DealerRole } from "../../DealerRole.ts";
import { DealerSkillId } from "../../DealerSkill.ts";
import { TRISHA_PROFILE } from "../../../probability/DealerOddsProfiles.ts";

export const TRISHA_DATA: DealerData = {
  id: "trisha",

  name: "Trisha",

  title: "midSupervisor",

  avatarNormal: "/assets/main/icons/casino_staff_icons/trisha_icon.png",

  avatarSmall: "/assets/main/icons/casino_staff_icons/trisha_icon_small.png",

  avatarLocked: "/assets/main/icons/casino_staff_icons/locked_dealer_icon.png",

  signatureToken:
    "/assets/main/icons/signature_token_icons/mid_dealers/trisha/trisha_signature_token_icon.png",
  signatureTokenName: "trishaEarrings",
  signatureTokenDescription: "trishaEarringsDescription",

  group: DealerGroup.MID,
  role: DealerRole.SUPERVISOR,

  oddsProfile: TRISHA_PROFILE,

  objectiveType: ObjectiveType.COLLECT_GOLDEN_COINS,

  objectiveValue: 3,

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
      id: DealerSkillId.SMALL_HOUSE_CUT,
      name: "smallHouseCutSkillName",
      description: "smallHouseCutSkillDescription",
      icon: "/assets/main/icons/dealer_skill_icons/mid_dealers/trisha/small_house_cut.png",
    },
  ],

  dealerDescription: "trishaDescription",

  saying: "trishaSaying",
};
