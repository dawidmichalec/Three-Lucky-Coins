import { TranslationKey } from "../../core/LocalizationManager";

export enum DealerSkillId {
  OOPS_I_PAID_YOU_TWICE = "oops_i_paid_you_twice",

  ALMOST = "almost",

  SLOWER_MULTIPLIER_GROWTH = "slower_multiplier_growth",

  MANDATORY_TIP = "mandatory_tip",

  MULTIPLIER_KNOCKOUT = "multiplier_knockout",

  MANDATORY_GAMBLE_FOR_MORE = "mandatory_gamble_for_more",

  CLOSE_ENOUGH = "close_enough",

  NO_SAME_BETS = "no_same_bets",

  BET_VARIETY = "bet_variety"

  // Kolejne skille w przyszłości...
}

export interface DealerSkillData {
  id: DealerSkillId;
  name: TranslationKey;
  description: TranslationKey;
  icon: string;
  triggerChance?: number;
}
