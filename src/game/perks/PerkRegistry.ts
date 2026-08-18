import { PerkData } from "./PerkData";

import { MULTIPLIER_BOOSTER_DATA } from "./data/MultiplierBooster";
import { CASINO_BONUS_DATA } from "./data/CasinoBonus";
import { PIGGY_BANK_DATA } from "./data/PiggyBank";
import { COIN_SENSE_DATA } from "./data/CoinSense";
import { RISK_TAKER_DATA } from "./data/RiskTaker";
import { GAMBLER_DATA } from "./data/Gambler";
import { INSURANCE_DATA } from "./data/Insurance";
import { DOUBLE_DOWN_DATA } from "./data/DoubleDown";
import { LUCKY_HAND_DATA } from "./data/LuckyHand";


export const PERKS:
readonly PerkData[] = [

    MULTIPLIER_BOOSTER_DATA,
    CASINO_BONUS_DATA,
    PIGGY_BANK_DATA,
    COIN_SENSE_DATA,
    RISK_TAKER_DATA,
    GAMBLER_DATA,
    INSURANCE_DATA,
    DOUBLE_DOWN_DATA,
    LUCKY_HAND_DATA
];


export function getPerkById(
    perkId: string
): PerkData | undefined {

    return PERKS.find(
        perk =>
            perk.id === perkId
    );
}