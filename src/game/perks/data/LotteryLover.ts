import { PerkData } from "../PerkData";
import { PerkRarity } from "../PerkRarity";

export interface LotteryLoverConfig {
  requiredWins: number;
  winningsBonus: number;
}

export const LOTTERY_LOVER_DATA: PerkData<LotteryLoverConfig> = {
  id: "lottery_lover",

  name: "lotteryLoverName",

  isStackable: true,

  variants: [
    {
      rarity: PerkRarity.COMMON,
      description: "lotteryLoverDescriptionCommon",
      assets: {
        small: "/assets/main/icons/perk_icons/lottery_lover/common/lottery_lover_small_icon_common.png",
        mid: "/assets/main/icons/perk_icons/lottery_lover/common/lottery_lover_mid_icon_common.png",
        big: "/assets/main/icons/perk_icons/lottery_lover/common/lottery_lover_big_icon_common.png",
      },
      config: {
        requiredWins: 3,
        winningsBonus: 0.05,
      },
    },

    {
      rarity: PerkRarity.UNCOMMON,
      description: "lotteryLoverDescriptionUncommon",
      assets: {
        small: "/assets/main/icons/perk_icons/lottery_lover/uncommon/lottery_lover_small_icon_uncommon.png",
        mid: "/assets/main/icons/perk_icons/lottery_lover/uncommon/lottery_lover_mid_icon_uncommon.png",
        big: "/assets/main/icons/perk_icons/lottery_lover/uncommon/lottery_lover_big_icon_uncommon.png",
      },
      config: {
        requiredWins: 3,
        winningsBonus: 0.10,
      },
    },

    {
      rarity: PerkRarity.RARE,
      description: "lotteryLoverDescriptionRare",
      assets: {
        small: "/assets/main/icons/perk_icons/lottery_lover/rare/lottery_lover_small_icon_rare.png",
        mid: "/assets/main/icons/perk_icons/lottery_lover/rare/lottery_lover_mid_icon_rare.png",
        big: "/assets/main/icons/perk_icons/lottery_lover/rare/lottery_lover_big_icon_rare.png",
      },
      config: {
        requiredWins: 3,
        winningsBonus: 0.15,
      },
    },

    {
      rarity: PerkRarity.EPIC,
      description: "lotteryLoverDescriptionEpic",
      assets: {
        small: "/assets/main/icons/perk_icons/lottery_lover/epic/lottery_lover_small_icon_epic.png",
        mid: "/assets/main/icons/perk_icons/lottery_lover/epic/lottery_lover_mid_icon_epic.png",
        big: "/assets/main/icons/perk_icons/lottery_lover/epic/lottery_lover_big_icon_epic.png",
      },
      config: {
        requiredWins: 3,
        winningsBonus: 0.20,
      },
    },

    {
      rarity: PerkRarity.LEGENDARY,
      description: "lotteryLoverDescriptionLegendary",
      assets: {
        small: "/assets/main/icons/perk_icons/lottery_lover/legendary/lottery_lover_small_icon_legendary.png",
        mid: "/assets/main/icons/perk_icons/lottery_lover/legendary/lottery_lover_mid_icon_legendary.png",
        big: "/assets/main/icons/perk_icons/lottery_lover/legendary/lottery_lover_big_icon_legendary.png",
      },
      config: {
        requiredWins: 3,
        winningsBonus: 0.25,
      },
    },
  ],
};