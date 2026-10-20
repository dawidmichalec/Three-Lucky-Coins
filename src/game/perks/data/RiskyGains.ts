import { PerkData } from "../PerkData";
import { PerkRarity } from "../PerkRarity";

export const RISKY_GAINS_THRESHOLDS = [2, 3, 5, 7, 10];

export interface RiskyGainsConfig {
  winningsBonuses: number[];
}

export const RISKY_GAINS_DATA: PerkData<RiskyGainsConfig> = {
  id: "risky_gains",
  name: "riskyGainsName",
  isStackable: true,

  variants: [
    {
      rarity: PerkRarity.COMMON,
      description: "riskyGainsDescriptionCommon",
      assets: {
        small: "/assets/main/icons/perk_icons/risky_gains/common/risky_gains_small_icon_common.png",
        mid: "/assets/main/icons/perk_icons/risky_gains/common/risky_gains_mid_icon_common.png",
        big: "/assets/main/icons/perk_icons/risky_gains/common/risky_gains_big_icon_common.png",
      },
      config: {
        winningsBonuses: [0.025, 0.05, 0.075, 0.10, 0.125],
      },
    },
    {
      rarity: PerkRarity.UNCOMMON,
      description: "riskyGainsDescriptionUncommon",
      assets: {
        small: "/assets/main/icons/perk_icons/risky_gains/uncommon/risky_gains_small_icon_uncommon.png",
        mid: "/assets/main/icons/perk_icons/risky_gains/uncommon/risky_gains_mid_icon_uncommon.png",
        big: "/assets/main/icons/perk_icons/risky_gains/uncommon/risky_gains_big_icon_uncommon.png",
      },
      config: {
        winningsBonuses: [0.05, 0.10, 0.15, 0.20, 0.25],
      },
    },
    {
      rarity: PerkRarity.RARE,
      description: "riskyGainsDescriptionRare",
      assets: {
        small: "/assets/main/icons/perk_icons/risky_gains/rare/risky_gains_small_icon_rare.png",
        mid: "/assets/main/icons/perk_icons/risky_gains/rare/risky_gains_mid_icon_rare.png",
        big: "/assets/main/icons/perk_icons/risky_gains/rare/risky_gains_big_icon_rare.png",
      },
      config: {
        winningsBonuses: [0.075, 0.15, 0.225, 0.30, 0.375],
      },
    },
    {
      rarity: PerkRarity.EPIC,
      description: "riskyGainsDescriptionEpic",
      assets: {
        small: "/assets/main/icons/perk_icons/risky_gains/epic/risky_gains_small_icon_epic.png",
        mid: "/assets/main/icons/perk_icons/risky_gains/epic/risky_gains_mid_icon_epic.png",
        big: "/assets/main/icons/perk_icons/risky_gains/epic/risky_gains_big_icon_epic.png",
      },
      config: {
        winningsBonuses: [0.10, 0.20, 0.30, 0.40, 0.50],
      },
    },
    {
      rarity: PerkRarity.LEGENDARY,
      description: "riskyGainsDescriptionLegendary",
      assets: {
        small: "/assets/main/icons/perk_icons/risky_gains/legendary/risky_gains_small_icon_legendary.png",
        mid: "/assets/main/icons/perk_icons/risky_gains/legendary/risky_gains_mid_icon_legendary.png",
        big: "/assets/main/icons/perk_icons/risky_gains/legendary/risky_gains_big_icon_legendary.png",
      },
      config: {
        winningsBonuses: [0.125, 0.25, 0.375, 0.50, 0.625],
      },
    },
  ],
};