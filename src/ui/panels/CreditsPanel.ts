import { Container, Text, Ticker, Graphics } from "pixi.js";
import { Overlay } from "../popups/Overlay";
import { ButtonTheme } from "../buttons/ButtonTheme";
import { RoundedButton } from "../buttons/RoundedButton";
import { ClosePanelButton } from "../buttons/ClosePanelButton";
import { LocalizedText } from "../../localization/LocalizedText";
import { CREDITS_CONFIG } from "../../localization/CreditsConfig";

export class CreditsPanel extends Container {


    private creditsContainer!: Container;

    private scrolling = true;

    private speed = 0.5;


    constructor(
        width: number,
        height: number,
        private onClose: ()=>void
    ){

        super();


        this.createOverlay(width,height);

        this.createTitle(width);

        this.createCredits(width, height);

        this.createCloseButton();

        Ticker.shared.add(this.update, this);

    }



    private createOverlay(width:number,height:number){

        const overlay = new Overlay(
            width,
            height
        );

        this.addChild(overlay);

    }


    private createTitle(width: number){

        const title = new Text({

            text:"THREE LUCKY COINS",

            style:{
                fill:0xffffff,
                font: 'Open Sans',
                fontSize:52,
                fontWeight:"bold"
            }

        });


        title.anchor.set(0.5);


        title.position.set(
            width/2,
            108
        );


        this.addChild(title);

    }



    private createCredits(width:number, height:number){


        this.creditsContainer = new Container();


        this.creditsContainer.position.set(
            width / 2,
            height
        );


        this.addChild(this.creditsContainer);


        const mask = new Graphics();

        mask.rect(
            0,
            150,
            width,
            height - 130
        );

        mask.fill(0xffffff);

        


        this.addChild(mask);


        this.creditsContainer.mask = mask;

        


        let y = 0;


        CREDITS_CONFIG.forEach(line=>{

            let text: Text;

            if(line.key){

                text = new LocalizedText(
                    line.key,
                    {
                        fill:0xffffff,
                        fontSize:line.size,
                        fontWeight:
                            line.bold
                            ? "bold"
                            :"normal",
                        align:"center",
                        font:"Open Sans"
                    }
                );

            } else {

                text = new Text({
                    text: line.text ?? "",
                    style:{
                        fill:0xffffff,
                        fontSize:line.size,
                        fontWeight:
                            line.bold
                            ? "bold"
                            :"normal",
                        align:"center",
                        font:"Open Sans"
                    }
                });

            }


            text.anchor.set(0.5);


            text.position.set(
                0,
                y
            );


            this.creditsContainer.addChild(text);


            y += text.height + 15;


        });


    }



    private update(){

        if(!this.visible)
            return;


        if(!this.scrolling)
            return;


        this.creditsContainer.y -= this.speed;


        if(this.creditsContainer.y < -2500){

            this.scrolling = false;

        }

    }

    async createCloseButton() {
        const close = new ClosePanelButton();

        await close.init();

        close.on("pointerdown", () => {
            close.scale.set(0.95);
        });

        close.on("pointerup", () => {
            close.scale.set(1);
        });

        close.on("pointerupoutside", () => {
            close.scale.set(1);
        });

        close.on("pointertap", () => {
            this.hide();
        });

        close.position.set(
            1750,
            108
        );

        this.addChild(close);
    }

    show(){

        this.visible = true;

        this.creditsContainer.y = 800;

        this.scrolling = true;

    }


    hide(){

        this.visible = false;

    }


}