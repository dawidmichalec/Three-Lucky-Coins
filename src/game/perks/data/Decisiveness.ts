import { PerkData } from "../PerkData";
import { PerkRarity } from "../PerkRarity";

export type DecisivenessConfig = Record<string, never>;

export const DECISIVENESS_DATA: PerkData<DecisivenessConfig> = {
  id: "decisiveness",

  name: "decisivenessName",

  variants: [
    {
      rarity: PerkRarity.EPIC,

      description: "decisivenessDescription",

      assets: {
        small:
          "/assets/main/icons/perk_icons/decisiveness/epic/decisiveness_small_icon_epic.png",
        mid: "/assets/main/icons/perk_icons/decisiveness/epic/decisiveness_mid_icon_epic.png",
        big: "/assets/main/icons/perk_icons/decisiveness/epic/decisiveness_big_icon_epic.png",
      },

      config: {},
    },
  ],
};
