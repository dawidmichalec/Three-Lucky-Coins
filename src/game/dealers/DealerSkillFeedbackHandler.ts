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

        case DealerSkillId.NO_DUPLICATES:
          await this.gameMessageOverlay.play("noDuplicatesSkillName");
          break;

        case DealerSkillId.SMALL_HOUSE_CUT:
          await this.gameMessageOverlay.play("smallHouseCutSkillName");
          break;

        case DealerSkillId.TIME_IS_MONEY:
          await this.gameMessageOverlay.play("timeIsMoneySkillName");
          break;

        case DealerSkillId.VARIETY_PAYS:
          await this.gameMessageOverlay.play("varietyPaysSkillName");
          break;

        case DealerSkillId.MILESTONE_BONUS:
          await this.gameMessageOverlay.play("milestoneBonusSkillName");
          break;

        case DealerSkillId.BETTER_PAY_FOR_NOT_THE_SAME:
          await this.gameMessageOverlay.play("betterPayForNotTheSameSkillName");
          break;

        case DealerSkillId.SWITCH_IT_UP:
          await this.gameMessageOverlay.play("switchItUpSkillName");
          break;

        case DealerSkillId.TIME_IS_MONEY_PLUS:
          await this.gameMessageOverlay.play("timeIsMoneyPlusSkillName");
          break;

        case DealerSkillId.HOUSE_CUT:
          await this.gameMessageOverlay.play("houseCutSkillName");
          break;

        case DealerSkillId.HABIT_BREAKER:
          await this.gameMessageOverlay.play("habitBreakerSkillName");
          break;

        case DealerSkillId.PATTERN_BREAKER:
          await this.gameMessageOverlay.play("patternBreakerSkillName");
          break;

        case DealerSkillId.DEJA_VU:
          await this.gameMessageOverlay.play("dejaVuSkillName");
          break;

        case DealerSkillId.HEADS_CURSE:
          await this.gameMessageOverlay.play("headsCurseSkillName");
          break;

        case DealerSkillId.TAILS_CURSE:
          await this.gameMessageOverlay.play("tailsCurseSkillName");
          break;

        case DealerSkillId.BET_VALUE_MANIPULATION:
          await this.gameMessageOverlay.play("betValueManipulationSkillName");
          break;

        case DealerSkillId.ADDITIONAL_COIN_TOSS:
          await this.gameMessageOverlay.play("additionalCoinTossSkillName");
          break;

        case DealerSkillId.BALANCE_MODULE_MALFUNCTION:
          await this.gameMessageOverlay.play("balanceModuleMalfunctionSkillName");
          break;

        case DealerSkillId.BET_DEDUCTION_SYSTEM_MALFUNCTION:
          await this.gameMessageOverlay.play("betDeductionSystemMalfunctionSkillName");
          break;
      }
    }
  }
}
