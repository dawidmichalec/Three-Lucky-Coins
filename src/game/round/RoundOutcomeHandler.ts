import { AudioManager } from "../../core/AudioManager";
import { SoundId } from "../../audio/SoundId";
import { DealerData } from "../dealers/DealerData";
import { DealerSkillId } from "../dealers/DealerSkill";


export interface RoundOutcomeData {

    win: boolean;

    winAmount?: number;

    currentDealer: DealerData;

    currentStreakMultiplier: number;
}


export interface RoundOutcomeResult {

    newStreakMultiplier: number;

    wonAmount: number;
}


export class RoundOutcomeHandler {

    private audioManager =
        AudioManager.getInstance();


    apply(
        data: RoundOutcomeData
    ): RoundOutcomeResult {

        if (!data.win) {

            return {
                newStreakMultiplier: 1,
                wonAmount: 0
            };
        }


        if (
            data.winAmount ===
            undefined
        ) {

            throw new Error(
                "Winning round has no win amount."
            );
        }


        this.audioManager.play(
            SoundId.WIN,
            {
                loop: false,
                volume: 0.7
            }
        );


        return {

            newStreakMultiplier:
                data.currentStreakMultiplier +
                this.getStreakMultiplierGrowth(
                    data.currentDealer
                ),

            wonAmount:
                data.winAmount
        };
    }


    private getStreakMultiplierGrowth(
        dealer: DealerData
    ): number {

        const hasSlowerMultiplierGrowth =
            dealer.skills.some(
                skill =>
                    skill.id ===
                    DealerSkillId
                        .SLOWER_MULTIPLIER_GROWTH
            );


        if (
            hasSlowerMultiplierGrowth
        ) {

            return 0.5;
        }


        return 1;
    }
}