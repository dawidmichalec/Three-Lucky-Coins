import { roundMoney } from "./util/MoneyUtils";

export interface FrozenWin {
    id: number;
    amount: number;
    roundsRemaining: number;
    justFrozen: boolean;
}

export interface SecurityCheckResolution {
    id: number;
    amount: number;
    accepted: boolean;
}

export class SecurityCheckManager {
    private frozenWins: FrozenWin[] = [];

    private nextId = 1;

    freezeWin(
        amount: number,
        rounds: number = 3,
    ): FrozenWin {
        const frozenWin: FrozenWin = {
            id: this.nextId++,
            amount: roundMoney(amount),
            roundsRemaining: rounds,
            justFrozen: true,
        };

        this.frozenWins.push(frozenWin);

        console.log(
            `SECURITY CHECK: WIN ${frozenWin.amount.toFixed(2)} FROZEN`,
        );

        this.logFrozenWins();

        return frozenWin;
    }

    advanceRound(
        acceptChance: number,
    ): SecurityCheckResolution[] {
        const resolutions: SecurityCheckResolution[] = [];

        for (const frozenWin of this.frozenWins) {
            if (frozenWin.justFrozen) {
                frozenWin.justFrozen = false;
                continue;
            }

            frozenWin.roundsRemaining--;

            if (frozenWin.roundsRemaining > 0) {
                continue;
            }

            const accepted =
                Math.random() < acceptChance;

            resolutions.push({
                id: frozenWin.id,
                amount: frozenWin.amount,
                accepted,
            });
        }

        for (const resolution of resolutions) {
            console.log(
                `SECURITY CHECK: WIN ${resolution.amount.toFixed(2)} ${resolution.accepted
                    ? "ACCEPTED"
                    : "DECLINED"
                }`,
            );
        }

        const resolvedIds = new Set(
            resolutions.map(
                (resolution) => resolution.id,
            ),
        );

        this.frozenWins =
            this.frozenWins.filter(
                (frozenWin) =>
                    !resolvedIds.has(frozenWin.id),
            );

        this.logFrozenWins();

        return resolutions;
    }

    getFrozenWins(): readonly FrozenWin[] {
        return this.frozenWins;
    }

    hasFrozenWins(): boolean {
        return this.frozenWins.length > 0;
    }

    reset(): void {
        this.frozenWins = [];
        this.nextId = 1;
    }

    private logFrozenWins(): void {
        console.log("FROZEN WINS:");

        if (this.frozenWins.length === 0) {
            console.log("NONE");
            return;
        }

        for (const frozenWin of this.frozenWins) {
            console.log(
                `${frozenWin.amount.toFixed(2)} — ${frozenWin.roundsRemaining} rounds remaining`,
            );
        }
    }
}