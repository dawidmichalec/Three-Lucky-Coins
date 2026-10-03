import { PerkData } from "../PerkData";
import { PerkRarity } from "../PerkRarity";

export interface GreedConfig {
  winningsBonus: number;
  multiplierGrowthReduction: number;
}

export const GREED_DATA: PerkData<GreedConfig> = {
  id: "greed",
  name: "greedName",
  variants: [
    {
      rarity: PerkRarity.COMMON,
      description: "greedDescriptionCommon",
      assets: {
        small: "/assets/main/icons/perk_icons/greed/common/greed_small_icon_common.png",
        mid: "/assets/main/icons/perk_icons/greed/common/greed_mid_icon_common.png",
        big: "/assets/main/icons/perk_icons/greed/common/greed_big_icon_common.png",
      },
      config: {
        winningsBonus: 0.1,
        multiplierGrowthReduction: 0.1,
      },
    },
    {
      rarity: PerkRarity.UNCOMMON,
      description: "greedDescriptionUncommon",
      assets: {
        small: "/assets/main/icons/perk_icons/greed/uncommon/greed_small_icon_uncommon.png",
        mid: "/assets/main/icons/perk_icons/greed/uncommon/greed_mid_icon_uncommon.png",
        big: "/assets/main/icons/perk_icons/greed/uncommon/greed_big_icon_uncommon.png",
      },
      config: {
        winningsBonus: 0.15,
        multiplierGrowthReduction: 0.2,
      },
    },
    {
      rarity: PerkRarity.RARE,
      description: "greedDescriptionRare",
      assets: {
        small: "/assets/main/icons/perk_icons/greed/rare/greed_small_icon_rare.png",
        mid: "/assets/main/icons/perk_icons/greed/rare/greed_mid_icon_rare.png",
        big: "/assets/main/icons/perk_icons/greed/rare/greed_big_icon_rare.png",
      },
      config: {
        winningsBonus: 0.2,
        multiplierGrowthReduction: 0.3,
      },
    },
    {
      rarity: PerkRarity.EPIC,
      description: "greedDescriptionEpic",
      assets: {
        small: "/assets/main/icons/perk_icons/greed/epic/greed_small_icon_epic.png",
        mid: "/assets/main/icons/perk_icons/greed/epic/greed_mid_icon_epic.png",
        big: "/assets/main/icons/perk_icons/greed/epic/greed_big_icon_epic.png",
      },
      config: {
        winningsBonus: 0.25,
        multiplierGrowthReduction: 0.4,
      },
    },
    {
      rarity: PerkRarity.LEGENDARY,
      description: "greedDescriptionLegendary",
      assets: {
        small: "/assets/main/icons/perk_icons/greed/legendary/greed_small_icon_legendary.png",
        mid: "/assets/main/icons/perk_icons/greed/legendary/greed_mid_icon_legendary.png",
        big: "/assets/main/icons/perk_icons/greed/legendary/greed_big_icon_legendary.png",
      },
      config: {
        winningsBonus: 0.3,
        multiplierGrowthReduction: 0.5,
      },
    },
  ],
};