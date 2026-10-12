import { PerkData } from "../PerkData";
import { PerkRarity } from "../PerkRarity";

export const LUCKY_PRIZE_THRESHOLDS = [2, 3, 5, 7, 10];

export interface LuckyPrizeConfig {
  multiplierGrowthBonuses: number[];
}

export const LUCKY_PRIZE_DATA: PerkData<LuckyPrizeConfig> = {
  id: "lucky_prize",
  name: "luckyPrizeName",

  variants: [
    {
      rarity: PerkRarity.COMMON,
      description: "luckyPrizeDescriptionCommon",
      assets: {
        small: "/assets/main/icons/perk_icons/lucky_prize/common/lucky_prize_small_icon_common.png",
        mid: "/assets/main/icons/perk_icons/lucky_prize/common/lucky_prize_mid_icon_common.png",
        big: "/assets/main/icons/perk_icons/lucky_prize/common/lucky_prize_big_icon_common.png",
      },
      config: {
        multiplierGrowthBonuses: [0.1, 0.2, 0.3, 0.4, 0.5],
      },
    },
    {
      rarity: PerkRarity.UNCOMMON,
      description: "luckyPrizeDescriptionUncommon",
      assets: {
        small: "/assets/main/icons/perk_icons/lucky_prize/uncommon/lucky_prize_small_icon_uncommon.png",
        mid: "/assets/main/icons/perk_icons/lucky_prize/uncommon/lucky_prize_mid_icon_uncommon.png",
        big: "/assets/main/icons/perk_icons/lucky_prize/uncommon/lucky_prize_big_icon_uncommon.png",
      },
      config: {
        multiplierGrowthBonuses: [0.15, 0.3, 0.45, 0.6, 0.75],
      },
    },
    {
      rarity: PerkRarity.RARE,
      description: "luckyPrizeDescriptionRare",
      assets: {
        small: "/assets/main/icons/perk_icons/lucky_prize/rare/lucky_prize_small_icon_rare.png",
        mid: "/assets/main/icons/perk_icons/lucky_prize/rare/lucky_prize_mid_icon_rare.png",
        big: "/assets/main/icons/perk_icons/lucky_prize/rare/lucky_prize_big_icon_rare.png",
      },
      config: {
        multiplierGrowthBonuses: [0.2, 0.4, 0.6, 0.8, 1],
      },
    },
    {
      rarity: PerkRarity.EPIC,
      description: "luckyPrizeDescriptionEpic",
      assets: {
        small: "/assets/main/icons/perk_icons/lucky_prize/epic/lucky_prize_small_icon_epic.png",
        mid: "/assets/main/icons/perk_icons/lucky_prize/epic/lucky_prize_mid_icon_epic.png",
        big: "/assets/main/icons/perk_icons/lucky_prize/epic/lucky_prize_big_icon_epic.png",
      },
      config: {
        multiplierGrowthBonuses: [0.25, 0.5, 0.75, 1, 1.25],
      },
    },
    {
      rarity: PerkRarity.LEGENDARY,
      description: "luckyPrizeDescriptionLegendary",
      assets: {
        small: "/assets/main/icons/perk_icons/lucky_prize/legendary/lucky_prize_small_icon_legendary.png",
        mid: "/assets/main/icons/perk_icons/lucky_prize/legendary/lucky_prize_mid_icon_legendary.png",
        big: "/assets/main/icons/perk_icons/lucky_prize/legendary/lucky_prize_big_icon_legendary.png",
      },
      config: {
        multiplierGrowthBonuses: [0.3, 0.6, 0.9, 1.2, 1.5],
      },
    },
  ],
};