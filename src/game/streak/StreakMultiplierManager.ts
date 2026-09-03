import { DEFAULT_STREAK_MULTIPLIER_SETTINGS } from "./StreakMultiplierConfig";
import { StreakAction, StreakResolution } from "./StreakResolution";

export class StreakMultiplierManager {
  private currentValue = DEFAULT_STREAK_MULTIPLIER_SETTINGS.baseValue;

  private baseValue = DEFAULT_STREAK_MULTIPLIER_SETTINGS.baseValue;

  private growthPerWin = DEFAULT_STREAK_MULTIPLIER_SETTINGS.growthPerWin;

  applyResolution(resolution: StreakResolution) {
    switch (resolution.action) {
      case StreakAction.INCREASE:
        this.increase(resolution.growthModifier ?? 1);

        break;

      case StreakAction.DECREASE:
        this.decrease(resolution.value ?? 0);

        break;

      case StreakAction.RESET:
        this.reset();

        break;

      case StreakAction.NONE:
        break;
    }
  }

  getValue(): number {
    return this.currentValue;
  }

  setValue(value: number) {
    this.currentValue = value;
  }

  getBaseValue(): number {
    return this.baseValue;
  }

  setBaseValue(value: number) {
    this.baseValue = value;
  }

  getGrowthPerWin(): number {
    return this.growthPerWin;
  }

  setGrowthPerWin(value: number) {
    this.growthPerWin = value;
  }

  increase(growthModifier = 1) {
    this.currentValue += this.growthPerWin * growthModifier;
  }

  decrease(amount: number) {
    this.currentValue = Math.max(
      Math.min(this.baseValue, this.currentValue),
      this.currentValue - amount,
    );
  }

  reset() {
    this.currentValue = this.baseValue;
  }

  knockOut() {
    this.currentValue =
      DEFAULT_STREAK_MULTIPLIER_SETTINGS.baseValue;
  }

  resetAll() {
    this.baseValue = DEFAULT_STREAK_MULTIPLIER_SETTINGS.baseValue;

    this.growthPerWin = DEFAULT_STREAK_MULTIPLIER_SETTINGS.growthPerWin;

    this.reset();
  }
}