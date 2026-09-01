import { DealerData } from "./DealerData";
import { BEN_DATA } from "./data/junior_dealers/Ben";
import { ZACK_DATA } from "./data/junior_dealers/Zack";
import { BECKY_DATA } from "./data/junior_dealers/Becky";
import { JOHNNY_DATA } from "./data/junior_dealers/Johnny";
import { MELANIE_DATA } from "./data/junior_dealers/Melanie";
import { HILLARY_DATA } from "./data/mid_dealers/Hillary";
import { TIMOTHY_DATA } from "./data/mid_dealers/Timothy";
import { DealerGroup } from "./DealerGroup";
import { DealerRole } from "./DealerRole";

export const DEALERS: readonly DealerData[] = [
  BEN_DATA,
  ZACK_DATA,
  BECKY_DATA,
  JOHNNY_DATA, 
  MELANIE_DATA,
  HILLARY_DATA,
  TIMOTHY_DATA,
];

export {
  BEN_DATA,
  ZACK_DATA,
  BECKY_DATA,
  JOHNNY_DATA,
  MELANIE_DATA,
  HILLARY_DATA,
  TIMOTHY_DATA,
};

export function getDealersByGroup(group: DealerGroup): readonly DealerData[] {
  return DEALERS.filter((dealer) => dealer.group === group);
}

export function getRegularDealersByGroup(
  group: DealerGroup,
): readonly DealerData[] {
  return DEALERS.filter(
    (dealer) => dealer.group === group && dealer.role === DealerRole.REGULAR,
  );
}

export function getSupervisorByGroup(
  group: DealerGroup,
): DealerData | undefined {
  return DEALERS.find(
    (dealer) => dealer.group === group && dealer.role === DealerRole.SUPERVISOR,
  );
}

export function getDealerById(dealerId: string): DealerData | undefined {
  return DEALERS.find((dealer) => dealer.id === dealerId);
}
