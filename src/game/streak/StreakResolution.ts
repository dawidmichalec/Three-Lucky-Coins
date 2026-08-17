export enum StreakAction {
    INCREASE = "increase",
    DECREASE = "decrease",
    RESET = "reset",
    NONE = "none"
}


export interface StreakResolution {
    action: StreakAction;
    value?: number;
}