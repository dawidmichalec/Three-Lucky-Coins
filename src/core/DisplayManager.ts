import { Container, Graphics } from "pixi.js";


export class DisplayManager {


    private static instance: DisplayManager;


    private brightnessOverlay: Graphics;



    static getInstance(
        stage?: Container
    ){

        if(!DisplayManager.instance){

            if(!stage){
                throw new Error(
                    "DisplayManager requires stage on first initialization"
                );
            }

            DisplayManager.instance =
                new DisplayManager(stage);

        }

        return DisplayManager.instance;
    }



    private constructor(
        private stage: Container
    ){

        this.brightnessOverlay = new Graphics();

        this.brightnessOverlay
            .rect(
                0,
                0,
                window.innerWidth,
                window.innerHeight
            )
            .fill({
                color: 0x000000,
                alpha: 1
            });

        this.brightnessOverlay.alpha = 0;


        this.brightnessOverlay.zIndex = 9999;


        this.stage.sortableChildren = true;


        this.stage.addChild(
            this.brightnessOverlay
        );

        this.stage.sortChildren();

    }



    setBrightness(value:number){


        this.brightnessOverlay.alpha =
            1 - value;

    }

}