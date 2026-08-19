import { PERKS } from "../PerkRegistry";
import { PerkReward } from "./PerkReward";
import { RunPerkRewardState } from "./RunPerkRewardState";

export class PerkRewardGenerator {

    private forcedPerkId?: string;

    generate(
        state: RunPerkRewardState,
        count = 3
    ): readonly PerkReward[] {

        const availableRewards =
            this.getAvailableRewards(
                state
            );


        if (
            availableRewards.length <
            count
        ) {

            throw new Error(
                `Not enough unshown perk rewards. Requested: ${count}, available: ${availableRewards.length}.`
            );
        }


        const selectedRewards:
            PerkReward[] = [];


        if (this.forcedPerkId) {

            const forcedReward =
                availableRewards.find(
                    reward =>
                        reward.perk.id ===
                        this.forcedPerkId
                );


            if (!forcedReward) {

                console.warn(
                    `Forced perk reward "${this.forcedPerkId}" is not available.`
                );

            } else {

                selectedRewards.push(
                    forcedReward
                );
            }


            this.forcedPerkId =
                undefined;
        }


        const remainingRewards =
            availableRewards.filter(
                reward =>
                    !selectedRewards.includes(
                        reward
                    )
            );


        const shuffledRewards =
            this.shuffle(
                remainingRewards
            );


        selectedRewards.push(
            ...shuffledRewards.slice(
                0,
                count -
                selectedRewards.length
            )
        );


        for (
            const reward
            of selectedRewards
        ) {

            state.markAsShown(
                reward.perk.id,
                reward.variant.rarity
            );
        }


        return selectedRewards;
    }


    private getAvailableRewards(
        state: RunPerkRewardState
    ): PerkReward[] {

        const rewards: PerkReward[] = [];


        for (const perk of PERKS) {

            for (
                const variant
                of perk.variants
            ) {

                if (
                    state.hasBeenShown(
                        perk.id,
                        variant.rarity
                    )
                ) {
                    continue;
                }


                rewards.push({
                    perk,
                    variant
                });
            }
        }


        return rewards;
    }


    private shuffle<T>(
        items: readonly T[]
    ): T[] {

        const result = [
            ...items
        ];


        for (
            let i =
                result.length - 1;

            i > 0;

            i--
        ) {

            const randomIndex =
                Math.floor(
                    Math.random() *
                    (i + 1)
                );


            [
                result[i],
                result[randomIndex]
            ] = [
                result[randomIndex],
                result[i]
            ];
        }


        return result;
    }

    forceNextPerk(
        perkId: string
    ): void {

        this.forcedPerkId =
            perkId;
    }

}