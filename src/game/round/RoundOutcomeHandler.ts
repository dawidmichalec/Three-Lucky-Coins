import { AudioManager } from "../../core/AudioManager";
import { SoundId } from "../../audio/SoundId";
import { DealerData } from "../dealers/DealerData";
import { DealerSkillId } from "../dealers/DealerSkill";
import { roundMoney } from "../util/MoneyUtils";
import { StreakAction, StreakResolution } from "../streak/StreakResolution";


export interface RoundOutcomeData {
    win: boolean;
    winAmount?: number;
    currentDealer: DealerData;
}


export interface RoundOutcomeResult {
    wonAmount: number;
    triggeredSkills: DealerSkillId[];
    streakResolution: StreakResolution;
}


interface WinModifierResult {
    winAmount: number;
    triggeredSkills: DealerSkillId[];
}


export class RoundOutcomeHandler {

    private audioManager = AudioManager.getInstance();


    apply(data: RoundOutcomeData): RoundOutcomeResult {

        if (!data.win) {

            return {
                wonAmount: 0,
                triggeredSkills: [],

                streakResolution: {
                    action: StreakAction.RESET
                }
            };
        }


        if (data.winAmount === undefined) {
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


        const winModifierResult = this.applyWinModifiers(
            data.winAmount,
            data.currentDealer
        );


        return {
            wonAmount:
                winModifierResult.winAmount,

            triggeredSkills:
                winModifierResult.triggeredSkills,

            streakResolution: {
                action: StreakAction.INCREASE,

                value:
                    this.getStreakMultiplierGrowth(
                        data.currentDealer
                    )
            }
        };
    }


    private applyWinModifiers(
        winAmount: number,
        dealer: DealerData
    ): WinModifierResult {

        const triggeredSkills: DealerSkillId[] = [];

        let finalWinAmount = winAmount;


        const doublePayoutSkill = dealer.skills.find(
            skill =>
                skill.id ===
                DealerSkillId.OOPS_I_PAID_YOU_TWICE
        );


        if (doublePayoutSkill) {

            const triggerChance =
                doublePayoutSkill.triggerChance ?? 0;


            if (Math.random() < triggerChance) {

                finalWinAmount = roundMoney(
                    finalWinAmount * 2
                );

                triggeredSkills.push(
                    DealerSkillId.OOPS_I_PAID_YOU_TWICE
                );
            }
        }


        return {
            winAmount: finalWinAmount,
            triggeredSkills
        };
    }


    private getStreakMultiplierGrowth(
        dealer: DealerData
    ): number {

        const hasSlowerMultiplierGrowth = dealer.skills.some(
            skill =>
                skill.id ===
                DealerSkillId.SLOWER_MULTIPLIER_GROWTH
        );


        if (hasSlowerMultiplierGrowth) {
            return 0.5;
        }


        return 1;
    }
}