import { PerkData } from "../PerkData";
import { PerkRarity } from "../PerkRarity";

export type UnderdogConfig = {
  lowBalanceBonus: number;
  criticalBalanceBonus: number;
};

export const UNDERDOG_DATA: PerkData<UnderdogConfig> = {
  id: "underdog",
  name: "underdogName",
  variants: [
    {
      rarity: PerkRarity.COMMON,
      description: "underdogDescriptionCommon",
      assets: {
        small: "/assets/main/icons/perk_icons/underdog/common/underdog_small_icon_common.png",
        mid: "/assets/main/icons/perk_icons/underdog/common/underdog_mid_icon_common.png",
        big: "/assets/main/icons/perk_icons/underdog/common/underdog_big_icon_common.png",
      },
      config: {
        lowBalanceBonus: 0.05,
        criticalBalanceBonus: 0.15,
      },
    },
    {
      rarity: PerkRarity.UNCOMMON,
      description: "underdogDescriptionUncommon",
      assets: {
        small: "/assets/main/icons/perk_icons/underdog/uncommon/underdog_small_icon_uncommon.png",
        mid: "/assets/main/icons/perk_icons/underdog/uncommon/underdog_mid_icon_uncommon.png",
        big: "/assets/main/icons/perk_icons/underdog/uncommon/underdog_big_icon_uncommon.png",
      },
      config: {
        lowBalanceBonus: 0.075,
        criticalBalanceBonus: 0.175,
      },
    },
    {
      rarity: PerkRarity.RARE,
      description: "underdogDescriptionRare",
      assets: {
        small: "/assets/main/icons/perk_icons/underdog/rare/underdog_small_icon_rare.png",
        mid: "/assets/main/icons/perk_icons/underdog/rare/underdog_mid_icon_rare.png",
        big: "/assets/main/icons/perk_icons/underdog/rare/underdog_big_icon_rare.png",
      },
      config: {
        lowBalanceBonus: 0.10,
        criticalBalanceBonus: 0.20,
      },
    },
    {
      rarity: PerkRarity.EPIC,
      description: "underdogDescriptionEpic",
      assets: {
        small: "/assets/main/icons/perk_icons/underdog/epic/underdog_small_icon_epic.png",
        mid: "/assets/main/icons/perk_icons/underdog/epic/underdog_mid_icon_epic.png",
        big: "/assets/main/icons/perk_icons/underdog/epic/underdog_big_icon_epic.png",
      },
      config: {
        lowBalanceBonus: 0.125,
        criticalBalanceBonus: 0.225,
      },
    },
    {
      rarity: PerkRarity.LEGENDARY,
      description: "underdogDescriptionLegendary",
      assets: {
        small: "/assets/main/icons/perk_icons/underdog/legendary/underdog_small_icon_legendary.png",
        mid: "/assets/main/icons/perk_icons/underdog/legendary/underdog_mid_icon_legendary.png",
        big: "/assets/main/icons/perk_icons/underdog/legendary/underdog_big_icon_legendary.png",
      },
      config: {
        lowBalanceBonus: 0.15,
        criticalBalanceBonus: 0.25,
      },
    },
  ],
};