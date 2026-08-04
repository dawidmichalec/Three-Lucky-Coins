import { CoinSide } from "../../ui/Coin";
import {
    CoinOutcome,
    GoldenCoinSettings
} from "./GoldenCoinTypes";
import {
    DEFAULT_GOLDEN_COIN_SETTINGS,
    GOLDEN_MULTIPLIERS
} from "./GoldenCoinConfig";

export class GoldenCoinManager {

    private static instance: GoldenCoinManager;

    private settings: GoldenCoinSettings = {
        ...DEFAULT_GOLDEN_COIN_SETTINGS
    };

    private forcedGoldenCount?: number;

    static getInstance() {

        if (!GoldenCoinManager.instance) {
            GoldenCoinManager.instance =
                new GoldenCoinManager();
        }

        return GoldenCoinManager.instance;
    }

    private constructor() {}

    applyGoldenCoins(
        baseResult: readonly CoinSide[]
    ): CoinOutcome[] {

        const outcomes: CoinOutcome[] =
            baseResult.map(side => ({
                side,
                isGolden: false
            }));


        if (!this.settings.enabled) {
            return outcomes;
        }

        if (this.forcedGoldenCount !== undefined) {

            const count = this.forcedGoldenCount;

            this.forcedGoldenCount = undefined;

            return this.applyForcedGoldenCoins(
                outcomes,
                count
            );
        }

        const effectiveChance =
            this.getEffectiveChance();

        let goldenCount = 0;

        for (const outcome of outcomes) {

            if (
                goldenCount >=
                this.settings.maximumGoldenCoins
            ) {
                break;
            }

            if (Math.random() < effectiveChance) {

                outcome.isGolden = true;

                goldenCount++;
            }
        }

        return outcomes;
    }

    private getEffectiveChance(): number {

        if (!this.settings.enabled) {
            return 0;
        }

        return Math.max(
            0,
            Math.min(
                1,
                this.settings.baseChance *
                this.settings.chanceMultiplier
            )
        );
    }

    getGoldenMultiplier(
        outcomes: readonly CoinOutcome[]
    ): number {

        const goldenCount =
            outcomes.filter(
                outcome => outcome.isGolden
            ).length;

        return GOLDEN_MULTIPLIERS[goldenCount];
    }

    setEnabled(enabled: boolean) {

        this.settings.enabled = enabled;
    }

    setChanceMultiplier(multiplier: number) {

        this.settings.chanceMultiplier =
            Math.max(0, multiplier);
    }

    setMaximumGoldenCoins(maximum: number) {

        this.settings.maximumGoldenCoins =
            Math.max(
                0,
                Math.min(3, maximum)
            );
    }

    forceNextGoldenCount(count: number) {

        this.forcedGoldenCount =
            Math.max(
                0,
                Math.min(3, count)
            );
    }

    reset() {

        this.settings = {
            ...DEFAULT_GOLDEN_COIN_SETTINGS
        };

        this.forcedGoldenCount = undefined;
    }

    private applyForcedGoldenCoins(
        outcomes: CoinOutcome[],
        requestedCount: number
    ): CoinOutcome[] {

        const count =
            Math.min(
                requestedCount,
                outcomes.length
            );

        const availableIndexes =
            outcomes.map(
                (_, index) => index
            );

        for (let i = 0; i < count; i++) {

            const randomPosition =
                Math.floor(
                    Math.random() *
                    availableIndexes.length
                );

            const outcomeIndex =
                availableIndexes.splice(
                    randomPosition,
                    1
                )[0];

            outcomes[outcomeIndex].isGolden =
                true;
        }

        return outcomes;
    }
}