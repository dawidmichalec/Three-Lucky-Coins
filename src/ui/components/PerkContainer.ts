import {
    Assets,
    Container,
    Graphics,
    Sprite
} from "pixi.js";

import { PerkReward } from "../../game/perks/reward/PerkReward";


export class PerkContainer extends Container {

    private bg: Graphics;

    private perkIcons: Sprite[] = [];

    private readonly containerWidth: number;
    private readonly containerHeight: number;

    private readonly iconSize = 50;

    private readonly columns = 5;
    private readonly rows = 3;


    constructor(
        width: number,
        height: number,
        private readonly onPerkClick: (reward: PerkReward) => void
    ) {

        super();

        this.containerWidth =
            width;

        this.containerHeight =
            height;


        this.bg = new Graphics()
            .rect(
                0,
                0,
                width,
                height
            )
            .fill({
                color: 0x4ca626,
                alpha: 0.25
            });


        this.visible = true;


        this.addChild(
            this.bg
        );
    }


    async addPerk(
        reward: PerkReward
    ): Promise<void> {

        const texture =
            await Assets.load(
                reward.variant.assets.small
            );


        const perkIcon =
            new Sprite(
                texture
            );


        perkIcon.anchor.set(
            0.5
        );


        perkIcon.width =
            this.iconSize;

        perkIcon.height =
            this.iconSize;

        perkIcon.eventMode = "static";
        perkIcon.cursor = "pointer";

        perkIcon.on(
            "pointertap",
            event => {

                event.stopPropagation();

                this.onPerkClick(
                    reward
                );
            }
        );


        const index =
            this.perkIcons.length;


        const position =
            this.getIconPosition(
                index
            );

        perkIcon.position.set(
            position.x,
            position.y
        );


        perkIcon.alpha =
            0;

        perkIcon.scale.set(
            0.3
        );


        /*
            FLASH POJAWIA SIĘ
            DOKŁADNIE ZA IKONĄ.
        */

        const flash =
            new Graphics()
                .circle(
                    0,
                    0,
                    this.iconSize * 0.8
                )
                .fill({
                    color: 0xffde59,
                    alpha: 0.8
                });


        flash.position.copyFrom(
            perkIcon.position
        );


        flash.scale.set(
            0.35
        );


        /*
            Flash musi być dodany przed ikoną,
            żeby znajdował się pod nią.
        */

        this.addChild(
            flash,
            perkIcon
        );


        this.perkIcons.push(
            perkIcon
        );


        await Promise.all([
            this.animatePerkIcon(
                perkIcon
            ),

            this.animateFlash(
                flash
            )
        ]);


        flash.destroy();


        perkIcon.alpha =
            1;

        perkIcon.scale.set(
            1
        );
    }


    private getIconPosition(
        index: number
    ): {
        x: number;
        y: number;
    } {

        const column =
            index % this.columns;

        const row =
            Math.floor(
                index / this.columns
            );


        const horizontalSpacing =
            (
                this.containerWidth -
                this.iconSize * this.columns
            ) /
            (
                this.columns + 1
            );


        const verticalSpacing =
            (
                this.containerHeight -
                this.iconSize * this.rows
            ) /
            (
                this.rows + 1
            );


        return {
            x:
                horizontalSpacing +
                this.iconSize / 2 +
                column *
                (
                    this.iconSize +
                    horizontalSpacing
                ),

            y:
                verticalSpacing +
                this.iconSize / 2 +
                row *
                (
                    this.iconSize +
                    verticalSpacing
                )
        };
    }


    private animatePerkIcon(
        icon: Sprite
    ): Promise<void> {

        return this.animate(
            420,

            progress => {

                const easedProgress =
                    1 -
                    Math.pow(
                        1 - progress,
                        3
                    );


                /*
                    Lekki overshoot:
                    0.3 → około 1.18 → 1
                */

                const punch =
                    Math.sin(
                        progress *
                        Math.PI
                    );


                const scale =
                    0.3 +
                    easedProgress * 0.7 +
                    punch * 0.18;


                icon.scale.set(
                    scale
                );


                icon.alpha =
                    easedProgress;
            }
        );
    }


    private animateFlash(
        flash: Graphics
    ): Promise<void> {

        return this.animate(
            500,

            progress => {

                /*
                    Flash rozszerza się
                    i jednocześnie zanika.
                */

                const scale =
                    0.35 +
                    progress *
                    1.5;


                flash.scale.set(
                    scale
                );


                flash.alpha =
                    0.8 *
                    (
                        1 - progress
                    );
            }
        );
    }


    private animate(
        duration: number,

        update:
            (
                progress: number
            ) => void
    ): Promise<void> {

        return new Promise(
            resolve => {

                const startTime =
                    performance.now();


                const frame = (
                    currentTime: number
                ) => {

                    const elapsed =
                        currentTime -
                        startTime;


                    const progress =
                        Math.min(
                            1,
                            elapsed /
                            duration
                        );


                    update(
                        progress
                    );


                    if (
                        progress >= 1
                    ) {

                        resolve();

                        return;
                    }


                    requestAnimationFrame(
                        frame
                    );
                };


                requestAnimationFrame(
                    frame
                );
            }
        );
    }
}