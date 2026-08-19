import {
    Container,
    Graphics
} from "pixi.js";

import { LocalizedText } from "../../localization/LocalizedText";
import { LayoutManager } from "../../core/LayoutManager";
import { RoundedButton } from "../buttons/RoundedButton";
import { ButtonTheme } from "../buttons/ButtonTheme";
import { SkipButton } from "../buttons/SkipButton";
import { PerkRewardCard } from "../components/PerkRewardCard";
import { PerkReward } from "../../game/perks/reward/PerkReward";


export class PerkRewardOverlay extends Container {

    private confirmButton!: RoundedButton;
    private skipButton!: SkipButton;

    private bg!: Graphics;

    private perkRewardContainer:
        Container;

    private cards:
        PerkRewardCard[] = [];

    private selectedCard?:
        PerkRewardCard;


    constructor(
        width: number,
        height: number
    ) {

        super();


        this.bg = new Graphics()
            .rect(
                0,
                0,
                width,
                height
            )
            .fill({
                color: 0x000000
            });


        this.addChild(
            this.bg
        );


        this.eventMode =
            "static";

        this.cursor =
            "default";

        this.visible =
            false;


        const layout =
            LayoutManager.getInstance();


        const chooseAPerkLabel =
            new LocalizedText(
                "chooseAPerk",
                {
                    fontFamily:
                        "JackCondensed",

                    fontWeight:
                        "bold",

                    fontSize:
                        50,

                    fill:
                        0xffd21f
                }
            );


        chooseAPerkLabel.anchor.set(
            0.5
        );


        chooseAPerkLabel.position.set(
            layout.DESIGN_WIDTH / 2,
            80
        );


        const theLongerYouAreLabel =
            new LocalizedText(
                "theLongerYouAreInTheCasino",
                {
                    fontFamily:
                        "CrimsonPro-Italic",

                    fontWeight:
                        "bold",

                    fontSize:
                        38,

                    fill:
                        0xffd21f
                }
            );


        theLongerYouAreLabel.anchor.set(
            0.5
        );


        theLongerYouAreLabel.position.set(
            layout.DESIGN_WIDTH / 2,
            180
        );


        const perkRewardContainerWidth =
            1400;

        const perkRewardContainerHeight =
            530;


        this.perkRewardContainer =
            new Container();


        this.perkRewardContainer.position.set(
            (
                layout.DESIGN_WIDTH -
                perkRewardContainerWidth
            ) / 2,

            (
                layout.DESIGN_HEIGHT -
                perkRewardContainerHeight
            ) / 2
        );


        this.confirmButton =
            new RoundedButton({
                text:
                    "confirm",

                theme:
                    ButtonTheme.GOLD,

                onClick:
                    () => {

                        const reward =
                            this.selectedCard
                                ?.getReward();


                        if (!reward) {
                            return;
                        }


                        console.log(
                            "CONFIRMED PERK:",
                            reward.perk.id,
                            reward.variant.rarity
                        );
                    }
            });


        this.confirmButton.position.set(
            (
                layout.DESIGN_WIDTH -
                this.confirmButton.width
            ) / 2,
            883
        );


        this.confirmButton.visible =
            false;

        this.init();

        this.addChild(
            chooseAPerkLabel,
            theLongerYouAreLabel,
            this.confirmButton,
            this.perkRewardContainer
        );
    }


    async init(): Promise<void> {

        await this.createSkipButton();
    }

    private async createSkipButton(): Promise<void> {

        this.skipButton = new SkipButton();

        await this.skipButton.init();


        this.skipButton.on("pointerdown", () => {
            this.skipButton.scale.set(0.95);
        });

        this.skipButton.on("pointerup", () => {
            this.skipButton.scale.set(1);
        });

        this.skipButton.on("pointerupoutside", () => {
            this.skipButton.scale.set(1);
        });


        this.skipButton.on("pointertap", () => {
            this.hide();
        });


        this.skipButton.position.set(
            1618.3,
            861.2
        );


        this.addChild(
            this.skipButton
        );
    }


    private createCards(
        rewards:
            readonly PerkReward[]
    ) {

        this.perkRewardContainer
            .removeChildren();


        this.cards = [];

        this.selectedCard =
            undefined;

        this.confirmButton.visible =
            false;


        const cardWidth =
            400;

        const cardHeight =
            530;

        const cardSpacing =
            100;


        rewards.forEach(
            (reward, index) => {

                let card!:
                    PerkRewardCard;


                card =
                    new PerkRewardCard(
                        reward,
                        cardWidth,
                        cardHeight,
                        () => {
                            this.selectCard(
                                card
                            );
                        }
                    );


                card.position.set(
                    index *
                    (
                        cardWidth +
                        cardSpacing
                    ),
                    0
                );


                this.cards.push(
                    card
                );


                this.perkRewardContainer
                    .addChild(
                        card
                    );
            }
        );
    }


    private selectCard(
        card:
            PerkRewardCard
    ) {

        if (
            this.selectedCard ===
            card
        ) {
            return;
        }


        this.selectedCard
            ?.setSelected(
                false
            );


        this.selectedCard =
            card;


        this.selectedCard
            .setSelected(
                true
            );


        this.confirmButton.visible =
            true;
    }


    show(
        rewards:
            readonly PerkReward[]
    ) {

        if (
            rewards.length !==
            3
        ) {

            throw new Error(
                `PerkRewardOverlay expected 3 rewards, received ${rewards.length}.`
            );
        }


        this.createCards(
            rewards
        );


        this.visible =
            true;
    }


    hide() {

        this.visible =
            false;
    }
}