export enum ObjectiveType {
  INCREASE_BALANCE = "increase_balance",

  SURVIVE_ROUNDS = "survive_rounds",

  WIN_BETS = "win_bets",

  REACH_MULTIPLIER = "reach_multiplier",

  COLLECT_GOLDEN_COINS = "collect_golden_coins",

  WIN_GAMBLE_FOR_MORE = "win_gamble_for_more"
}

export interface ObjectiveProgress {
  current: number;
  target: number;
}
