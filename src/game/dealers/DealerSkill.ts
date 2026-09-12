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

  BET_VARIETY = "bet_variety",

  NO_REPEATS = "no_repeats",

  NO_DUPLICATES = "no_duplicates",

  SMALL_HOUSE_CUT = "small_house_cut",

  TIME_IS_MONEY = "time_is_money",

  VARIETY_PAYS = "variety_pays",

  MILESTONE_BONUS = "milestone_bonus",

  BETTER_PAY_FOR_NOT_THE_SAME = "better_pay_for_not_the_same",

  SWITCH_IT_UP = "switch_it_up",

  TIME_IS_MONEY_PLUS = "time_is_money_plus",

  HOUSE_CUT = "house_cut",

  HABIT_BREAKER = "habit_breaker",

  PATTERN_BREAKER = "pattern_breaker",

  DEJA_VU = "deja_vu"

  // Kolejne skille w przyszłości...
}

export interface DealerSkillData {
  id: DealerSkillId;
  name: TranslationKey;
  description: TranslationKey;
  icon: string;
  triggerChance?: number;
  timeLimit?: number;
}
