import {
    Container,
    Graphics
} from "pixi.js";

import {
    LocalizedText
} from "../../localization/LocalizedText";


export class GameOverOverlay extends Container {

    private readonly barHeight = 245;

    private background: Graphics;

    private gameOverLabel: LocalizedText;

    private animationFrameId?: number;

    private isAnimating = false;


    constructor(
        private screenWidth: number,
        private screenHeight: number
    ) {

        super();

        this.eventMode = "static";
        this.cursor = "default";

        this.visible = false;
        this.alpha = 0;


        this.background =
            new Graphics()
                .rect(
                    0,
                    0,
                    this.screenWidth,
                    this.barHeight
                )
                .fill({
                    color: 0x000000,
                    alpha: 0.8
                });


        this.background.position.set(
            0,
            (
                this.screenHeight -
                this.barHeight
            ) / 2
        );


        this.gameOverLabel =
            new LocalizedText(
                "gameOver",
                {
                    /*
                        Na razie możesz zostawić
                        Anek Kannada dla GAME OVER,
                        bo tutaj nie ma polskich znaków.
                    */
                    fontFamily:
                        "Anek-Kannada Bold",

                    fontSize: 92,

                    fontWeight: "bold",

                    fill: 0xff2b2b,

                    dropShadow: {
                        alpha: 1,
                        blur: 18,
                        color: "#990000",
                        distance: 0
                    }
                }
            );


        this.gameOverLabel.anchor.set(
            0.5
        );


        this.gameOverLabel.position.set(
            this.screenWidth / 2,
            this.screenHeight / 2
        );


        this.addChild(
            this.background,
            this.gameOverLabel
        );
    }


    async play(
        visibleDuration = 1300
    ): Promise<void> {

        if (this.isAnimating) {
            return;
        }

        this.isAnimating = true;

        this.visible = true;
        this.alpha = 0;

        this.gameOverLabel.scale.set(
            0.88
        );


        await this.fadeIn(
            350
        );


        await this.delay(
            visibleDuration
        );


        await this.fadeOut(
            450
        );


        this.visible = false;
        this.alpha = 0;

        this.gameOverLabel.scale.set(
            1
        );

        this.isAnimating = false;
    }


    private fadeIn(
        duration: number
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
                        (
                            currentTime -
                            startTime
                        ) / duration
                    );


                const easedProgress =
                    1 -
                    Math.pow(
                        1 - progress,
                        3
                    );


                this.alpha =
                    easedProgress;


                const punch =
                    Math.sin(
                        progress *
                        Math.PI
                    );


                const scale =
                    0.88 +
                    easedProgress * 0.12 +
                    punch * 0.04;


                this.gameOverLabel.scale.set(
                    scale
                );


                if (progress < 1) {

                    this.animationFrameId =
                        requestAnimationFrame(
                            animate
                        );

                    return;
                }


                this.alpha = 1;

                this.gameOverLabel.scale.set(
                    1
                );

                this.animationFrameId =
                    undefined;

                resolve();
            };


            this.animationFrameId =
                requestAnimationFrame(
                    animate
                );
        });
    }


    private fadeOut(
        duration: number
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
                        (
                            currentTime -
                            startTime
                        ) / duration
                    );


                this.alpha =
                    1 - progress;


                if (progress < 1) {

                    this.animationFrameId =
                        requestAnimationFrame(
                            animate
                        );

                    return;
                }


                this.alpha = 0;

                this.animationFrameId =
                    undefined;

                resolve();
            };


            this.animationFrameId =
                requestAnimationFrame(
                    animate
                );
        });
    }


    private delay(
        milliseconds: number
    ): Promise<void> {

        return new Promise(resolve => {

            setTimeout(
                resolve,
                milliseconds
            );

        });
    }


    override destroy(
        options?: Parameters<
            Container["destroy"]
        >[0]
    ) {

        if (
            this.animationFrameId !==
            undefined
        ) {

            cancelAnimationFrame(
                this.animationFrameId
            );
        }

        super.destroy(options);
    }
}