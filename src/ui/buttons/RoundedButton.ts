import { Container, Text, Graphics } from "pixi.js";
import { ButtonTheme } from "./ButtonTheme";
import { BUTTON_STYLES, ButtonStyle } from "./ButtonStyles";

interface RoundedButtonOptions {

    text: string;

    buttonWidth?: number;
    buttonHeight?: number;

    theme?: ButtonTheme;

    onClick: ()=>void;
}

export class RoundedButton extends Container {

    private style!: ButtonStyle;
    private background!: Graphics;
    private text!: Text;

    private buttonWidth!: number;
    private buttonHeight!: number;

    constructor(
        private options: RoundedButtonOptions
    ) {
        super();

        this.eventMode = 'static';
        this.cursor = 'pointer';

        this.createButton();
    }

    private createButton() {

        this.buttonWidth = this.options.buttonWidth ?? 324;
        this.buttonHeight = this.options.buttonHeight ?? 121;


        this.style = BUTTON_STYLES[
            this.options.theme ?? ButtonTheme.YELLOW
        ];


        this.background = new Graphics();

        this.background.roundRect(
            0,
            0,
            this.buttonWidth,
            this.buttonHeight,
            50
        );

        this.background.fill(this.style.fill);


        this.on("pointerover", () => {

            this.redraw(this.style.hoverFill);

        });


        this.on("pointerout", () => {

            this.redraw(this.style.fill);

        });

        this.on("pointertap", () => {
            this.options.onClick();
        });


        this.addChild(this.background);



        this.text = new Text({
            text: this.options.text,
            style:{
                fill: this.style.textColor,
                font: 'Open Sans',
                fontSize: 30,
                fontWeight: 'bold'
            }
        });


        this.text.anchor.set(0.5);

        this.text.position.set(
            this.buttonWidth / 2,
            this.buttonHeight / 2
        );


        this.addChild(this.text);
    }

    private redraw(fill: number) {

        this.background.clear();

        this.background
            .roundRect(
                0,
                0,
                this.buttonWidth,
                this.buttonHeight,
                50
            )
            .fill(fill);
    }

    setTheme(theme: ButtonTheme) {

        this.style = BUTTON_STYLES[theme];

        this.redraw(this.style.fill);

        this.text.style.fill = this.style.textColor;
    }
}