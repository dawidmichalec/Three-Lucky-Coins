import { Assets, Container, Sprite, Texture } from 'pixi.js';

export enum CoinSide {
    Heads = 'H',
    Tails = 'T',
}

export class Coin extends Container {
    private sprite!: Sprite;

    private headsTexture!: Texture;
    private tailsTexture!: Texture;

    private currentSide: CoinSide = 'H';

    private phase: 'idle' | 'spinning' | 'reveal' = 'idle';
    private speed = 0.2;

    async init() {
        this.headsTexture = await Assets.load('/assets/main/heads.png');
        this.tailsTexture = await Assets.load('/assets/main/tails.png');

        this.sprite = new Sprite(this.headsTexture);

        this.sprite.width = 100;
        this.sprite.height = 100;

        this.sprite.anchor.set(0.5);

        this.addChild(this.sprite);
    }

    setSide(side: CoinSide) {
        this.currentSide = side;

        this.sprite.texture =
            side === 'H'
                ? this.headsTexture
                : this.tailsTexture;
    }

    toggle() {
        this.setSide(
            this.currentSide === 'H'
                ? 'T'
                : 'H'
        );
    }

    getSide(): CoinSide {
        return this.currentSide;
    }

    startSpin() {
        this.phase = 'spinning';
        this.sprite.rotation = 0;
    }

    reveal(side: CoinSide) {
        this.setSide(side);
        this.phase = 'idle';
    }

    update(delta: number) {
        if (this.phase === 'idle') return;

        if (this.phase === 'spinning') {
            this.sprite.rotation += 0.5 * delta;
        }

        if (this.phase === 'reveal') {
            this.sprite.rotation += 0.3 * delta;

            // “snap” do przodu (opcjonalnie później easing)
        }
    }
}