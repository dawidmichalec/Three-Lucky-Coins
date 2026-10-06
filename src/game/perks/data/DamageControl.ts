import { PerkData } from "../PerkData";
import { PerkRarity } from "../PerkRarity";

export interface DamageControlConfig {
  penaltyReduction: number;
}

export const DAMAGE_CONTROL_DATA: PerkData<DamageControlConfig> = {
  id: "damage_control",
  name: "damageControlName",
  variants: [
    {
      rarity: PerkRarity.COMMON,
      description: "damageControlDescriptionCommon",
      assets: {
        small: "/assets/main/icons/perk_icons/damage_control/common/damage_control_small_icon_common.png",
        mid: "/assets/main/icons/perk_icons/damage_control/common/damage_control_mid_icon_common.png",
        big: "/assets/main/icons/perk_icons/damage_control/common/damage_control_big_icon_common.png",
      },
      config: {
        penaltyReduction: 0.025,
      },
    },
    {
      rarity: PerkRarity.UNCOMMON,
      description: "damageControlDescriptionUncommon",
      assets: {
        small: "/assets/main/icons/perk_icons/damage_control/uncommon/damage_control_small_icon_uncommon.png",
        mid: "/assets/main/icons/perk_icons/damage_control/uncommon/damage_control_mid_icon_uncommon.png",
        big: "/assets/main/icons/perk_icons/damage_control/uncommon/damage_control_big_icon_uncommon.png",
      },
      config: {
        penaltyReduction: 0.05,
      },
    },
    {
      rarity: PerkRarity.RARE,
      description: "damageControlDescriptionRare",
      assets: {
        small: "/assets/main/icons/perk_icons/damage_control/rare/damage_control_small_icon_rare.png",
        mid: "/assets/main/icons/perk_icons/damage_control/rare/damage_control_mid_icon_rare.png",
        big: "/assets/main/icons/perk_icons/damage_control/rare/damage_control_big_icon_rare.png",
      },
      config: {
        penaltyReduction: 0.075,
      },
    },
    {
      rarity: PerkRarity.EPIC,
      description: "damageControlDescriptionEpic",
      assets: {
        small: "/assets/main/icons/perk_icons/damage_control/epic/damage_control_small_icon_epic.png",
        mid: "/assets/main/icons/perk_icons/damage_control/epic/damage_control_mid_icon_epic.png",
        big: "/assets/main/icons/perk_icons/damage_control/epic/damage_control_big_icon_epic.png",
      },
      config: {
        penaltyReduction: 0.1,
      },
    },
    {
      rarity: PerkRarity.LEGENDARY,
      description: "damageControlDescriptionLegendary",
      assets: {
        small: "/assets/main/icons/perk_icons/damage_control/legendary/damage_control_small_icon_legendary.png",
        mid: "/assets/main/icons/perk_icons/damage_control/legendary/damage_control_mid_icon_legendary.png",
        big: "/assets/main/icons/perk_icons/damage_control/legendary/damage_control_big_icon_legendary.png",
      },
      config: {
        penaltyReduction: 0.125,
      },
    },
  ],
};