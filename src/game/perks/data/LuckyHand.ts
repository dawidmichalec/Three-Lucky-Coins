import { PerkData } from "../PerkData";
import { PerkRarity } from "../PerkRarity";

export interface LuckyHandConfig {
  triggerEvery: number;
  payoutMultiplier: number;
}

export const LUCKY_HAND_DATA: PerkData<LuckyHandConfig> = {
  id: "lucky_hand",

  name: "luckyHandName",

  variants: [
    {
      rarity: PerkRarity.RARE,

      description: "luckyHandDescription",

      assets: {
        small:
          "/assets/main/icons/perk_icons/lucky_hand/rare/lucky_hand_small_icon_rare.png",
        mid: "/assets/main/icons/perk_icons/lucky_hand/rare/lucky_hand_mid_icon_rare.png",
        big: "/assets/main/icons/perk_icons/lucky_hand/rare/lucky_hand_big_icon_rare.png",
      },

      config: {
        triggerEvery: 5,
        payoutMultiplier: 2,
      },
    },
  ],
};
