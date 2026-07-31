import { LocalizedText } from "../localization/LocalizedText";
import { Container, Graphics, Text, wordWrap} from "pixi.js";

export class ProbabilityDisplay extends Container {

    private bg: Graphics;

    constructor(width: number, height: number){
        super();


        this.bg = new Graphics()
            .roundRect(0, 0, width, height, 50)
            .fill({ color: 0x000000 });

        this.addChild(this.bg);


        const probabilityLabel = new LocalizedText(
            "probability",
            {
                fontFamily: 'Oswald-Bold',
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

        const coinOneHeadsProbabilityValue = new Text({
            text: '70%',
            style: {
                font: "Open Sans",
                fontSize: 22,
                fontWeight: "bold",
                fill: 0xffffff,
                wordWrap: true,
            },
        });

        coinOneHeadsProbabilityValue.position.set(125, 170);


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


        const coinOneTailsProbabilityValue = new Text({
            text: "30%",
            style: {
                font: "Open Sans",
                fontSize: 22,
                fontWeight: "bold",
                fill: 0xffffff,
                wordWrap: true,
            },
        });

        coinOneTailsProbabilityValue.position.set(125, 200);


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


        const coinTwoHeadsProbabilityValue = new Text({
            text: "60%",
            style: {
                font: "Open Sans",
                fontSize: 22,
                fontWeight: "bold",
                fill: 0xffffff,
                wordWrap: true,
            }
        });

        coinTwoHeadsProbabilityValue.position.set(125, 305);


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


        const coinTwoTailsProbabilityValue = new Text({
            text: "40%",
            style: {
                font: "Open Sans",
                fontSize: 22,
                fontWeight: "bold",
                fill: 0xffffff,
                wordWrap: true,
            }
        });

        coinTwoTailsProbabilityValue.position.set(125, 335);


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


        const coinThreeHeadsProbabilityValue = new Text({
            text: "60%",
            style: {
                font: "Open Sans",
                fontSize: 22,
                fontWeight: "bold",
                fill: 0xffffff,
                wordWrap: true,
            }
        });

        coinThreeHeadsProbabilityValue.position.set(125, 435);


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


        const coinThreeTailsProbabilityValue = new Text({
            text: "40%",
            style: {
                font: "Open Sans",
                fontSize: 22,
                fontWeight: "bold",
                fill: 0xffffff,
                wordWrap: true,
            }
        });

        coinThreeTailsProbabilityValue.position.set(125, 465);


        this.addChild(
            probabilityLabel, 
            coinOneLabel,
            coinOneHeadsLabel,
            coinOneHeadsProbabilityValue,
            coinOneTailsLabel,
            coinOneTailsProbabilityValue,
            coinTwoLabel,
            coinTwoHeadsLabel,
            coinTwoHeadsProbabilityValue,
            coinTwoTailsLabel,
            coinTwoTailsProbabilityValue,
            coinThreeLabel,
            coinThreeHeadsLabel,
            coinThreeHeadsProbabilityValue,
            coinThreeTailsLabel,
            coinThreeTailsProbabilityValue
        )

    }
}