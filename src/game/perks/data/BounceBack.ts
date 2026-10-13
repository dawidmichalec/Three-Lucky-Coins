import { PerkData } from "../PerkData";
import { PerkRarity } from "../PerkRarity";

export interface BounceBackConfig {
  multiplierGrowthBonus: number;
}

export const BOUNCE_BACK_DATA: PerkData<BounceBackConfig> = {
  id: "bounce_back",
  name: "bounceBackName",

  variants: [
    {
      rarity: PerkRarity.COMMON,
      description: "bounceBackDescriptionCommon",
      assets: {
        small: "/assets/main/icons/perk_icons/bounce_back/common/bounce_back_small_icon_common.png",
        mid: "/assets/main/icons/perk_icons/bounce_back/common/bounce_back_mid_icon_common.png",
        big: "/assets/main/icons/perk_icons/bounce_back/common/bounce_back_big_icon_common.png",
      },
      config: {
        multiplierGrowthBonus: 0.25,
      },
    },
    {
      rarity: PerkRarity.UNCOMMON,
      description: "bounceBackDescriptionUncommon",
      assets: {
        small: "/assets/main/icons/perk_icons/bounce_back/uncommon/bounce_back_small_icon_uncommon.png",
        mid: "/assets/main/icons/perk_icons/bounce_back/uncommon/bounce_back_mid_icon_uncommon.png",
        big: "/assets/main/icons/perk_icons/bounce_back/uncommon/bounce_back_big_icon_uncommon.png",
      },
      config: {
        multiplierGrowthBonus: 0.5,
      },
    },
    {
      rarity: PerkRarity.RARE,
      description: "bounceBackDescriptionRare",
      assets: {
        small: "/assets/main/icons/perk_icons/bounce_back/rare/bounce_back_small_icon_rare.png",
        mid: "/assets/main/icons/perk_icons/bounce_back/rare/bounce_back_mid_icon_rare.png",
        big: "/assets/main/icons/perk_icons/bounce_back/rare/bounce_back_big_icon_rare.png",
      },
      config: {
        multiplierGrowthBonus: 0.75,
      },
    },
    {
      rarity: PerkRarity.EPIC,
      description: "bounceBackDescriptionEpic",
      assets: {
        small: "/assets/main/icons/perk_icons/bounce_back/epic/bounce_back_small_icon_epic.png",
        mid: "/assets/main/icons/perk_icons/bounce_back/epic/bounce_back_mid_icon_epic.png",
        big: "/assets/main/icons/perk_icons/bounce_back/epic/bounce_back_big_icon_epic.png",
      },
      config: {
        multiplierGrowthBonus: 1,
      },
    },
    {
      rarity: PerkRarity.LEGENDARY,
      description: "bounceBackDescriptionLegendary",
      assets: {
        small: "/assets/main/icons/perk_icons/bounce_back/legendary/bounce_back_small_icon_legendary.png",
        mid: "/assets/main/icons/perk_icons/bounce_back/legendary/bounce_back_mid_icon_legendary.png",
        big: "/assets/main/icons/perk_icons/bounce_back/legendary/bounce_back_big_icon_legendary.png",
      },
      config: {
        multiplierGrowthBonus: 1.25,
      },
    },
  ],
};