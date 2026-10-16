
import { DealerSkillData, DealerSkillId } from "../../DealerSkill";
import { DEALERS } from "../../DealerRegistry";
import {
  HousePhaseConfig,
  HOUSE_PHASE_ONE,
  HOUSE_PHASE_TWO,
  HOUSE_PHASE_THREE,
} from "./HousePhaseConfig";
import { DealerOddsProfile } from "../../../probability/OddsTypes";

type HousePhase = 1 | 2 | 3;

export class HousePhaseManager {
  private currentPhase: HousePhase = 1;

  private passiveSkill?: DealerSkillData;
  private activeSkill?: DealerSkillData;
  private forcedActiveSkillId?: DealerSkillId;

  startPhaseOne(): void {
    this.startPhase(1);
  }

  startPhaseTwo(): void {
    this.startPhase(2);
  }

  startPhaseThree(): void {
    this.startPhase(3);
  }

  
  forcePhase(
    phase: HousePhase,
    passiveSkillId: DealerSkillId,
    activeSkillId?: DealerSkillId,
  ): void {
    const config =
      phase === 1
        ? HOUSE_PHASE_ONE
        : phase === 2
          ? HOUSE_PHASE_TWO
          : HOUSE_PHASE_THREE;

    if (!config.passiveSkills.includes(passiveSkillId)) {
      throw new Error(
        `Invalid passive skill for House Phase ${phase}: ${passiveSkillId}`,
      );
    }

    if (
      activeSkillId !== undefined &&
      !config.activeSkills.includes(activeSkillId)
    ) {
      throw new Error(
        `Invalid active skill for House Phase ${phase}: ${activeSkillId}`,
      );
    }

    this.startPhase(phase, passiveSkillId, activeSkillId);
  }


  getCurrentPhase(): HousePhase {
    return this.currentPhase;
  }

  
  private startPhase(
    phase: HousePhase,
    forcedPassiveSkillId?: DealerSkillId,
    forcedActiveSkillId?: DealerSkillId,
  ): void {
    this.currentPhase = phase;

    const config = this.getCurrentPhaseConfig();

    this.forcedActiveSkillId = forcedActiveSkillId;

    this.passiveSkill = this.pickSkill(
      forcedPassiveSkillId === undefined
        ? config.passiveSkills
        : [forcedPassiveSkillId],
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

    this.activeSkill =
      this.forcedActiveSkillId === undefined
        ? this.pickSkill(availableSkills)
        : this.pickSkill([this.forcedActiveSkillId]);

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
    switch (this.currentPhase) {
      case 1:
        return HOUSE_PHASE_ONE;

      case 2:
        return HOUSE_PHASE_TWO;

      case 3:
        return HOUSE_PHASE_THREE;
    }
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
