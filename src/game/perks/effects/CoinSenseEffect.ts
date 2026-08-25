import { RunPerkManager } from "../RunPerkManager";
import { CoinSenseConfig } from "../data/CoinSense";
import { roundMoney } from "../../util/MoneyUtils";
import { CoinSide } from "../../../ui/Coin";


export interface CoinSenseResult {
  triggered: boolean;
  baseWinAmount: number;
  bonusAmount: number;
  finalWinAmount: number;
  payoutMultiplier: number;
}

export class CoinSenseEffect {
    private tossesUsedThisFight = 0;
    private preparedResult?: CoinSide[];

    constructor(
        private readonly runPerkManager: RunPerkManager,
    ) {}

    prepareResult(result: CoinSide[]): void {
        this.preparedResult = result;
    }

    consumePreparedResult(): CoinSide[] | undefined {
        const result = this.preparedResult;

        this.preparedResult = undefined;

        return result;
    }

    isAvailable(): boolean {
        const coinSense =
            this.runPerkManager.getPerk("coin_sense");

        if (!coinSense) {
            return false;
        }

        const config =
            coinSense.variant.config as CoinSenseConfig;

        return (
            this.tossesUsedThisFight <
            config.revealedTossesPerFight
        );
    }

    consume(): void {
        if (!this.isAvailable()) {
            return;
        }

        this.tossesUsedThisFight++;
    }

    resetFight(): void {
        this.tossesUsedThisFight = 0;
        this.preparedResult = undefined;
    }

    apply(
        winAmount: number,
        wasActive: boolean,
        ): CoinSenseResult {
        const coinSense =
            this.runPerkManager.getPerk("coin_sense");

        if (!coinSense || !wasActive) {
            return {
            triggered: false,
            baseWinAmount: winAmount,
            bonusAmount: 0,
            finalWinAmount: winAmount,
            payoutMultiplier: 1,
            };
        }

        const config =
            coinSense.variant.config as CoinSenseConfig;

        const finalWinAmount = roundMoney(
            winAmount * config.payoutMultiplier,
        );

        const bonusAmount = roundMoney(
            finalWinAmount - winAmount,
        );

        return {
            triggered: true,
            baseWinAmount: winAmount,
            bonusAmount,
            finalWinAmount,
            payoutMultiplier: config.payoutMultiplier,
        };
    }
}