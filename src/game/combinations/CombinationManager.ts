import {
    COMBINATION_CONFIGS
} from "../data/CoinCombinations";

import {
    CombinationId
} from "../data/CombinationId";

import {
    CombinationModifiers,
    createDefaultCombinationModifiers
} from "./CombinationModifiers";

export class CombinationManager {

    private static instance:
        CombinationManager;

    private modifiers:
        Record<
            CombinationId,
            CombinationModifiers
        >;

    static getInstance() {

        if (!CombinationManager.instance) {

            CombinationManager.instance =
                new CombinationManager();

        }

        return CombinationManager.instance;
    }

    private constructor() {

        this.modifiers =
            this.createDefaultModifiers();

    }

    private createDefaultModifiers():
        Record<
            CombinationId,
            CombinationModifiers
        > {

        return Object.values(CombinationId)
            .reduce(
                (result, id) => {

                    result[id] =
                        createDefaultCombinationModifiers();

                    return result;

                },
                {} as Record<
                    CombinationId,
                    CombinationModifiers
                >
            );
    }

    reset() {

        this.modifiers =
            this.createDefaultModifiers();
    }

    getModifiers(
        id: CombinationId
    ): CombinationModifiers {

        return this.modifiers[id];
    }

    getFinalMultiplier(
        id: CombinationId
    ): number {

        const config =
            COMBINATION_CONFIGS[id];

        const modifiers =
            this.modifiers[id];

        return Math.max(
            0,
            config.baseMultiplier +
            modifiers.multiplierBonus
        );
    }

    getFinalWinningsMultiplier(
        id: CombinationId
    ): number {

        const modifier =
            this.modifiers[id]
                .winningsPercentModifier;

        return Math.max(
            0,
            1 + modifier
        );
    }

    getProbabilityWeight(
        id: CombinationId
    ): number {

        const modifiers =
            this.modifiers[id];

        if (modifiers.blocked) {
            return 0;
        }

        return Math.max(
            0,
            modifiers.probabilityWeight
        );
    }

    addMultiplierBonus(
        id: CombinationId,
        value: number
    ) {

        this.modifiers[id]
            .multiplierBonus += value;
    }

    addWinningsPercentModifier(
        id: CombinationId,
        value: number
    ) {

        this.modifiers[id]
            .winningsPercentModifier += value;
    }

    multiplyProbabilityWeight(
        id: CombinationId,
        multiplier: number
    ) {

        this.modifiers[id]
            .probabilityWeight *= multiplier;
    }

    setBlocked(
        id: CombinationId,
        blocked: boolean
    ) {

        this.modifiers[id]
            .blocked = blocked;
    }
}