import {
    DealerOddsProfile,
    OddsVisibility
} from "./OddsTypes";


export const BEN_PROFILE:
    DealerOddsProfile = {

        visibility:
            OddsVisibility.EXACT,

        headsProbabilities: [
            0.02,
            0.05,
            0.10,
            0.90,
            0.95,
            0.98
        ]
    };


export const HILLARY_PROFILE:
    DealerOddsProfile = {

        visibility:
            OddsVisibility.EXACT,

        headsProbabilities: [
            0.10,
            0.25,
            0.75,
            0.90
        ]
    };