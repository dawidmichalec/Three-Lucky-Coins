import { DealerOddsProfile, OddsVisibility } from "./OddsTypes";

export const BEN_PROFILE: DealerOddsProfile = {
    visibility: OddsVisibility.EXACT,
    complexity: "easy",
};

export const HILLARY_PROFILE: DealerOddsProfile = {
    visibility: OddsVisibility.WORDS,
    complexity: "medium",
};

export const TOMMY_PROFILE: DealerOddsProfile = {
    visibility: OddsVisibility.RANGE,
    complexity: "hard",
};