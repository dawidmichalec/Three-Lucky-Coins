import { Container, Text, Graphics } from "pixi.js";
import { RoundedButton } from "../buttons/RoundedButton";
import { ButtonTheme } from "../buttons/ButtonTheme";


interface ConfirmationPopupOptions {

    message: string;

    onConfirm: () => void;

    onCancel: () => void;
}


export class ConfirmationPopup extends Container {


    private readonly popupWidth = 600;
    private readonly popupHeight = 300;


    constructor(
        private options: ConfirmationPopupOptions
    ) {

        super();

        this.createBackground();
        this.createMessage();
        this.createButtons();

    }



    private createBackground(){

        const bg = new Graphics();


        bg.roundRect(
            0,
            0,
            this.popupWidth,
            this.popupHeight,
            25
        );


        bg.fill(0x222222);


        this.addChild(bg);

    }



    private createMessage(){

        const text = new Text({

            text:this.options.message,

            style:{
                fill:0xffffff,
                fontSize:26,
                align:"center",
                wordWrap:true,
                wordWrapWidth:550
            }

        });


        text.anchor.set(0.5);


        text.position.set(
            this.popupWidth / 2,
            80
        );


        this.addChild(text);

    }



    private createButtons(){


        const yesButton = new RoundedButton({

            text:"YES",

            theme:ButtonTheme.GREEN,

            buttonWidth:180,

            buttonHeight:60,

            onClick:()=>{
                this.options.onConfirm();
            }

        });



        yesButton.position.set(
            100,
            200
        );



        const noButton = new RoundedButton({

            text:"NO",

            theme:ButtonTheme.RED,

            buttonWidth:180,

            buttonHeight:60,

            onClick:()=>{
                this.options.onCancel();
            }

        });



        noButton.position.set(
            320,
            200
        );



        this.addChild(
            yesButton,
            noButton
        );

    }

}