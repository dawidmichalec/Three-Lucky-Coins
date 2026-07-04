import { Assets, Container, Sprite, Texture } from 'pixi.js';
import { sound, Sound } from '@pixi/sound';

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

    private animationTextures: Texture[] = [];

    private currentFrame = 0;
    private frameTimer = 0;
    private frameSpeed = 2;

    private spinSound!: Sound;

    async init() {
        this.headsTexture = await Assets.load('/assets/main/heads.png');
        this.tailsTexture = await Assets.load('/assets/main/tails.png');

        // Zamiast Assets.load, używamy bezpośrednio sound.add
        this.spinSound = sound.add('coin_spin', {
            url: '/assets/main/sounds/coin_roll_sound.mp3',
            preload: true // od razu zacznie pobierać plik
        });

        for (let i = 1; i <= 16; i++) {
            this.animationTextures.push(
                await Assets.load(
                    `/assets/main/icons/coin_animation_assets/coin_asset_${i}.png`
                )
            );
        }

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
        this.phase = "spinning";

        this.currentFrame = 0;
        this.frameTimer = 0;

        if (this.spinSound) {
            this.spinSound.play({ 
                loop: false, 
                volume: 0.5,
                start: 0.9
            });
        }
    }

    reveal(side: CoinSide) {
        this.setSide(side);
        this.phase = 'idle';

        // ZATRZYMANIE DŹWIĘKU po zakończeniu kręcenia
        if (this.spinSound) {
            this.spinSound.stop();
        }
    }

    update(delta: number) {
        if (this.phase === "spinning") {

            this.frameTimer += delta;

            if (this.frameTimer >= this.frameSpeed) {

                this.frameTimer = 0;

                this.currentFrame++;

                if (this.currentFrame >= this.animationTextures.length) {
                    this.currentFrame = 0;
                }

                this.sprite.texture =
                    this.animationTextures[this.currentFrame];
            }
        }
    }
}