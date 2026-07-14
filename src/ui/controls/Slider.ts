import { Container, Graphics } from "pixi.js";


interface SliderOptions {

    width?: number;

    height?: number;

    initialValue: number;

    onChange: (value:number)=>void;

}



export class Slider extends Container {


    private track!: Graphics;

    private fill!: Graphics;

    private knob!: Graphics;


    private value:number;


    private sliderWidth:number;

    private sliderHeight:number;



    constructor(
        private options: SliderOptions
    ){

        super();


        this.sliderWidth =
            options.width ?? 300;


        this.sliderHeight =
            options.height ?? 12;


        this.value =
            options.initialValue;


        this.createTrack();

        this.createFill();

        this.createKnob();


        this.updateVisual();


        this.setupInteraction();

    }





    private createTrack(){

        this.track = new Graphics();


        this.track.roundRect(
            0,
            0,
            this.sliderWidth,
            this.sliderHeight,
            this.sliderHeight/2
        );


        this.track.fill(
            0xb4b4b4
        );


        this.addChild(this.track);

    }




    private createFill(){

        this.fill = new Graphics();


        this.addChild(this.fill);

    }





    private createKnob(){

        this.knob = new Graphics();


        this.knob.circle(
            0,
            0,
            18
        );


        this.knob.fill(
            0xffffff
        );


        this.knob.stroke({
            width:2,
            color:0x4ca626
        });


        this.addChild(this.knob);

    }





    private updateVisual(){


        /*
            Wypełnienie lewej części
        */

        this.fill.clear();


        this.fill.roundRect(
            0,
            0,
            this.sliderWidth * this.value,
            this.sliderHeight,
            this.sliderHeight/2
        );


        this.fill.fill(
            0x4ca626
        );



        /*
            Knob zawsze na środku wysokości
        */

        this.knob.position.set(

            this.sliderWidth * this.value,

            this.sliderHeight / 2

        );

    }





    private setupInteraction(){


        this.eventMode = "static";

        this.cursor = "pointer";


        this.on(
            "pointerdown",
            (event)=>{

                this.updateFromPointer(
                    event.global.x
                );

            }
        );


        this.on(
            "pointermove",
            (event)=>{


                if(event.buttons){

                    this.updateFromPointer(
                        event.global.x
                    );

                }

            }
        );


    }





    private updateFromPointer(globalX:number){


        const local =
            this.toLocal({
                x:globalX,
                y:0
            });


        let value =
            local.x / this.sliderWidth;



        value =
            Math.max(
                0,
                Math.min(
                    1,
                    value
                )
            );



        this.value = value;


        this.updateVisual();


        this.options.onChange(
            this.value
        );

    }





    getValue(){

        return this.value;

    }


}