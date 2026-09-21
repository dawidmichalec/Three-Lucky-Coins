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

  DEJA_VU = "deja_vu",

  DELAYED_DECAY = "delayed_decay",

  MULTIPLIER_DECAY = "multiplier_decay",

  FORCED_RANDOM_TOSS = "forced_random_toss",

  HEADS_CURSE = "heads_curse",

  TAILS_CURSE = "tails_curse",

  BET_VALUE_MANIPULATION = "bet_value_manipulation",

  ADDITIONAL_COIN_TOSS = "additional_coin_toss",

  KEEP_IT_MOVING = "keep_it_moving",

  MY_WAY_OR_THE_HIGHWAY = "my_way_or_the_highway",

  GOLDEN_COINS_NOT_SUPPORTED = "golden_coins_not_supported",

  BALANCE_MODULE_MALFUNCTION = "balance_module_malfunction",

  PROLONGED_TOSS_ANIMATION = "prolonged_toss_animation",

  FIXED_BET_LOCK = "fixed_bet_lock",

  BET_SLOT_MALFUNCTION = "bet_slot_malfunction",

  DYNAMIC_BET_LOCK = "dynamic_bet_lock",

  REVERSED_BET_CHOICE = "reversed_bet_choice",

  BET_INCREASE_LOCK = "bet_increase_lock",

  BET_DECREASE_LOCK = "bet_decrease_lock",

  BET_DEDUCTION_SYSTEM_MALFUNCTION = "bet_deduction_system_malfunction",

  MULTIPLIER_SYSTEM_MALFUNCTION = "multiplier_system_malfunction",

  HARD_MULTIPLIER_RESET = "hard_multiplier_reset"

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
