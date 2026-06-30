import { Container } from 'pixi.js';
import { Coin, CoinSide } from './Coin';

export class CoinRow extends Container {
    private readonly spacing = 180;
    private coins: Coin[] = [];

    async init() {
        for (let i = 0; i < 3; i++) {
            const coin = new Coin();

            await coin.init();

            coin.position.set(i * this.spacing, 0);

            this.coins.push(coin);
            this.addChild(coin);
        }
    }

    setResult(result: CoinSide[]) {
        result.forEach((side, index) => {
            this.coins[index].setSide(side);
        });
    }

    getResult(): CoinSide[] {
        return this.coins.map(coin => coin.getSide());
    }

    getCoin(index: number): Coin {
        return this.coins[index];
    }

    toggleCoin(index: number) {
        this.coins[index].toggle();
    }

    async spin(result: CoinSide[]) {
        this.coins.forEach(c => c.startSpin());

        result.forEach((side, i) => {
            setTimeout(() => {
                this.coins[i].reveal(side);
            }, i * 500);
        });

        // ważne: daj czas na animację
        await new Promise(res => setTimeout(res, 1500));
    }

    private delay(ms: number) {
        return new Promise(res => setTimeout(res, ms));
    }

    update(delta: number) {
        this.coins.forEach(c => c.update(delta));
    }
}