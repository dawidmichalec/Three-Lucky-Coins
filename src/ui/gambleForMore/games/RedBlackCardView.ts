import { Container, Graphics, Sprite, Assets } from "pixi.js";
import { LocalizedText } from "../../../localization/LocalizedText";

export class RedBlackCardView extends Container {

    constructor(width: number, height: number) {
        super();

        const gameName = new LocalizedText(
            "redCardBlackCardLabel",
            {
                fontFamily: "Old Standard Regular",
                fontSize: 48,
                fill: 0xffd21f
            }
        );

        gameName.position.set(width/2, 20);
        gameName.anchor.set(0.5);

        this.addChild(
            gameName
        );
    }

    async init(): Promise<void> {

        await this.createCards();
    }

    async createCards() {

        console.log("Creating cards");

        const cardBack =
            await Assets.load(
                "/assets/main/icons/cards/card_back.png"
            );


        const cardOne =
            new Sprite(cardBack);

        const cardTwo =
            new Sprite(cardBack);


        cardOne.width = 228.4;
        cardOne.height = 342.7;

        cardTwo.width = 228.4;
        cardTwo.height = 342.7;


        cardOne.position.set(
            220,
            90
        );

        cardTwo.position.set(
            750,
            90
        );


        this.addChild(
            cardOne,
            cardTwo
        );
    }
}