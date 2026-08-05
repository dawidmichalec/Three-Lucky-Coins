import { TranslationKey } from "../../core/LocalizationManager";
import { DealerSkillData } from "./DealerSkill";
import { ObjectiveType } from "../objectives/ObjectiveTypes";

export interface DealerData {
    id: string;

    name: string;
    title: TranslationKey;

    avatarNormal: string;
    avatarSmall: string;

    objectiveType: ObjectiveType;
    objectiveValue: number;

    skills: DealerSkillData[];

    dealerDescription: TranslationKey;
    saying: TranslationKey;
}