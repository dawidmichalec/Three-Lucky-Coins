import { roundMoney } from "../../../util/MoneyUtils";

export function calculateRedBlackPotentialWin(
    currentWin: number,
    bet: number
): number {

    const winRatio = currentWin / bet;

    let multiplier: number;

    if (winRatio < 2) {
        multiplier = 4;
    } else if (winRatio < 5) {
        multiplier = 3;
    } else {
        multiplier = 2;
    }

    return roundMoney(
        currentWin * multiplier
    );
}