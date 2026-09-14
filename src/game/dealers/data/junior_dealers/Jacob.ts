import { DealerData } from "../../DealerData.ts";
import { ObjectiveType } from "../../../objectives/ObjectiveTypes.ts";
import { DealerGroup } from "../../DealerGroup.ts";
import { DealerRole } from "../../DealerRole.ts";
import { DealerSkillId } from "../../DealerSkill.ts";
import { JACOB_PROFILE } from "../../../probability/DealerOddsProfiles.ts";

export const JACOB_DATA: DealerData = {
  id: "jacob",

  name: "Jacob",

  title: "juniorSupervisor",

  avatarNormal: "/assets/main/icons/casino_staff_icons/jacob_icon.png",

  avatarSmall: "/assets/main/icons/casino_staff_icons/jacob_icon_small.png",

  avatarLocked: "/assets/main/icons/casino_staff_icons/locked_dealer_icon.png",

  signatureToken:
    "/assets/main/icons/signature_token_icons/junior_dealers/jacob/jacob_signature_token_icon.png",
  signatureTokenName: "jacobDogTag",
  signatureTokenDescription: "jacobDogTagDescription",

  group: DealerGroup.JUNIOR,
  role: DealerRole.SUPERVISOR,

  oddsProfile: JACOB_PROFILE,

  objectiveType: ObjectiveType.SURVIVE_ROUNDS,

  objectiveValue: 30,

  goldenCoinSettings: {
    baseChance: 0.0075,
    chanceMultiplier: 0.7,
    maximumGoldenCoins: 1,
  },

  gambleForMoreSettings: {
    enabled: true,
    triggerChance: 0.5,
  },

  skills: [
      {
        id: DealerSkillId.MULTIPLIER_DECAY,
        name: "multiplierDecaySkillName",
        description: "multiplierDecaySkillDescription",
        icon: "/assets/main/icons/dealer_skill_icons/junior_dealers/jacob/multiplier_decay.png",
      },
    ],

  dealerDescription: "jacobDescription",

  saying: "jacobSaying",
};
