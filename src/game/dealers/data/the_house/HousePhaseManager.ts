
import { DealerSkillData, DealerSkillId } from "../../DealerSkill";
import { DEALERS } from "../../DealerRegistry";
import {
  HousePhaseConfig,
  HOUSE_PHASE_ONE,
  HOUSE_PHASE_TWO,
} from "./HousePhaseConfig";
import { DealerOddsProfile } from "../../../probability/OddsTypes";

type HousePhase = 1 | 2;

export class HousePhaseManager {
  private currentPhase: HousePhase = 1;

  private passiveSkill?: DealerSkillData;
  private activeSkill?: DealerSkillData;

  startPhaseOne(): void {
    this.startPhase(1);
  }

  startPhaseTwo(): void {
    this.startPhase(2);
  }

  getCurrentPhase(): HousePhase {
    return this.currentPhase;
  }

  private startPhase(phase: HousePhase): void {
    this.currentPhase = phase;

    const config = this.getCurrentPhaseConfig();

    this.passiveSkill = this.pickSkill(
      config.passiveSkills,
    );

    console.log(
      `THE HOUSE PHASE ${phase} PASSIVE:`,
      this.passiveSkill.id,
    );

    this.activeSkill = undefined;

    this.prepareNextRound();
  }

  prepareNextRound(): void {
    if (!this.passiveSkill) {
      throw new Error("The House phase has not started.");
    }

    const config = this.getCurrentPhaseConfig();

    const availableSkills = config.activeSkills.filter(
      (skillId) => skillId !== this.activeSkill?.id,
    );

    this.activeSkill = this.pickSkill(availableSkills);

    console.log(
      `THE HOUSE PHASE ${this.currentPhase} ACTIVE:`,
      this.activeSkill.id,
    );
  }

  getCurrentSkills(): [DealerSkillData, DealerSkillData] {
    if (!this.passiveSkill || !this.activeSkill) {
      throw new Error(
        "The House skills have not been initialized.",
      );
    }

    return [this.passiveSkill, this.activeSkill];
  }

  getCurrentOddsProfile(): DealerOddsProfile {
    return this.getCurrentPhaseConfig().oddsProfile;
  }

  private getCurrentPhaseConfig(): HousePhaseConfig {
    return this.currentPhase === 1
      ? HOUSE_PHASE_ONE
      : HOUSE_PHASE_TWO;
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
      throw new Error(`Dealer skill not found: ${skillId}`);
    }

    return skill;
  }
}
