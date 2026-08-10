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


export const ZACK_PROFILE:
    DealerOddsProfile = {

        visibility:
            OddsVisibility.EXACT,

        headsProbabilities: [
            0.05,
            0.10,
            0.15,
            0.20,
            0.80,
            0.85,
            0.90,
            0.95
        ]
    };


export const BECKY_PROFILE:
    DealerOddsProfile = {

        visibility:
            OddsVisibility.EXACT,

        headsProbabilities: [
            0.10,
            0.15,
            0.20,
            0.80,
            0.85,
            0.90
        ]
    };


export const MELANIE_PROFILE:
    DealerOddsProfile = {

        visibility:
            OddsVisibility.EXACT,

        headsProbabilities: [
            0.15,
            0.20,
            0.80,
            0.85
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


export const TIMOTHY_PROFILE:
    DealerOddsProfile = {

        visibility:
            OddsVisibility.EXACT,

        headsProbabilities: [
            0.10,
            0.15,
            0.20,
            0.25,
            0.30,
            0.70,
            0.75,
            0.80,
            0.85,
            0.90
        ]
    };