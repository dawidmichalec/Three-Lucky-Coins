import { TranslationKey } from "../../core/LocalizationManager";

export enum DealerSkillId {
    SLOWER_MULTIPLIER_GROWTH =
        "slower_multiplier_growth",

    MANDATORY_TIP =
        "mandatory_tip",

    // Kolejne skille w przyszłości...
}

export interface DealerSkillData {
    id: DealerSkillId;
    name: TranslationKey;
    description: TranslationKey;
}