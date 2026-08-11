import {
    Container,
    Sprite,
    Assets
} from "pixi.js";

import {
    LocalizedText
} from "../../../localization/LocalizedText";

import {
    CardColor
} from "../../../game/gambleForMore/games/redBlackCard/RedBlackCardTypes";


export class RedBlackCardView
extends Container {

    private cardOne!: Sprite;
    private cardTwo!: Sprite;


    constructor(
        width: number,
        height: number,

        private onColorSelected:
            (color: CardColor) => void
    ) {

        super();


        const gameName =
            new LocalizedText(
                "redCardBlackCardLabel",
                {
                    fontFamily:
                        "Old Standard Regular",

                    fontSize: 48,

                    fill: 0xffd21f
                }
            );


        gameName.position.set(
            width / 2,
            20
        );

        gameName.anchor.set(
            0.5
        );


        this.addChild(
            gameName
        );
    }


    async init():
        Promise<void> {

        await this.createCards();
    }


    private async createCards() {

        const redCardTexture = await Assets.load("/assets/main/icons/cards/red_card.png");
        const blackCardTexture = await Assets.load("/assets/main/icons/cards/black_card.png");

        this.cardOne = new Sprite(redCardTexture);
        this.cardTwo = new Sprite(blackCardTexture);


        this.cardOne.width = 228.4;
        this.cardOne.height = 342.7;

        this.cardTwo.width = 228.4;
        this.cardTwo.height = 342.7;


        this.cardOne.position.set(
            220,
            90
        );

        this.cardTwo.position.set(
            750,
            90
        );


        /*
            Na początku karty są tylko preview.
            Gracz nie może ich jeszcze wybrać.
        */

        this.setSelectionEnabled(
            false
        );


        this.cardOne.on(
            "pointertap",
            () => {

                this.onColorSelected(
                    CardColor.RED
                );
            }
        );


        this.cardTwo.on(
            "pointertap",
            () => {

                this.onColorSelected(
                    CardColor.BLACK
                );
            }
        );


        this.addChild(
            this.cardOne,
            this.cardTwo
        );
    }


    setSelectionEnabled(
        enabled: boolean
    ) {

        if (
            !this.cardOne ||
            !this.cardTwo
        ) {
            return;
        }


        const eventMode =
            enabled
                ? "static"
                : "none";


        this.cardOne.eventMode =
            eventMode;

        this.cardTwo.eventMode =
            eventMode;


        this.cardOne.cursor =
            enabled
                ? "pointer"
                : "default";

        this.cardTwo.cursor =
            enabled
                ? "pointer"
                : "default";
    }
}