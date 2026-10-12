import { PerkData } from "../PerkData";
import { PerkRarity } from "../PerkRarity";

export interface GoldenBoyConfig {
  winningsBonuses: number[];
}

export const GOLDEN_BOY_DATA: PerkData<GoldenBoyConfig> = {
  id: "golden_boy",
  name: "goldenBoyName",

  variants: [
    {
      rarity: PerkRarity.COMMON,
      description: "goldenBoyDescriptionCommon",
      assets: {
        small: "/assets/main/icons/perk_icons/golden_boy/common/golden_boy_small_icon_common.png",
        mid: "/assets/main/icons/perk_icons/golden_boy/common/golden_boy_mid_icon_common.png",
        big: "/assets/main/icons/perk_icons/golden_boy/common/golden_boy_big_icon_common.png",
      },
      config: {
        winningsBonuses: [0.5, 1, 1.5],
      },
    },
    {
      rarity: PerkRarity.UNCOMMON,
      description: "goldenBoyDescriptionUncommon",
      assets: {
        small: "/assets/main/icons/perk_icons/golden_boy/uncommon/golden_boy_small_icon_uncommon.png",
        mid: "/assets/main/icons/perk_icons/golden_boy/uncommon/golden_boy_mid_icon_uncommon.png",
        big: "/assets/main/icons/perk_icons/golden_boy/uncommon/golden_boy_big_icon_uncommon.png",
      },
      config: {
        winningsBonuses: [1, 2, 3],
      },
    },
    {
      rarity: PerkRarity.RARE,
      description: "goldenBoyDescriptionRare",
      assets: {
        small: "/assets/main/icons/perk_icons/golden_boy/rare/golden_boy_small_icon_rare.png",
        mid: "/assets/main/icons/perk_icons/golden_boy/rare/golden_boy_mid_icon_rare.png",
        big: "/assets/main/icons/perk_icons/golden_boy/rare/golden_boy_big_icon_rare.png",
      },
      config: {
        winningsBonuses: [1.5, 3, 4.5],
      },
    },
    {
      rarity: PerkRarity.EPIC,
      description: "goldenBoyDescriptionEpic",
      assets: {
        small: "/assets/main/icons/perk_icons/golden_boy/epic/golden_boy_small_icon_epic.png",
        mid: "/assets/main/icons/perk_icons/golden_boy/epic/golden_boy_mid_icon_epic.png",
        big: "/assets/main/icons/perk_icons/golden_boy/epic/golden_boy_big_icon_epic.png",
      },
      config: {
        winningsBonuses: [2, 4, 6],
      },
    },
    {
      rarity: PerkRarity.LEGENDARY,
      description: "goldenBoyDescriptionLegendary",
      assets: {
        small: "/assets/main/icons/perk_icons/golden_boy/legendary/golden_boy_small_icon_legendary.png",
        mid: "/assets/main/icons/perk_icons/golden_boy/legendary/golden_boy_mid_icon_legendary.png",
        big: "/assets/main/icons/perk_icons/golden_boy/legendary/golden_boy_big_icon_legendary.png",
      },
      config: {
        winningsBonuses: [2.5, 5, 7.5],
      },
    },
  ],
};