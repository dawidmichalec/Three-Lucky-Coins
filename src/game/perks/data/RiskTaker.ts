import { PerkData } from "../PerkData";
import { PerkRarity } from "../PerkRarity";

export interface RiskTakerConfig {
  payoutMultiplier: number;
}

export const RISK_TAKER_DATA: PerkData<RiskTakerConfig> = {
  id: "risk_taker",

  name: "riskTakerName",

  variants: [
    {
      rarity: PerkRarity.COMMON,

      description: "riskTakerDescriptionCommon",

      assets: {
        small:
          "/assets/main/icons/perk_icons/risk_taker/common/risk_taker_small_icon_common.png",
        mid: "/assets/main/icons/perk_icons/risk_taker/common/risk_taker_mid_icon_common.png",
        big: "/assets/main/icons/perk_icons/risk_taker/common/risk_taker_big_icon_common.png",
      },

      config: {
        payoutMultiplier: 1.1,
      },
    },

    {
      rarity: PerkRarity.UNCOMMON,

      description: "riskTakerDescriptionUncommon",

      assets: {
        small:
          "/assets/main/icons/perk_icons/risk_taker/uncommon/risk_taker_small_icon_uncommon.png",
        mid: "/assets/main/icons/perk_icons/risk_taker/uncommon/risk_taker_mid_icon_uncommon.png",
        big: "/assets/main/icons/perk_icons/risk_taker/uncommon/risk_taker_big_icon_uncommon.png",
      },

      config: {
        payoutMultiplier: 1.125,
      },
    },

    {
      rarity: PerkRarity.RARE,

      description: "riskTakerDescriptionRare",

      assets: {
        small:
          "/assets/main/icons/perk_icons/risk_taker/rare/risk_taker_small_icon_rare.png",
        mid: "/assets/main/icons/perk_icons/risk_taker/rare/risk_taker_mid_icon_rare.png",
        big: "/assets/main/icons/perk_icons/risk_taker/rare/risk_taker_big_icon_rare.png",
      },

      config: {
        payoutMultiplier: 1.15,
      },
    },

    {
      rarity: PerkRarity.EPIC,

      description: "riskTakerDescriptionEpic",

      assets: {
        small:
          "/assets/main/icons/perk_icons/risk_taker/epic/risk_taker_small_icon_epic.png",
        mid: "/assets/main/icons/perk_icons/risk_taker/epic/risk_taker_mid_icon_epic.png",
        big: "/assets/main/icons/perk_icons/risk_taker/epic/risk_taker_big_icon_epic.png",
      },

      config: {
        payoutMultiplier: 1.2,
      },
    },

    {  
      rarity: PerkRarity.LEGENDARY,

      description: "riskTakerDescriptionLegendary",

      assets: {
        small:
          "/assets/main/icons/perk_icons/risk_taker/legendary/risk_taker_small_icon_legendary.png",
        mid: "/assets/main/icons/perk_icons/risk_taker/legendary/risk_taker_mid_icon_legendary.png",
        big: "/assets/main/icons/perk_icons/risk_taker/legendary/risk_taker_big_icon_legendary.png",
      },

      config: {
        payoutMultiplier: 1.25,
      },
    },
  ],
};
