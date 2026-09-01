import { DealerOddsProfile, OddsVisibility } from "./OddsTypes";

export const BEN_PROFILE: DealerOddsProfile = {
  visibility: OddsVisibility.EXACT,

  headsProbabilities: [0.02, 0.05, 0.1, 0.9, 0.95, 0.98],
};

export const ZACK_PROFILE: DealerOddsProfile = {
  visibility: OddsVisibility.EXACT,

  headsProbabilities: [0.05, 0.1, 0.15, 0.2, 0.8, 0.85, 0.9, 0.95],
};

export const BECKY_PROFILE: DealerOddsProfile = {
  visibility: OddsVisibility.EXACT,

  headsProbabilities: [0.1, 0.15, 0.2, 0.8, 0.85, 0.9],
};

export const MELANIE_PROFILE: DealerOddsProfile = {
  visibility: OddsVisibility.EXACT,

  headsProbabilities: [0.25, 0.3, 0.35, 0.65, 0.7, 0.75],
};

export const HILLARY_PROFILE: DealerOddsProfile = {
  visibility: OddsVisibility.EXACT,

  headsProbabilities: [0.1, 0.25, 0.75, 0.9],
};

export const TIMOTHY_PROFILE: DealerOddsProfile = {
  visibility: OddsVisibility.EXACT,

  headsProbabilities: [0.1, 0.15, 0.2, 0.25, 0.3, 0.7, 0.75, 0.8, 0.85, 0.9],
};
