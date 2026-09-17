import { DealerData } from "./DealerData";
import { BEN_DATA } from "./data/junior_dealers/Ben";
import { ZACK_DATA } from "./data/junior_dealers/Zack";
import { BECKY_DATA } from "./data/junior_dealers/Becky";
import { JOHNNY_DATA } from "./data/junior_dealers/Johnny";
import { MELANIE_DATA } from "./data/junior_dealers/Melanie";
import { HILLARY_DATA } from "./data/mid_dealers/Hillary";
import { TIMOTHY_DATA } from "./data/mid_dealers/Timothy";
import { ALEX_DATA } from "./data/mid_dealers/Alex";
import { ANTHONY_DATA } from "./data/mid_dealers/Anthony";
import { BOBBY_DATA } from "./data/mid_dealers/Bobby";
import { LIZ_DATA } from "./data/mid_dealers/Liz";
import { SARAH_DATA } from "./data/mid_dealers/Sarah";
import { MIKE_DATA } from "./data/mid_dealers/Mike";
import { KIRK_DATA } from "./data/mid_dealers/Kirk";
import { TRISHA_DATA } from "./data/mid_dealers/Trisha";
import { BLAKE_DATA } from "./data/mid_dealers/Blake";
import { DEREK_DATA } from "./data/mid_dealers/Derek";
import { CINDY_DATA } from "./data/mid_dealers/Cindy";
import { ANDY_DATA } from "./data/junior_dealers/Andy";
import { TRACY_DATA } from "./data/junior_dealers/Tracy";
import { STEVE_DATA } from "./data/senior_dealers/Steve";
import { GARY_DATA } from "./data/senior_dealers/Gary";
import { CHARLIE_DATA } from "./data/senior_dealers/Charlie";
import { JESSICA_DATA } from "./data/senior_dealers/Jessica";
import { TED_DATA } from "./data/senior_dealers/Ted";
import { FINN_DATA } from "./data/senior_dealers/Finn";
import { JACOB_DATA } from "./data/junior_dealers/Jacob";
import { PAULIE_DATA } from "./data/senior_dealers/Paulie";
import { JACK_DATA } from "./data/senior_dealers/Jack";
import { JOSH_DATA } from "./data/senior_dealers/Josh";
import { PETER_DATA } from "./data/senior_dealers/Peter";
import { MARTY_DATA } from "./data/senior_dealers/Marty";
import { HENRY_DATA } from "./data/senior_dealers/Henry";
import { IVY_DATA } from "./data/senior_dealers/Ivy";
import { TLCM1_DATA } from "./data/machine_floor/TLCM1";
import { TLCM5_DATA } from "./data/machine_floor/TLCM5";
import { TLCM9_DATA } from "./data/machine_floor/TLCM9";
import { TLCM10_DATA } from "./data/machine_floor/TLCM10";
import { DealerGroup } from "./DealerGroup";
import { DealerRole } from "./DealerRole";


export const DEALERS: readonly DealerData[] = [
  BEN_DATA,
  ZACK_DATA,
  BECKY_DATA,
  JOHNNY_DATA,
  ANDY_DATA, 
  TRACY_DATA,
  MELANIE_DATA,
  JACOB_DATA,
  HILLARY_DATA,
  TIMOTHY_DATA,
  ALEX_DATA,
  ANTHONY_DATA,
  BOBBY_DATA,
  LIZ_DATA,
  SARAH_DATA,
  MIKE_DATA,
  KIRK_DATA,
  TRISHA_DATA,
  BLAKE_DATA,
  DEREK_DATA,
  CINDY_DATA,
  STEVE_DATA,
  GARY_DATA,
  CHARLIE_DATA,
  JESSICA_DATA,
  TED_DATA,
  FINN_DATA,
  PAULIE_DATA,
  JACK_DATA,
  JOSH_DATA,
  PETER_DATA,
  MARTY_DATA,
  HENRY_DATA,
  IVY_DATA,
  TLCM1_DATA,
  TLCM5_DATA,
  TLCM9_DATA,
  TLCM10_DATA
];

export {
  BEN_DATA,
  ZACK_DATA,
  BECKY_DATA,
  JOHNNY_DATA,
  ANDY_DATA,
  TRACY_DATA,
  MELANIE_DATA,
  JACOB_DATA,
  HILLARY_DATA,
  TIMOTHY_DATA,
  ALEX_DATA,
  ANTHONY_DATA,
  BOBBY_DATA,
  LIZ_DATA,
  SARAH_DATA,
  MIKE_DATA,
  KIRK_DATA,
  TRISHA_DATA,
  BLAKE_DATA,
  DEREK_DATA,
  CINDY_DATA,
  STEVE_DATA,
  GARY_DATA,
  CHARLIE_DATA,
  JESSICA_DATA,
  TED_DATA,
  FINN_DATA,
  PAULIE_DATA,
  JACK_DATA,
  JOSH_DATA,
  PETER_DATA,
  MARTY_DATA,
  HENRY_DATA,
  IVY_DATA,
  TLCM1_DATA,
  TLCM5_DATA,
  TLCM9_DATA,
  TLCM10_DATA
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

export function getDealerById(
  id: string,
): DealerData | undefined {
  return DEALERS.find(
    (dealer) => dealer.id === id,
  );
}
