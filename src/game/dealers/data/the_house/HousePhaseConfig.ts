
import { DealerSkillId } from "../../DealerSkill";
import { DealerOddsProfile } from "../../../probability/OddsTypes";
import { THE_HOUSE_PROFILE_PHASE_1 } from "../../../probability/DealerOddsProfiles";

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
