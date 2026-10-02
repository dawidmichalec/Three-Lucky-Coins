import { PerkData } from "../PerkData";
import { PerkRarity } from "../PerkRarity";

export interface HotStreakConfig {
  requiredMultiplier: number;
  winningsBonus: number;
}

export const HOT_STREAK_DATA: PerkData<HotStreakConfig> = {
  id: "hot_streak",

  name: "hotStreakName",

  variants: [
    {
      rarity: PerkRarity.COMMON,
      description: "hotStreakDescriptionCommon",
      assets: {
        small: "/assets/main/icons/perk_icons/hot_streak/common/hot_streak_small_icon_common.png",
        mid: "/assets/main/icons/perk_icons/hot_streak/common/hot_streak_mid_icon_common.png",
        big: "/assets/main/icons/perk_icons/hot_streak/common/hot_streak_big_icon_common.png",
      },
      config: {
        requiredMultiplier: 5,
        winningsBonus: 0.05,
      },
    },

    {
      rarity: PerkRarity.UNCOMMON,
      description: "hotStreakDescriptionUncommon",
      assets: {
        small: "/assets/main/icons/perk_icons/hot_streak/uncommon/hot_streak_small_icon_uncommon.png",
        mid: "/assets/main/icons/perk_icons/hot_streak/uncommon/hot_streak_mid_icon_uncommon.png",
        big: "/assets/main/icons/perk_icons/hot_streak/uncommon/hot_streak_big_icon_uncommon.png",
      },
      config: {
        requiredMultiplier: 5,
        winningsBonus: 0.1,
      },
    },

    {
      rarity: PerkRarity.RARE,
      description: "hotStreakDescriptionRare",
      assets: {
        small: "/assets/main/icons/perk_icons/hot_streak/rare/hot_streak_small_icon_rare.png",
        mid: "/assets/main/icons/perk_icons/hot_streak/rare/hot_streak_mid_icon_rare.png",
        big: "/assets/main/icons/perk_icons/hot_streak/rare/hot_streak_big_icon_rare.png",
      },
      config: {
        requiredMultiplier: 5,
        winningsBonus: 0.15,
      },
    },

    {
      rarity: PerkRarity.EPIC,
      description: "hotStreakDescriptionEpic",
      assets: {
        small: "/assets/main/icons/perk_icons/hot_streak/epic/hot_streak_small_icon_epic.png",
        mid: "/assets/main/icons/perk_icons/hot_streak/epic/hot_streak_mid_icon_epic.png",
        big: "/assets/main/icons/perk_icons/hot_streak/epic/hot_streak_big_icon_epic.png",
      },
      config: {
        requiredMultiplier: 5,
        winningsBonus: 0.2,
      },
    },

    {
      rarity: PerkRarity.LEGENDARY,
      description: "hotStreakDescriptionLegendary",
      assets: {
        small: "/assets/main/icons/perk_icons/hot_streak/legendary/hot_streak_small_icon_legendary.png",
        mid: "/assets/main/icons/perk_icons/hot_streak/legendary/hot_streak_mid_icon_legendary.png",
        big: "/assets/main/icons/perk_icons/hot_streak/legendary/hot_streak_big_icon_legendary.png",
      },
      config: {
        requiredMultiplier: 5,
        winningsBonus: 0.25,
      },
    },
  ],
};