import {
    Container,
    Graphics,
    Text
} from "pixi.js";

import { LocalizedText } from "../../localization/LocalizedText";
import { OddsTable } from "../../game/probability/OddsTypes";

export class ProbabilityDisplay extends Container {

    private bg: Graphics;

    private coinOneHeadsValue!: Text;
    private coinOneTailsValue!: Text;

    private coinTwoHeadsValue!: Text;
    private coinTwoTailsValue!: Text;

    private coinThreeHeadsValue!: Text;
    private coinThreeTailsValue!: Text;

    constructor(width: number, height: number){
        super();


        this.bg = new Graphics()
            .roundRect(0, 0, width, height, 50)
            .fill({ color: 0x000000 });

        this.addChild(this.bg);


        const probabilityLabel = new LocalizedText(
            "probability",
            {
                fontFamily: 'Anek-Kannada Bold',
                fontSize: 38,
                fontWeight: 'bold',
                fill:0xffde59,
                wordWrap: true,
            }
        )

        probabilityLabel.position.set(35, 25);

        
        const coinOneLabel = new LocalizedText(
            "coinOne",
            {
                font: "Open Sans",
                fontSize: 24,
                fontWeight: "bold",
                fill: 0xffffff,
                wordWrap: true,
                wordWrapWidth: 150,
            }
        )

        coinOneLabel.position.set(35, 140);

        const coinOneHeadsLabel = new LocalizedText(
            "heads",
            {
                font: "Open Sans",
                fontSize: 22,
                fontWeight: "bold",
                fill: 0xffffff,
                wordWrap: true,
            }
        );

        coinOneHeadsLabel.position.set(35, 170);


        this.coinOneHeadsValue = new Text({
            text: "—",
            style: {
                font: "Open Sans",
                fontSize: 22,
                fontWeight: "bold",
                fill: 0xffffff
            }
        });

        this.coinOneHeadsValue.position.set(
            125,
            170
        );


        const coinOneTailsLabel = new LocalizedText(
            "tails",
            {
                font: "Open Sans",
                fontSize: 22,
                fontWeight: "bold",
                fill: 0xffffff,
                wordWrap: true,
            }
        );

        coinOneTailsLabel.position.set(35, 200);


        this.coinOneTailsValue = new Text({
            text: "-",
            style: {
                font: "Open Sans",
                fontSize: 22,
                fontWeight: "bold",
                fill: 0xffffff,
                wordWrap: true,
            },
        });

        this.coinOneTailsValue.position.set(125, 200);


        const coinTwoLabel = new LocalizedText(
            "coinTwo",
            {
                font: "Open Sans",
                fontSize: 24,
                fontWeight: "bold",
                fill: 0xffffff,
                wordWrap: true,
                wordWrapWidth: 150,
            }
        )

        coinTwoLabel.position.set(35, 275);


        const coinTwoHeadsLabel = new LocalizedText(
            "heads",
            {
                font: "Open Sans",
                fontSize: 22,
                fontWeight: "bold",
                fill: 0xffffff,
                wordWrap: true,
            }
        );

        coinTwoHeadsLabel.position.set(35, 305);


        this.coinTwoHeadsValue = new Text({
            text: "-",
            style: {
                font: "Open Sans",
                fontSize: 22,
                fontWeight: "bold",
                fill: 0xffffff,
                wordWrap: true,
            }
        });

        this.coinTwoHeadsValue.position.set(125, 305);


        const coinTwoTailsLabel = new LocalizedText(
            "tails",
            {
                font: "Open Sans",
                fontSize: 22,
                fontWeight: "bold",
                fill: 0xffffff,
                wordWrap: true,
            }
        );

        coinTwoTailsLabel.position.set(35, 335);


        this.coinTwoTailsValue = new Text({
            text: "-",
            style: {
                font: "Open Sans",
                fontSize: 22,
                fontWeight: "bold",
                fill: 0xffffff,
                wordWrap: true,
            }
        });

        this.coinTwoTailsValue.position.set(125, 335);


        const coinThreeLabel = new LocalizedText(
            "coinThree",
            {
                font: "Open Sans",
                fontSize: 24,
                fontWeight: "bold",
                fill: 0xffffff,
                wordWrap: true,
                wordWrapWidth: 150,
            }
        );

        coinThreeLabel.position.set(35, 405);


        const coinThreeHeadsLabel = new LocalizedText(
            "heads",
            {
                font: "Open Sans",
                fontSize: 22,
                fontWeight: "bold",
                fill: 0xffffff,
                wordWrap: true,
            }
        );

        coinThreeHeadsLabel.position.set(35, 435);


        this.coinThreeHeadsValue = new Text({
            text: "-",
            style: {
                font: "Open Sans",
                fontSize: 22,
                fontWeight: "bold",
                fill: 0xffffff,
                wordWrap: true,
            }
        });

        this.coinThreeHeadsValue.position.set(125, 435);


        const coinThreeTailsLabel = new LocalizedText(
            "tails",
            {
                font: "Open Sans",
                fontSize: 22,
                fontWeight: "bold",
                fill: 0xffffff,
                wordWrap: true,
            }
        );

        coinThreeTailsLabel.position.set(35, 465);


        this.coinThreeTailsValue = new Text({
            text: "-",
            style: {
                font: "Open Sans",
                fontSize: 22,
                fontWeight: "bold",
                fill: 0xffffff,
                wordWrap: true,
            }
        });

        this.coinThreeTailsValue.position.set(125, 465);


        this.addChild(
            probabilityLabel,

            coinOneLabel,
            coinOneHeadsLabel,
            this.coinOneHeadsValue,
            coinOneTailsLabel,
            this.coinOneTailsValue,

            coinTwoLabel,
            coinTwoHeadsLabel,
            this.coinTwoHeadsValue,
            coinTwoTailsLabel,
            this.coinTwoTailsValue,

            coinThreeLabel,
            coinThreeHeadsLabel,
            this.coinThreeHeadsValue,
            coinThreeTailsLabel,
            this.coinThreeTailsValue
        );

    }

    updateOdds(
        odds: OddsTable
    ) {

        this.coinOneHeadsValue.text =
            this.formatPercentage(
                odds.coin1.heads
            );

        this.coinOneTailsValue.text =
            this.formatPercentage(
                odds.coin1.tails
            );

        this.coinTwoHeadsValue.text =
            this.formatPercentage(
                odds.coin2.heads
            );

        this.coinTwoTailsValue.text =
            this.formatPercentage(
                odds.coin2.tails
            );

        this.coinThreeHeadsValue.text =
            this.formatPercentage(
                odds.coin3.heads
            );

        this.coinThreeTailsValue.text =
            this.formatPercentage(
                odds.coin3.tails
            );
    }

    private formatPercentage(
        probability: number
    ): string {

        return `${Math.round(
            probability * 100
        )}%`;
    }
}