import { PerkData } from "../PerkData";
import { PerkRarity } from "../PerkRarity";

export type SafetyNetConfig = Record<string, never>;

export const SAFETY_NET_DATA: PerkData<SafetyNetConfig> = {
  id: "safety_net",

  name: "safetyNetName",

  variants: [
    {
      rarity: PerkRarity.EPIC,

      description: "safetyNetDescription",

      assets: {
        small:
          "/assets/main/icons/perk_icons/safety_net/epic/safety_net_small_icon_epic.png",
        mid: "/assets/main/icons/perk_icons/safety_net/epic/safety_net_mid_icon_epic.png",
        big: "/assets/main/icons/perk_icons/safety_net/epic/safety_net_big_icon_epic.png",
      },

      config: {},
    },
  ],
};
