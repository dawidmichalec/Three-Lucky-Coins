import { Container } from "pixi.js";
import { Coin, CoinSide } from "./Coin";
import { CoinOutcome } from "../game/goldenCoins/GoldenCoinTypes";

export class CoinRow extends Container {

    private readonly spacing = 220;

    private coins: Coin[] = [];

    async init() {

        for (let i = 0; i < 3; i++) {

            const coin = new Coin();

            await coin.init();

            coin.position.set(
                i * this.spacing,
                0
            );

            this.coins.push(coin);

            this.addChild(coin);
        }
    }

    setResult(
        result: readonly CoinSide[]
    ) {

        result.forEach(
            (side, index) => {

                this.coins[index]
                    .setSide(side);

            }
        );
    }

    getResult(): CoinSide[] {

        return this.coins.map(
            coin => coin.getSide()
        );
    }

    getCoin(index: number): Coin {

        return this.coins[index];
    }

    toggleCoin(index: number) {

        this.coins[index].toggle();
    }

    async spin(
        result: readonly CoinOutcome[]
    ) {

        this.coins.forEach(
            coin => coin.startSpin()
        );

        result.forEach(
            (outcome, index) => {

                setTimeout(() => {

                    this.coins[index].reveal(
                        outcome.side,
                        outcome.isGolden
                    );

                }, (index + 1) * 500);

            }
        );

        await this.delay(2000);
    }

    private delay(ms: number) {

        return new Promise<void>(
            resolve => setTimeout(resolve, ms)
        );
    }

    update(delta: number) {

        this.coins.forEach(
            coin => coin.update(delta)
        );
    }
}