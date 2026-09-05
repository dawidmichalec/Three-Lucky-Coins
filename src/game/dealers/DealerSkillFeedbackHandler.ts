import { DealerSkillId } from "./DealerSkill";
import { GameMessageOverlay } from "../../ui/overlays/GameMessageOverlay";

export class DealerSkillFeedbackHandler {
  constructor(private gameMessageOverlay: GameMessageOverlay) {}

  async handle(triggeredSkills: readonly DealerSkillId[]): Promise<void> {
    for (const skill of triggeredSkills) {
      switch (skill) {
        case DealerSkillId.OOPS_I_PAID_YOU_TWICE:
          await this.gameMessageOverlay.play("oopsIPaidYouTwiceSkillName");
          break;

        case DealerSkillId.ALMOST:
          await this.gameMessageOverlay.play("almostSkillName");
          break;

        case DealerSkillId.MANDATORY_TIP:
          await this.gameMessageOverlay.play("mandatoryTipSkillName");
          break;

        case DealerSkillId.MULTIPLIER_KNOCKOUT:
          await this.gameMessageOverlay.play("multiplierKnockoutSkillName");
          break;

        case DealerSkillId.MANDATORY_GAMBLE_FOR_MORE:
          await this.gameMessageOverlay.play("mandatoryGambleForMoreSkillName");
          break;

        case DealerSkillId.CLOSE_ENOUGH:
          await this.gameMessageOverlay.play("closeEnoughSkillName");
          break;
        
        case DealerSkillId.BET_VARIETY:
          await this.gameMessageOverlay.play("betVarietySkillName");
          break;

        case DealerSkillId.NO_REPEATS:
          await this.gameMessageOverlay.play("noRepeatsSkillName");
          break;
      }
    }
  }
}
