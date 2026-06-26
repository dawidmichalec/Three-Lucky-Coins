import { Assets, Container, Sprite, Texture } from 'pixi.js';

export enum CoinSide {
    Heads = 'heads',
    Tails = 'tails',
}

export class Coin extends Container {
    private sprite!: Sprite;

    private headsTexture!: Texture;
    private tailsTexture!: Texture;

    private currentSide: CoinSide = 'heads';

    async init() {
        this.headsTexture = await Assets.load('/assets/main/heads.png');
        this.tailsTexture = await Assets.load('/assets/main/tails.png');

        this.sprite = new Sprite(this.headsTexture);

        this.sprite.anchor.set(0.5);

        this.addChild(this.sprite);
    }

    setSide(side: CoinSide) {
        this.currentSide = side;

        this.sprite.texture =
            side === 'heads'
                ? this.headsTexture
                : this.tailsTexture;
    }

    toggle() {
        this.setSide(
            this.currentSide === 'heads'
                ? 'tails'
                : 'heads'
        );
    }

    getSide(): CoinSide {
        return this.currentSide;
    }
}