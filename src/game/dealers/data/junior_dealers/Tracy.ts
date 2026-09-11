import { DealerData } from "../../DealerData.ts";
import { ObjectiveType } from "../../../objectives/ObjectiveTypes.ts";
import { DealerGroup } from "../../DealerGroup.ts";
import { DealerRole } from "../../DealerRole.ts";
import { DealerSkillId } from "../../DealerSkill.ts";
import { TRACY_PROFILE } from "../../../probability/DealerOddsProfiles.ts";

export const TRACY_DATA: DealerData = {
  id: "tracy",

  name: "Tracy",

  title: "juniorDealer",

  avatarNormal: "/assets/main/icons/casino_staff_icons/tracy_icon.png",

  avatarSmall: "/assets/main/icons/casino_staff_icons/tracy_icon_small.png",

  avatarLocked: "/assets/main/icons/casino_staff_icons/locked_dealer_icon.png",

  signatureToken:
    "/assets/main/icons/signature_token_icons/junior_dealers/tracy/tracy_signature_token_icon.png",
  signatureTokenName: "tracyNoseRing",
  signatureTokenDescription: "tracyNoseRingDescription",

  group: DealerGroup.JUNIOR,
  role: DealerRole.REGULAR,

  oddsProfile: TRACY_PROFILE,

  objectiveType: ObjectiveType.INCREASE_BALANCE,

  objectiveValue: 400,

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
      id: DealerSkillId.SWITCH_IT_UP,
      name: "switchItUpSkillName",
      description: "switchItUpSkillDescription",
      icon: "/assets/main/icons/dealer_skill_icons/junior_dealers/tracy/switch_it_up.png",
    },
  ],

  dealerDescription: "tracyDescription",

  saying: "tracySaying",
};
