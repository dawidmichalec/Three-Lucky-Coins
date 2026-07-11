import { Container, Text, Graphics } from "pixi.js";
import { ButtonTheme } from "./ButtonTheme";
import { BUTTON_STYLES, ButtonStyle } from "./ButtonStyles";

interface RoundedButtonOptions {

    text: string;

    width?: number;
    height?: number;

    theme?: ButtonTheme;

    onClick: ()=>void;
}

export class RoundedButton extends Container {

    private style: ButtonStyle;
    private background: Graphics;

    constructor(
        private options: RoundedButtonOptions
    ) {
        super();

        this.eventMode = 'static';
        this.cursor = 'pointer';

        this.createButton();
    }

    private createButton() {

        const width = this.options.width ?? 240;
        const height = this.options.height ?? 80;


        this.style = BUTTON_STYLES[
            this.options.theme ?? ButtonTheme.YELLOW
        ];


        this.background = new Graphics();

        this.background.roundRect(
            0,
            0,
            width,
            height,
            30
        );

        this.background.fill(this.style.fill);


        this.on("pointerover", () => {

            this.background.clear();

            this.background.roundRect(
                0,
                0,
                width,
                height,
                30
            );

            this.background.fill(
                this.style.hoverFill
            );

        });


        this.on("pointerout", () => {

            this.background.clear();

            this.background.roundRect(
                0,
                0,
                width,
                height,
                30
            );

            this.background.fill(
                this.style.fill
            );

        });

        this.on("pointertap", () => {
            this.options.onClick();
        });


        this.addChild(this.background);



        const text = new Text({
            text: this.options.text,
            style:{
                fill: this.style.textColor,
                font: 'Open Sans',
                fontSize: 28
            }
        });


        text.anchor.set(0.5);

        text.position.set(
            width / 2,
            height / 2
        );


        this.addChild(text);
    }
}