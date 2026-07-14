import { Container, Graphics } from "pixi.js";

interface ToggleButtonOptions {
    width?: number;
    height?: number;
    initialState: boolean;
    onChange: (state: boolean) => void;
}


export class ToggleButton extends Container {

    private track!: Graphics;
    private knob!: Graphics;

    private state: boolean;

    private widthValue: number;
    private heightValue: number;

    constructor(
        private options: ToggleButtonOptions
    ) {

        super();

        this.widthValue = options.width ?? 100;
        this.heightValue = options.height ?? 45;

        this.state = options.initialState;

        this.createTrack();
        this.createKnob();

        this.updateVisual();

        this.eventMode = "static";
        this.cursor = "pointer";

        this.on("pointerdown", () => {

            this.state = !this.state;

            this.updateVisual();

            this.options.onChange(this.state);

        });

    }


    private createTrack() {

        this.track = new Graphics();

        this.addChild(this.track);

    }


    private createKnob() {

        this.knob = new Graphics();

        this.addChild(this.knob);

    }


    private updateVisual() {


        const trackColor = this.state
            ? 0x4ca626
            : 0xb4b4b4;


        // TRACK

        this.track.clear();

        this.track.roundRect(
            0,
            0,
            this.widthValue,
            this.heightValue,
            this.heightValue / 2
        );

        this.track.fill(trackColor);



        // KNOB

        this.knob.clear();

        const knobRadius =
            this.heightValue * 0.38;


        this.knob.circle(
            0,
            0,
            knobRadius
        );

        this.knob.fill(0xffffff);


        this.knob.position.y =
            this.heightValue / 2;

        this.knob.position.x =
            this.state
                ? this.widthValue - knobRadius - 5
                : knobRadius + 5;

    }


    getState(){

        return this.state;

    }

}