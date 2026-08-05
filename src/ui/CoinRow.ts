import { Container } from "pixi.js";
import { Coin, CoinSide } from "./Coin";
import { CoinOutcome } from "../game/goldenCoins/GoldenCoinTypes";
import { AudioManager } from "../core/AudioManager";
import { SoundId } from "../audio/SoundId";
import { AUDIO_TIMINGS } from "../audio/AudioTimings";

export class CoinRow extends Container {

    private readonly spacing = 220;

    private coins: Coin[] = [];

    private audioManager = AudioManager.getInstance();

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

        this.audioManager.play(
            SoundId.SPIN_START,
            {
                volume: 0.5
            }
        );

        /*
            Uruchamiamy środkowy loop niezależnie.
            Nie zatrzymujemy przez to animacji.
        */
        const middleStartPromise =
            this.startMiddleLoop();

        try {

            await this.revealResult(result);

        } finally {

            /*
                Czekamy, aż ewentualne opóźnione
                uruchomienie loopa się wykona,
                żeby nie wystartował po stop().
            */
            await middleStartPromise;

            this.audioManager.stop(
                SoundId.SPIN_MIDDLE
            );
        }
    }


    private async startMiddleLoop() {

        await this.delay(
            AUDIO_TIMINGS.SPIN_MIDDLE_START
        );

        this.audioManager.play(
            SoundId.SPIN_MIDDLE,
            {
                loop: true,
                volume: 0.5
            }
        );
    }


    private async revealResult(
        result: readonly CoinOutcome[]
    ) {

        const goldenCount =
            result.filter(
                outcome =>
                    outcome.isGolden
            ).length;

        let revealedGoldenCoins = 0;

        for (
            let index = 0;
            index < result.length;
            index++
        ) {

            const outcome =
                result[index];

            const isLastCoin =
                index === result.length - 1;

            await this.delay(500);

            if (!outcome.isGolden) {

                if (isLastCoin) {

                    this.audioManager.stop(
                        SoundId.SPIN_MIDDLE
                    );

                }

                this.audioManager.play(
                    SoundId.COIN_LAND,
                    {
                        volume: 0.7
                    }
                );

                this.coins[index].reveal(
                    outcome.side
                );

                continue;
            }

            revealedGoldenCoins++;

            let intensity =
                revealedGoldenCoins;

            if (
                goldenCount === 3 &&
                revealedGoldenCoins === 3
            ) {
                intensity = 4;
            }

            await this.delay(
                250 +
                intensity * 150
            );

            await this.coins[index]
                .revealGolden(
                    outcome.side,
                    intensity,
                    () => {

                        if (isLastCoin) {

                            this.audioManager.stop(
                                SoundId.SPIN_MIDDLE
                            );

                        }

                        this.audioManager.play(
                            SoundId.COIN_LAND,
                            {
                                volume:
                                    Math.min(
                                        1,
                                        0.7 +
                                        intensity * 0.05
                                    )
                            }
                        );

                    }
                );
        }

        await this.delay(
            goldenCount > 0
                ? 450
                : 250
        );
    }


    private playAndWait(
        soundId: SoundId,
        volume = 1
    ): Promise<void> {

        return new Promise(resolve => {

            this.audioManager.play(
                soundId,
                {
                    volume,
                    complete: () => {
                        resolve();
                    }
                }
            );
        });
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