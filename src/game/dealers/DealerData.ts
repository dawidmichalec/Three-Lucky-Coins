import { TranslationKey } from "../../core/LocalizationManager";
import { DealerSkillData } from "./DealerSkill";
import { ObjectiveType } from "../objectives/ObjectiveTypes";
import { DealerGroup } from "./DealerGroup.ts";
import { DealerRole } from "./DealerRole.ts";
import { GoldenCoinSettings } from "../goldenCoins/GoldenCoinTypes.ts";
import { GambleForMoreSettings } from "../gambleForMore/GambleForMoreSettings.ts";
import { DealerOddsProfile } from "../probability/OddsTypes.ts";

export interface DealerData {
    id: string;

    name: string;
    title: TranslationKey;

    avatarNormal: string;
    avatarSmall: string;
    avatarLocked: string;

    signatureToken: string;

    group: DealerGroup;
    role: DealerRole;

    oddsProfile: DealerOddsProfile;

    objectiveType: ObjectiveType;
    objectiveValue: number;

    goldenCoinSettings?: Partial<GoldenCoinSettings>;
    gambleForMoreSettings?: Partial<GambleForMoreSettings>;

    skills: DealerSkillData[];

    dealerDescription: TranslationKey;
    saying: TranslationKey;
}