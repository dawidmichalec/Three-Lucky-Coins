import { Container, Text, Ticker, Graphics } from "pixi.js";
import { Overlay } from "../popups/Overlay";
import { ButtonTheme } from "../buttons/ButtonTheme";
import { RoundedButton } from "../buttons/RoundedButton";
import { ClosePanelButton } from "../buttons/ClosePanelButton";

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


        const lines = [

            {text:"Created by", size:28},
            {text:"Dawid Michalec", size:40, bold:true},

            {text:"", size:28},

            {text:"Game Design", size:28},
            {text:"Dawid Michalec", size:40,bold:true},

            {text:"Core gameplay mechanics", size:28},
            {text:"Roguelite progression system", size:28},
            {text:"Balance design", size:28},
            {text:"Economy design", size:28},

            {text:"", size:28},

            {text:"Programming", size:28},
            {text:"Dawid Michalec", size:40,bold:true},

            {text:"Game systems", size:28},
            {text:"User interface", size:28},
            {text:"Animation systems", size:28},
            {text:"Tools and developer features", size:28},

            {text:"", size:28},

            {text:"Art Direction", size:28},
            {text:"Dawid Michalec", size:40,bold:true},

            {text:"Visual concept", size:28},
            {text:"UI design", size:28},
            {text:"Game branding", size:28},


            {text:"", size:28},

            {text:"Sound Designer and Composer", size:28},
            {text:"Dawid Michalec", size:40,bold:true},

            {text:"Original soundtrack", size:28},
            {text:"Sound effects", size:28},
            {text:"Audio direction", size:28},

            {text:"", size:28},


            {text:"Special Thanks", size:40,bold:true},

            {text:"", size:28},

            {text:"Playtesters", size:40,bold:true},
            {text:"Jan Kowalski", size:28},

            {text:"", size:28},

            {text:"My Girlfriend", size:40,bold:true},
            {text:"and everyone who supported me", size:28},

            {text:"",size:28},

            {text:"Thank you for playing ❤️",size:40,bold:true},

            {text:"",size:40},

            {text:"Three Lucky Coins",size:16},
            {text:"Version 0.1.0",size:16},
            {text:"© 2026 Dawid Michalec",size:16},

        ];


        let y = 0;


        lines.forEach(line=>{


            const text = new Text({

                text:line.text,

                style:{
                    fill:0xffffff,
                    fontSize:line.size,
                    fontWeight:
                        line.bold
                        ? "bold"
                        :"normal",
                    align:"center"
                }

            });


            text.anchor.set(0.5);


            text.position.set(
                0,
                y
            );


            this.creditsContainer.addChild(text);


            y += line.size + 15;


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