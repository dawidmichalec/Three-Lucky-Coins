import { DealerSkillData, DealerSkillId } from "./DealerSkill";
import { TLCM2_2_DATA } from "../dealers/data/machine_floor/TCLM2_2"
import { TLCM2_3_DATA } from "../dealers/data/machine_floor/TLCM2_3";
import { TLCM3_2_DATA } from "../dealers/data/machine_floor/TLCM3_2";
import { TLCM3_3_DATA } from "../dealers/data/machine_floor/TLCM3_3";
import { TLCM3_4_DATA } from "../dealers/data/machine_floor/TLCM3_4";
import { TLCM4_DATA } from "../dealers/data/machine_floor/TLCM4";
import { TLCM5_DATA } from "../dealers/data/machine_floor/TLCM5";
import { TLCM6_1_DATA } from "../dealers/data/machine_floor/TLCM6_1";
import { TLCM6_2_DATA } from "../dealers/data/machine_floor/TLCM6_2";
import { TLCM7_1_DATA } from "../dealers/data/machine_floor/TLCM7_1";
import { TLCM7_2_DATA } from "../dealers/data/machine_floor/TLCM7_2";
import { TLCM7_3_DATA } from "../dealers/data/machine_floor/TLCM7_3";
import { TLCM8_1_DATA } from "../dealers/data/machine_floor/TLCM8_1";
import { TLCM9_DATA } from "../dealers/data/machine_floor/TLCM9";

const MACHINE_FLOOR_SKILLS: DealerSkillData[] = [
  ...TLCM2_2_DATA.skills,
  ...TLCM2_3_DATA.skills,
  ...TLCM3_2_DATA.skills,
  ...TLCM3_3_DATA.skills,
  ...TLCM3_4_DATA.skills,
  ...TLCM4_DATA.skills,
  ...TLCM5_DATA.skills,
  ...TLCM6_1_DATA.skills,
  ...TLCM6_2_DATA.skills,
  ...TLCM7_1_DATA.skills,
  ...TLCM7_2_DATA.skills,
  ...TLCM7_3_DATA.skills,
  ...TLCM8_1_DATA.skills,
  ...TLCM9_DATA.skills,
];

export function getMachineFloorSkill(skillId: DealerSkillId): DealerSkillData {
  const skill = MACHINE_FLOOR_SKILLS.find((skill) => skill.id === skillId);

  if (!skill) {
    throw new Error(`Machine Floor skill not found: ${skillId}`);
  }

  return skill;
}