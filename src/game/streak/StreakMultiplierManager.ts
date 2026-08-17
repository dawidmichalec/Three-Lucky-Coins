import { DEFAULT_STREAK_MULTIPLIER_SETTINGS } from "./StreakMultiplierConfig";

export class StreakMultiplierManager {

    private currentValue =
        DEFAULT_STREAK_MULTIPLIER_SETTINGS.baseValue;

    private baseValue =
        DEFAULT_STREAK_MULTIPLIER_SETTINGS.baseValue;

    private growthPerWin =
        DEFAULT_STREAK_MULTIPLIER_SETTINGS.growthPerWin;


    getValue(): number {
        return this.currentValue;
    }


    setValue(value: number) {
        this.currentValue = value;
    }


    getBaseValue(): number {
        return this.baseValue;
    }


    getGrowthPerWin(): number {
        return this.growthPerWin;
    }


    setGrowthPerWin(value: number) {
        this.growthPerWin = value;
    }


    increase(growthModifier = 1) {

        this.currentValue +=
            this.growthPerWin *
            growthModifier;
    }


    decrease(amount: number) {

        this.currentValue = Math.max(
            this.baseValue,
            this.currentValue - amount
        );
    }


    reset() {
        this.currentValue = this.baseValue;
    }


    resetAll() {

        this.baseValue =
            DEFAULT_STREAK_MULTIPLIER_SETTINGS.baseValue;

        this.growthPerWin =
            DEFAULT_STREAK_MULTIPLIER_SETTINGS.growthPerWin;

        this.reset();
    }
}