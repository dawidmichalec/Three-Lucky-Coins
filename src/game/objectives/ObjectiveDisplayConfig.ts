import { TranslationKey } from "../../core/LocalizationManager";
import { ObjectiveType } from "./ObjectiveTypes";

export enum ObjectiveDisplayMode {
  STATIC = "static",
  PROGRESS = "progress",
  BALANCE_TARGET = "balance_target",
}

export interface ObjectiveDisplayConfig {
  descriptionKey: TranslationKey;

  displayMode: ObjectiveDisplayMode;

  formatValue: (value: number) => string;
}

export const OBJECTIVE_DISPLAY_CONFIG: Record<
  ObjectiveType,
  ObjectiveDisplayConfig
> = {
  [ObjectiveType.INCREASE_BALANCE]: {
    descriptionKey: "increaseBalanceBy",

    displayMode:
      ObjectiveDisplayMode.BALANCE_TARGET,

    formatValue: (value) =>
      value.toFixed(2),
  },

  [ObjectiveType.REACH_MULTIPLIER]: {
    descriptionKey: "reachMultiplier",

    displayMode:
      ObjectiveDisplayMode.STATIC,

    formatValue: (value) =>
      `x${value}`,
  },

  [ObjectiveType.COLLECT_GOLDEN_COINS]: {
    descriptionKey: "collectGoldenCoins",

    displayMode:
      ObjectiveDisplayMode.PROGRESS,

    formatValue: (value) =>
      value.toString(),
  },

  [ObjectiveType.WIN_BETS]: {
    descriptionKey: "winBets",

    displayMode:
      ObjectiveDisplayMode.PROGRESS,

    formatValue: (value) =>
      value.toString(),
  },

  [ObjectiveType.WIN_GAMBLE_FOR_MORE]: {
    descriptionKey: "winGambleForMore",

    displayMode:
      ObjectiveDisplayMode.PROGRESS,

    formatValue: (value) =>
      value.toString(),
  },

  [ObjectiveType.SURVIVE_ROUNDS]: {
    descriptionKey: "surviveRounds",

    displayMode:
      ObjectiveDisplayMode.PROGRESS,

    formatValue: (value) =>
      value.toString(),
  },
};