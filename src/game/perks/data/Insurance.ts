import { PerkData } from "../PerkData";
import { PerkRarity } from "../PerkRarity";

interface InsuranceConfig {
  streakReductionOnLoss: number;
}

export const INSURANCE_DATA: PerkData<InsuranceConfig> = {
  id: "insurance",

  name: "insuranceName",

  variants: [
    {
      rarity: PerkRarity.EPIC,

      description: "insuranceDescription",

      assets: {
        small:
          "/assets/main/icons/perk_icons/insurance/epic/insurance_small_icon_epic.png",
        mid: "/assets/main/icons/perk_icons/insurance/epic/insurance_mid_icon_epic.png",
        big: "/assets/main/icons/perk_icons/insurance/epic/insurance_big_icon_epic.png",
      },

      config: {
        streakReductionOnLoss: 1,
      },
    },
  ],
};
