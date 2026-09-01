import { PerkData } from "../PerkData";
import { PerkRarity } from "../PerkRarity";

export interface CasinoBonusConfig {
  freeBetsPerFight: number;
  maximumFreeBet: number;
}

export const CASINO_BONUS_DATA: PerkData<CasinoBonusConfig> = {
  id: "casino_bonus",

  name: "casinoBonusName",

  variants: [
    {
      rarity: PerkRarity.COMMON,

      description: "casinoBonusDescriptionCommon",

      assets: {
        small:
          "/assets/main/icons/perk_icons/casino_bonus/common/casino_bonus_small_icon_common.png",
        mid: "/assets/main/icons/perk_icons/casino_bonus/common/casino_bonus_mid_icon_common.png",
        big: "/assets/main/icons/perk_icons/casino_bonus/common/casino_bonus_big_icon_common.png",
      },

      config: {
        freeBetsPerFight: 1,
        maximumFreeBet: 10,
      },
    },

    {
      rarity: PerkRarity.UNCOMMON,

      description: "casinoBonusDescriptionUncommon",

      assets: {
        small:
          "/assets/main/icons/perk_icons/casino_bonus/uncommon/casino_bonus_small_icon_uncommon.png",
        mid: "/assets/main/icons/perk_icons/casino_bonus/uncommon/casino_bonus_mid_icon_uncommon.png",
        big: "/assets/main/icons/perk_icons/casino_bonus/uncommon/casino_bonus_big_icon_uncommon.png",
      },

      config: {
        freeBetsPerFight: 2,
        maximumFreeBet: 10,
      },
    },

    {
      rarity: PerkRarity.RARE,

      description: "casinoBonusDescriptionRare",

      assets: {
        small:
          "/assets/main/icons/perk_icons/casino_bonus/rare/casino_bonus_small_icon_rare.png",
        mid: "/assets/main/icons/perk_icons/casino_bonus/rare/casino_bonus_mid_icon_rare.png",
        big: "/assets/main/icons/perk_icons/casino_bonus/rare/casino_bonus_big_icon_rare.png",
      },

      config: {
        freeBetsPerFight: 3,
        maximumFreeBet: 10,
      },
    },

    {
      rarity: PerkRarity.EPIC,

      description: "casinoBonusDescriptionEpic",

      assets: {
        small:
          "/assets/main/icons/perk_icons/casino_bonus/epic/casino_bonus_small_icon_epic.png",
        mid: "/assets/main/icons/perk_icons/casino_bonus/epic/casino_bonus_mid_icon_epic.png",
        big: "/assets/main/icons/perk_icons/casino_bonus/epic/casino_bonus_big_icon_epic.png",
      },

      config: {
        freeBetsPerFight: 4,
        maximumFreeBet: 10,
      },
    },

    {
      rarity: PerkRarity.LEGENDARY,

      description: "casinoBonusDescriptionLegendary",

      assets: {
        small:
          "/assets/main/icons/perk_icons/casino_bonus/legendary/casino_bonus_small_icon_legendary.png",
        mid: "/assets/main/icons/perk_icons/casino_bonus/legendary/casino_bonus_mid_icon_legendary.png",
        big: "/assets/main/icons/perk_icons/casino_bonus/legendary/casino_bonus_big_icon_legendary.png",
      },

      config: {
        freeBetsPerFight: 5,
        maximumFreeBet: 10,
      },
    },
  ],
};
