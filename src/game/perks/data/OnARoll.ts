import { PerkData } from "../PerkData";
import { PerkRarity } from "../PerkRarity";

export interface OnARollMilestone {
  multiplier: number;
  winningsBonus: number;
}

export interface OnARollConfig {
  milestones: readonly OnARollMilestone[];
}

export const ON_A_ROLL_DATA: PerkData<OnARollConfig> = {
  id: "on_a_roll",

  name: "onARollName",

  variants: [
    {
      rarity: PerkRarity.COMMON,
      description: "onARollDescriptionCommon",
      assets: {
        small: "/assets/main/icons/perk_icons/on_a_roll/common/on_a_roll_small_icon_common.png",
        mid: "/assets/main/icons/perk_icons/on_a_roll/common/on_a_roll_mid_icon_common.png",
        big: "/assets/main/icons/perk_icons/on_a_roll/common/on_a_roll_big_icon_common.png",
      },
      config: {
        milestones: [
          { multiplier: 3, winningsBonus: 0.025 },
          { multiplier: 5, winningsBonus: 0.05 },
          { multiplier: 7, winningsBonus: 0.075 },
          { multiplier: 10, winningsBonus: 0.1 },
        ],
      },
    },

    {
      rarity: PerkRarity.UNCOMMON,
      description: "onARollDescriptionUncommon",
      assets: {
        small: "/assets/main/icons/perk_icons/on_a_roll/uncommon/on_a_roll_small_icon_uncommon.png",
        mid: "/assets/main/icons/perk_icons/on_a_roll/uncommon/on_a_roll_mid_icon_uncommon.png",
        big: "/assets/main/icons/perk_icons/on_a_roll/uncommon/on_a_roll_big_icon_uncommon.png",
      },
      config: {
        milestones: [
          { multiplier: 3, winningsBonus: 0.05 },
          { multiplier: 5, winningsBonus: 0.1 },
          { multiplier: 7, winningsBonus: 0.15 },
          { multiplier: 10, winningsBonus: 0.25 },
        ],
      },
    },

    {
      rarity: PerkRarity.RARE,
      description: "onARollDescriptionRare",
      assets: {
        small: "/assets/main/icons/perk_icons/on_a_roll/rare/on_a_roll_small_icon_rare.png",
        mid: "/assets/main/icons/perk_icons/on_a_roll/rare/on_a_roll_mid_icon_rare.png",
        big: "/assets/main/icons/perk_icons/on_a_roll/rare/on_a_roll_big_icon_rare.png",
      },
      config: {
        milestones: [
          { multiplier: 3, winningsBonus: 0.075 },
          { multiplier: 5, winningsBonus: 0.15 },
          { multiplier: 7, winningsBonus: 0.225 },
          { multiplier: 10, winningsBonus: 0.3 },
        ],
      },
    },

    {
      rarity: PerkRarity.EPIC,
      description: "onARollDescriptionEpic",
      assets: {
        small: "/assets/main/icons/perk_icons/on_a_roll/epic/on_a_roll_small_icon_epic.png",
        mid: "/assets/main/icons/perk_icons/on_a_roll/epic/on_a_roll_mid_icon_epic.png",
        big: "/assets/main/icons/perk_icons/on_a_roll/epic/on_a_roll_big_icon_epic.png",
      },
      config: {
        milestones: [
          { multiplier: 3, winningsBonus: 0.1 },
          { multiplier: 5, winningsBonus: 0.2 },
          { multiplier: 7, winningsBonus: 0.3 },
          { multiplier: 10, winningsBonus: 0.4 },
        ],
      },
    },

    {
      rarity: PerkRarity.LEGENDARY,
      description: "onARollDescriptionLegendary",
      assets: {
        small: "/assets/main/icons/perk_icons/on_a_roll/legendary/on_a_roll_small_icon_legendary.png",
        mid: "/assets/main/icons/perk_icons/on_a_roll/legendary/on_a_roll_mid_icon_legendary.png",
        big: "/assets/main/icons/perk_icons/on_a_roll/legendary/on_a_roll_big_icon_legendary.png",
      },
      config: {
        milestones: [
          { multiplier: 3, winningsBonus: 0.125 },
          { multiplier: 5, winningsBonus: 0.25 },
          { multiplier: 7, winningsBonus: 0.375 },
          { multiplier: 10, winningsBonus: 0.5 },
        ],
      },
    },
  ],
};