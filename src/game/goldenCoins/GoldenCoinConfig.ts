export const DEFAULT_GOLDEN_COIN_SETTINGS = {
    enabled: true,
    baseChance: 0.025,
    chanceMultiplier: 1,
    maximumGoldenCoins: 3
};

export const GOLDEN_MULTIPLIERS: Record<number, number> = {
    0: 1,
    1: 10,
    2: 30,
    3: 100
};