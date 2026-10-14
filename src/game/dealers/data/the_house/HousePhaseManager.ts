import { DealerSkillData, DealerSkillId } from "../../DealerSkill";
import { DEALERS } from "../../DealerRegistry";
import { HOUSE_PHASE_ONE } from "./HousePhaseConfig";
import { DealerOddsProfile } from "../../../probability/OddsTypes";

export class HousePhaseManager {
    private passiveSkill?: DealerSkillData;
    private activeSkill?: DealerSkillData;


    startPhaseOne(): void {
        this.passiveSkill = this.pickSkill(
            HOUSE_PHASE_ONE.passiveSkills,
        );

        console.log("THE HOUSE PASSIVE:", this.passiveSkill.id);

        this.activeSkill = undefined;

        this.prepareNextRound();
    }



    prepareNextRound(): void {
        if (!this.passiveSkill) {
            throw new Error("The House phase has not started.");
        }

        const availableSkills = HOUSE_PHASE_ONE.activeSkills.filter(
            (skillId) => skillId !== this.activeSkill?.id,
        );

        this.activeSkill = this.pickSkill(availableSkills);

        console.log("THE HOUSE ACTIVE:", this.activeSkill.id);
    }


    getCurrentSkills(): [DealerSkillData, DealerSkillData] {
        if (!this.passiveSkill || !this.activeSkill) {
            throw new Error("The House skills have not been initialized.");
        }

        return [this.passiveSkill, this.activeSkill];
    }

    getCurrentOddsProfile(): DealerOddsProfile {
        return HOUSE_PHASE_ONE.oddsProfile;
    }

    private pickSkill(
        pool: readonly DealerSkillId[],
    ): DealerSkillData {
        if (pool.length === 0) {
            throw new Error("The House skill pool is empty.");
        }

        const randomIndex = Math.floor(
            Math.random() * pool.length,
        );

        const skillId = pool[randomIndex];

        const skill = DEALERS
            .flatMap((dealer) => dealer.skills)
            .find((skill) => skill.id === skillId);

        if (!skill) {
            throw new Error(
                `Dealer skill not found: ${skillId}`,
            );
        }

        return skill;
    }
}
