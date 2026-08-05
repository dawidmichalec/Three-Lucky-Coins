import {
    Container,
    Graphics,
    Text
} from "pixi.js";

import {
    TooltipCloseButton
} from "../../buttons/TooltipCloseButton";

import {
    LocalizedText
} from "../../../localization/LocalizedText";

import {
    DealerData
} from "../../../game/dealers/DealerData";


export class DealerObjectivePanel extends Container {

    private bg: Graphics;

    private objectiveAmount!: Text;


    constructor(
        width: number,
        height: number
    ) {

        super();

        this.bg = new Graphics()
            .roundRect(
                0,
                0,
                width,
                height,
                50
            )
            .fill({
                color: 0x000000
            });

        this.visible = false;

        this.eventMode = "static";
        this.cursor = "default";

        this.addChild(this.bg);


        const objectiveLabel =
            new LocalizedText(
                "objective",
                {
                    fontFamily: "Oswald-Bold",
                    fontSize: 38,
                    fontWeight: "bold",
                    fill: 0xffde59
                }
            );

        objectiveLabel.position.set(
            45,
            15
        );


        const objectiveDescription =
            new LocalizedText(
                "achieveABalanceOf",
                {
                    font: "Open Sans",
                    fontSize: 24,
                    fontWeight: "bold",
                    fill: 0xffffff
                }
            );

        objectiveDescription.position.set(
            45,
            82
        );


        this.objectiveAmount =
            new Text({
                text: "0.00",
                style: {
                    font: "Open Sans",
                    fontSize: 24,
                    fontWeight: "bold",
                    fill: 0x4ca626
                }
            });

        this.objectiveAmount.position.set(
            objectiveDescription.x +
                objectiveDescription.width +
                8,
            objectiveDescription.y
        );


        this.addChild(
            objectiveLabel,
            objectiveDescription,
            this.objectiveAmount
        );


        void this.createCloseButton();
    }


    setDealer(
        dealer: DealerData
    ) {

        this.objectiveAmount.text =
            dealer.objectiveValue.toFixed(2);
    }


    private async createCloseButton() {

        const close =
            new TooltipCloseButton();

        await close.init();

        close.on(
            "pointerdown",
            () => {
                close.scale.set(0.95);
            }
        );

        close.on(
            "pointerup",
            () => {
                close.scale.set(1);
            }
        );

        close.on(
            "pointerupoutside",
            () => {
                close.scale.set(1);
            }
        );

        close.on(
            "pointertap",
            () => {
                this.hide();
            }
        );

        close.position.set(
            540,
            25
        );

        this.addChild(close);
    }


    show() {

        this.visible = true;
    }


    hide() {

        this.visible = false;
    }
}