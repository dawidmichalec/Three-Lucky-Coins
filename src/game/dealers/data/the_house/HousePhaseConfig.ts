
import { DealerSkillId } from "../../DealerSkill";
import { DealerOddsProfile } from "../../../probability/OddsTypes";
import { THE_HOUSE_PROFILE_PHASE_1, THE_HOUSE_PROFILE_PHASE_2, } from "../../../probability/DealerOddsProfiles";

export interface HousePhaseConfig {
  oddsProfile: DealerOddsProfile;
  passiveSkills: readonly DealerSkillId[];
  activeSkills: readonly DealerSkillId[];
}

export const HOUSE_PHASE_ONE: HousePhaseConfig = {
  oddsProfile: THE_HOUSE_PROFILE_PHASE_1,

  passiveSkills: [
    DealerSkillId.SLOWER_MULTIPLIER_GROWTH,
    DealerSkillId.MANDATORY_TIP,
    DealerSkillId.SMALL_HOUSE_CUT,
    DealerSkillId.WINNING_TAX,
  ],

  activeSkills: [
    DealerSkillId.TIME_IS_MONEY,
    DealerSkillId.REVERSED_BET_CHOICE,
    DealerSkillId.BET_INCREASE_LOCK,
    DealerSkillId.BET_DECREASE_LOCK,
    DealerSkillId.HIGH_STAKES,
    DealerSkillId.FIXED_BET_LOCK,
  ],
};


export const HOUSE_PHASE_TWO: HousePhaseConfig = {
  oddsProfile: THE_HOUSE_PROFILE_PHASE_2,

  passiveSkills: [
    DealerSkillId.MULTIPLIER_KNOCKOUT,
    DealerSkillId.NO_DUPLICATES,
    DealerSkillId.HOUSE_CUT,
    DealerSkillId.HABIT_BREAKER,
  ],

  activeSkills: [
    DealerSkillId.FORCED_RANDOM_TOSS,
    DealerSkillId.TIME_IS_MONEY_PLUS,
    DealerSkillId.BET_SLOT_MALFUNCTION,
    DealerSkillId.DYNAMIC_BET_LOCK,
    DealerSkillId.RANDOM_COMBINATION_BLOCK,
    DealerSkillId.MY_WAY_OR_THE_HIGHWAY,
  ],
};

