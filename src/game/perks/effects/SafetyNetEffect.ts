import { RunPerkManager } from "../RunPerkManager";
import { CoinSide } from "../../../ui/Coin";

export class SafetyNetEffect {
    private consecutiveLosses = 0;
    private preparedResult?: CoinSide[];

    constructor(private readonly runPerkManager: RunPerkManager) { }

    recordRoundResult(win: boolean): void {
        if (!this.runPerkManager.hasPerk("safety_net")) {
            return;
        }

        if (win) {
            this.consecutiveLosses = 0;
            return;
        }

        this.consecutiveLosses++;
    }

    isReady(): boolean {
        return this.runPerkManager.hasPerk("safety_net") && this.consecutiveLosses >= 3;
    }

    consume(): void {
        if (!this.isReady()) {
            return;
        }

        this.consecutiveLosses = 0;
    }

    prepareResult(result: CoinSide[]): void {
        if (!this.isReady()) {
            return;
        }

        this.preparedResult = [...result];
    }

    consumePreparedResult(): CoinSide[] | undefined {
        if (!this.preparedResult) {
            return undefined;
        }

        const result = this.preparedResult;
        this.preparedResult = undefined;
        this.consume();

        return result;
    }

    getPreparedResult(): CoinSide[] | undefined {
        return this.preparedResult;
    }

    reset(): void {
        this.consecutiveLosses = 0;
        this.preparedResult = undefined;
    }
}