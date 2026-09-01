import { PerkData } from "../PerkData";
import { PerkRarity } from "../PerkRarity";

export interface CoinSenseConfig {
  revealedTossesPerFight: number;
  payoutMultiplier: number;
}

export const COIN_SENSE_DATA: PerkData<CoinSenseConfig> = {
  id: "coin_sense",

  name: "coinSenseName",

  variants: [
    {
      rarity: PerkRarity.COMMON,

      description: "coinSenseDescriptionCommon",

      assets: {
        small:
          "/assets/main/icons/perk_icons/coin_sense/common/coin_sense_small_icon_common.png",
        mid: "/assets/main/icons/perk_icons/coin_sense/common/coin_sense_mid_icon_common.png",
        big: "/assets/main/icons/perk_icons/coin_sense/common/coin_sense_big_icon_common.png",
      },

      config: {
        revealedTossesPerFight: 1,
        payoutMultiplier: 0.75,
      },
    },

    {
      rarity: PerkRarity.UNCOMMON,

      description: "coinSenseDescriptionUncommon",

      assets: {
        small:
          "/assets/main/icons/perk_icons/coin_sense/uncommon/coin_sense_small_icon_uncommon.png",
        mid: "/assets/main/icons/perk_icons/coin_sense/uncommon/coin_sense_mid_icon_uncommon.png",
        big: "/assets/main/icons/perk_icons/coin_sense/uncommon/coin_sense_big_icon_uncommon.png",
      },

      config: {
        revealedTossesPerFight: 1,
        payoutMultiplier: 0.8,
      },
    },

    {
      rarity: PerkRarity.RARE,

      description: "coinSenseDescriptionRare",

      assets: {
        small:
          "/assets/main/icons/perk_icons/coin_sense/rare/coin_sense_small_icon_rare.png",
        mid: "/assets/main/icons/perk_icons/coin_sense/rare/coin_sense_mid_icon_rare.png",
        big: "/assets/main/icons/perk_icons/coin_sense/rare/coin_sense_big_icon_rare.png",
      },

      config: {
        revealedTossesPerFight: 1,
        payoutMultiplier: 0.85,
      },
    },

    {
      rarity: PerkRarity.EPIC,

      description: "coinSenseDescriptionEpic",

      assets: {
        small:
          "/assets/main/icons/perk_icons/coin_sense/epic/coin_sense_small_icon_epic.png",
        mid: "/assets/main/icons/perk_icons/coin_sense/epic/coin_sense_mid_icon_epic.png",
        big: "/assets/main/icons/perk_icons/coin_sense/epic/coin_sense_big_icon_epic.png",
      },

      config: {
        revealedTossesPerFight: 2,
        payoutMultiplier: 0.8,
      },
    },

    {
      rarity: PerkRarity.LEGENDARY,

      description: "coinSenseDescriptionLegendary",

      assets: {
        small:
          "/assets/main/icons/perk_icons/coin_sense/legendary/coin_sense_small_icon_legendary.png",
        mid: "/assets/main/icons/perk_icons/coin_sense/legendary/coin_sense_mid_icon_legendary.png",
        big: "/assets/main/icons/perk_icons/coin_sense/legendary/coin_sense_big_icon_legendary.png",
      },

      config: {
        revealedTossesPerFight: 3,
        payoutMultiplier: 0.75,
      },
    },
  ],
};
