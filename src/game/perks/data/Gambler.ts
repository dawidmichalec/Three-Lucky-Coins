import { PerkData } from "../PerkData";
import { PerkRarity } from "../PerkRarity";

export interface GamblerConfig {
  payoutMultiplier: number;
}

export const GAMBLER_DATA: PerkData<GamblerConfig> = {
  id: "gambler",

  name: "gamblerName",

  variants: [
    {
      rarity: PerkRarity.COMMON,

      description: "gamblerDescriptionCommon",

      assets: {
        small: "/assets/main/icons/perk_icons/gambler/common/gambler_small_icon_common.png",
        mid: "/assets/main/icons/perk_icons/gambler/common/gambler_mid_icon_common.png",
        big: "/assets/main/icons/perk_icons/gambler/common/gambler_big_icon_common.png",
      },

      config: {
        payoutMultiplier: 1.2,
      },
    },

    {
      rarity: PerkRarity.UNCOMMON,

      description: "gamblerDescriptionUncommon",

      assets: {
        small: "/assets/main/icons/perk_icons/gambler/uncommon/gambler_small_icon_uncommon.png",
        mid: "/assets/main/icons/perk_icons/gambler/uncommon/gambler_mid_icon_uncommon.png",
        big: "/assets/main/icons/perk_icons/gambler/uncommon/gambler_big_icon_uncommon.png",
      },

      config: {
        payoutMultiplier: 1.3,
      },
    },

    {
      rarity: PerkRarity.RARE,

      description: "gamblerDescriptionRare",

      assets: {
        small: "/assets/main/icons/perk_icons/gambler/rare/gambler_small_icon_rare.png",
        mid: "/assets/main/icons/perk_icons/gambler/rare/gambler_mid_icon_rare.png",
        big: "/assets/main/icons/perk_icons/gambler/rare/gambler_big_icon_rare.png",
      },

      config: {
        payoutMultiplier: 1.4,
      },
    },

    {
      rarity: PerkRarity.EPIC,

      description: "gamblerDescriptionEpic",

      assets: {
        small: "/assets/main/icons/perk_icons/gambler/epic/gambler_small_icon_epic.png",
        mid: "/assets/main/icons/perk_icons/gambler/epic/gambler_mid_icon_epic.png",
        big: "/assets/main/icons/perk_icons/gambler/epic/gambler_big_icon_epic.png",
      },

      config: {
        payoutMultiplier: 1.5,
      },
    },

    {
      rarity: PerkRarity.LEGENDARY,

      description: "gamblerDescriptionLegendary",

      assets: {
        small: "/assets/main/icons/perk_icons/gambler/legendary/gambler_small_icon_legendary.png",
        mid: "/assets/main/icons/perk_icons/gambler/legendary/gambler_mid_icon_legendary.png",
        big: "/assets/main/icons/perk_icons/gambler/legendary/gambler_big_icon_legendary.png",
      },

      config: {
        payoutMultiplier: 1.75,
      },
    },
  ],
};
