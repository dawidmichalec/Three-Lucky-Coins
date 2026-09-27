import { DealerData } from "../../DealerData.ts";
import { ObjectiveType } from "../../../objectives/ObjectiveTypes.ts";
import { DealerGroup } from "../../DealerGroup.ts";
import { DealerRole } from "../../DealerRole.ts";
import { DealerSkillId } from "../../DealerSkill.ts";
import { TLCMPROTO_PROFILE } from "../../../probability/DealerOddsProfiles.ts";

export const TLCMPROTO_DATA: DealerData = {
  id: "tlcm-proto",

  name: "TLCM-PROTO",

  title: "machine",

  avatarNormal: "/assets/main/icons/casino_staff_icons/tlcm-proto_icon.png",

  avatarSmall: "/assets/main/icons/casino_staff_icons/tlcm-proto_icon_small.png",

  avatarLocked: "/assets/main/icons/casino_staff_icons/locked_dealer_icon.png",

  signatureToken:
    "/assets/main/icons/signature_token_icons/machine_floor/tlcm-proto/tlcm-proto_signature_token_icon.png",
  signatureTokenName: "tlcmProtoPrototypeCore",
  signatureTokenDescription: "tlcmProtoPrototypeCoreDescription",

  group: DealerGroup.MACHINE_FLOOR,
  role: DealerRole.SUPERVISOR,

  oddsProfile: TLCMPROTO_PROFILE,

  objectiveType: ObjectiveType.WIN_BETS,

  objectiveValue: 20,

  goldenCoinSettings: {
    enabled: false,
    baseChance: 0.015,
    chanceMultiplier: 0,
    maximumGoldenCoins: 0,
  },

  gambleForMoreSettings: {
    enabled: true,
    triggerChance: 0.5,
  },

  skills: [
    {
        id: DealerSkillId.MULTIPLE_MALFUNCTIONS,
        name: "multipleMalfunctionsSkillName",
        description: "multipleMalfunctionsSkillDescription",
    },
  ],

  dealerDescription: "tlcmProtoDescription",

  saying: "tlcmProtoSaying",
};
