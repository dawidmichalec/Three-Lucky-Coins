import { PerkData } from "../PerkData";
import { PerkRarity } from "../PerkRarity";

export interface DoubleDownConfig {
  requiredSuccessfulSpins: number;
  betMultiplier: number;
}

export const DOUBLE_DOWN_DATA: PerkData<DoubleDownConfig> = {
  id: "double_down",

  name: "doubleDownName",

  variants: [
    {
      rarity: PerkRarity.RARE,

      description: "doubleDownDescription",

      assets: {
        small:
          "/assets/main/icons/perk_icons/double_down/rare/double_down_small_icon_rare.png",
        mid: "/assets/main/icons/perk_icons/double_down/rare/double_down_mid_icon_rare.png",
        big: "/assets/main/icons/perk_icons/double_down/rare/double_down_big_icon_rare.png",
      },

      config: {
        requiredSuccessfulSpins: 3,
        betMultiplier: 2,
      },
    },
  ],
};
