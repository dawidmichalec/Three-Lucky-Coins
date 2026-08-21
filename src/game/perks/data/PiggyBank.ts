import { PerkData } from "../PerkData";
import { PerkRarity } from "../PerkRarity";

export interface PiggyBankConfig {
  uses: number;
}

export const PIGGY_BANK_DATA: PerkData<PiggyBankConfig> = {
  id: "piggy_bank",

  name: "piggyBankName",

  variants: [
    {
      rarity: PerkRarity.EPIC,

      description: "piggyBankDescription",

      assets: {
        small:
          "/assets/main/icons/perk_icons/piggy_bank/epic/piggy_bank_small_icon_epic.png",
        mid: "/assets/main/icons/perk_icons/piggy_bank/epic/piggy_bank_mid_icon_epic.png",
        big: "/assets/main/icons/perk_icons/piggy_bank/epic/piggy_bank_big_icon_epic.png",
      },

      config: {
        uses: 1,
      },
    },
  ],
};
