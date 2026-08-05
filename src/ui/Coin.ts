import { Assets, Container, Sprite, Texture, Graphics } from 'pixi.js';

export enum CoinSide {
    Heads = 'H',
    Tails = 'T',
}

export class Coin extends Container {
    private sprite!: Sprite;

    private headsTexture!: Texture;
    private tailsTexture!: Texture;

    private goldenHeadsTexture!: Texture;
    private goldenTailsTexture!: Texture;

    private currentSide: CoinSide = CoinSide.Heads;

    private phase: 'idle' | 'spinning' | 'reveal' = 'idle';
    private speed = 0.2;

    private animationTextures: Texture[] = [];

    private currentFrame = 0;
    private frameTimer = 0;
    private frameSpeed = 2;

    private static counter = 0;

    private id: number;

    private goldenGlow!: Graphics;

    private readonly normalSize = 140;

    constructor() {
        super();

        this.id = Coin.counter++;
    }

    async init() {
        this.headsTexture = await Assets.load('/assets/main/heads.png');
        this.tailsTexture = await Assets.load('/assets/main/tails.png');

        this.goldenHeadsTexture = await Assets.load('/assets/main/golden_heads_icon.png');
        this.goldenTailsTexture = await Assets.load('/assets/main/golden_tails_icon.png');

        for (let i = 1; i <= 16; i++) {
            this.animationTextures.push(
                await Assets.load(
                    `/assets/main/icons/coin_animation_assets/coin_asset_${i}.png`
                )
            );
        }

        this.goldenGlow = new Graphics();

        this.goldenGlow
            .circle(0, 0, 115)
            .fill({
                color: 0xffd700,
                alpha: 1
            });

        this.goldenGlow.alpha = 0;
        this.goldenGlow.scale.set(0.8);

        this.addChild(this.goldenGlow);

        this.sprite = new Sprite(this.headsTexture);

        this.sprite.width = 140;
        this.sprite.height = 140;

        this.sprite.anchor.set(0.5);

        this.addChild(this.sprite);
       
    }

    setSide(side: CoinSide) {

        this.currentSide = side;

        this.sprite.texture =
            side === CoinSide.Heads
                ? this.headsTexture
                : this.tailsTexture;
    }

    toggle() {

        this.setSide(
            this.currentSide === CoinSide.Heads
                ? CoinSide.Tails
                : CoinSide.Heads
        );
    }

    getSide(): CoinSide {
        return this.currentSide;
    }

    startSpin() {

        this.phase = "spinning";

        this.currentFrame = 0;
        this.frameTimer = 0;

    }

    reveal(
        side: CoinSide,
        isGolden: boolean = false
    ) {

        if (isGolden) {
            return;
        }

        this.currentSide = side;

        this.sprite.texture =
            side === CoinSide.Heads
                ? this.headsTexture
                : this.tailsTexture;

        this.sprite.scale.set(1);

        this.goldenGlow.alpha = 0;
        this.goldenGlow.scale.set(0.8);

        this.phase = "idle";

        console.log(
            `COIN ${this.id}: REVEAL`,
            side
        );
    }


    async revealGolden(
        side: CoinSide,
        intensity: number = 1,
        onReveal?: () => void
    ) {

        await this.animateGoldenCharge(
            350 + intensity * 120,
            intensity
        );

        this.currentSide = side;

        this.sprite.texture =
            side === CoinSide.Heads
                ? this.goldenHeadsTexture
                : this.goldenTailsTexture;

        this.sprite.width =
            this.normalSize;

        this.sprite.height =
            this.normalSize;

        this.phase = "idle";

        /*
            Ten callback wykonuje się dokładnie
            w momencie pojawienia się Golden Coin.
        */

        onReveal?.();

        await this.animateGoldenReveal(
            intensity
        );

        console.log(
            `COIN ${this.id}: REVEAL`,
            side === CoinSide.Heads
                ? "GH"
                : "GT"
        );
    }


    private animateGoldenCharge(
        duration: number,
        intensity: number
    ): Promise<void> {

        return new Promise(resolve => {

            const startTime =
                performance.now();

            const animate = (
                currentTime: number
            ) => {

                const progress =
                    Math.min(
                        1,
                        (currentTime - startTime) /
                        duration
                    );

                /*
                    Glow narasta i pulsuje.
                */

                const pulse =
                    Math.sin(
                        progress *
                        Math.PI *
                        (4 + intensity)
                    );

                this.goldenGlow.alpha =
                    progress *
                    Math.min(
                        0.9,
                        0.45 + intensity * 0.12
                );

                this.goldenGlow.scale.set(
                    0.8 +
                    progress * 0.35 +
                    pulse * 0.04
                );

                /*
                    Sama moneta lekko pulsuje.
                */

                const spriteScale =
                    1 +
                    Math.max(0, pulse) *
                    0.04 *
                    intensity;

                this.sprite.scale.set(
                    spriteScale
                );

                if (progress < 1) {

                    requestAnimationFrame(
                        animate
                    );

                    return;
                }

                this.sprite.scale.set(1);

                resolve();
            };

            requestAnimationFrame(
                animate
            );
        });
    }


    private animateGoldenReveal(
        intensity: number
    ): Promise<void> {

        return new Promise(resolve => {

            const duration =
                260 + intensity * 80;

            const startTime =
                performance.now();

            const animate = (
                currentTime: number
            ) => {

                const progress =
                    Math.min(
                        1,
                        (currentTime - startTime) /
                        duration
                    );

                /*
                    Najpierw powiększenie,
                    potem powrót.
                */

                const punch =
                    Math.sin(
                        progress * Math.PI
                    );

                const scale =
                    1 +
                    punch *
                    (0.08 + intensity * 0.035);

                this.sprite.scale.set(scale);

                /*
                    Glow po reveal stopniowo zanika.
                */

                this.goldenGlow.alpha =
                    (1 - progress) *
                    (0.55 + intensity * 0.1);

                this.goldenGlow.scale.set(
                    1.1 +
                    progress *
                    (0.25 + intensity * 0.08)
                );

                if (progress < 1) {

                    requestAnimationFrame(
                        animate
                    );

                    return;
                }

                this.sprite.scale.set(1);

                this.goldenGlow.alpha = 0;
                this.goldenGlow.scale.set(0.8);

                resolve();
            };

            requestAnimationFrame(
                animate
            );
        });
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