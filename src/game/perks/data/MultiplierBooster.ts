import { PerkData } from "../PerkData";
import { PerkRarity } from "../PerkRarity";

export interface MultiplierBoosterConfig {
  streakMultiplierIncrease: number;
}

export const MULTIPLIER_BOOSTER_DATA: PerkData<MultiplierBoosterConfig> = {
  id: "multiplier_booster",

  name: "multiplierBoosterName",

  variants: [
    {
      rarity: PerkRarity.COMMON,

      description: "multiplierBoosterDescriptionCommon",

      assets: {
        small:
          "/assets/main/icons/perk_icons/multiplier_booster/common/multiplier_booster_small_icon_common.png",

        mid: "/assets/main/icons/perk_icons/multiplier_booster/common/multiplier_booster_mid_icon_common.png",

        big: "/assets/main/icons/perk_icons/multiplier_booster/common/multiplier_booster_big_icon_common.png",
      },

      config: {
        streakMultiplierIncrease: 0.25,
      },
    },

    {
      rarity: PerkRarity.UNCOMMON,

      description: "multiplierBoosterDescriptionUncommon",

      assets: {
        small:
          "/assets/main/icons/perk_icons/multiplier_booster/uncommon/multiplier_booster_small_icon_uncommon.png",

        mid: "/assets/main/icons/perk_icons/multiplier_booster/uncommon/multiplier_booster_mid_icon_uncommon.png",

        big: "/assets/main/icons/perk_icons/multiplier_booster/uncommon/multiplier_booster_big_icon_uncommon.png",
      },

      config: {
        streakMultiplierIncrease: 0.5,
      },
    },

    {
      rarity: PerkRarity.RARE,

      description: "multiplierBoosterDescriptionRare",

      assets: {
        small:
          "/assets/main/icons/perk_icons/multiplier_booster/rare/multiplier_booster_small_icon_rare.png",

        mid: "/assets/main/icons/perk_icons/multiplier_booster/rare/multiplier_booster_mid_icon_rare.png",

        big: "/assets/main/icons/perk_icons/multiplier_booster/rare/multiplier_booster_big_icon_rare.png",
      },

      config: {
        streakMultiplierIncrease: 0.75,
      },
    },

    {
      rarity: PerkRarity.EPIC,

      description: "multiplierBoosterDescriptionEpic",

      assets: {
        small:
          "/assets/main/icons/perk_icons/multiplier_booster/epic/multiplier_booster_small_icon_epic.png",

        mid: "/assets/main/icons/perk_icons/multiplier_booster/epic/multiplier_booster_mid_icon_epic.png",

        big: "/assets/main/icons/perk_icons/multiplier_booster/epic/multiplier_booster_big_icon_epic.png",
      },

      config: {
        streakMultiplierIncrease: 1,
      },
    },

    {
      rarity: PerkRarity.LEGENDARY,

      description: "multiplierBoosterDescriptionLegendary",

      assets: {
        small:
          "/assets/main/icons/perk_icons/multiplier_booster/legendary/multiplier_booster_small_icon_legendary.png",

        mid: "/assets/main/icons/perk_icons/multiplier_booster/legendary/multiplier_booster_mid_icon_legendary.png",

        big: "/assets/main/icons/perk_icons/multiplier_booster/legendary/multiplier_booster_big_icon_legendary.png",
      },

      config: {
        streakMultiplierIncrease: 1.25,
      },
    },
  ],
};
