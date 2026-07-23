import { Text, Sprite, Assets } from "pixi.js";
import { Overlay } from "../popups/Overlay";
import { LayoutManager } from "../../core/LayoutManager";



export class RotateDeviceOverlay extends Overlay {

    private text: Text;

    private layout = LayoutManager.getInstance();


    constructor() {

        super(
            LayoutManager.getInstance().DESIGN_WIDTH,
            LayoutManager.getInstance().DESIGN_HEIGHT
        );


        this.visible = false;


        this.text = new Text({
            text: "PLEASE ROTATE\nYOUR DEVICE",
            style: {
                fontFamily: "Open Sans",
                fontWeight: "bold",
                fontSize: 70,
                fill: 0xffffff,
                align: "center"
            }
        });


        this.text.anchor.set(0.5);


        this.addChild(
            this.text
        );


        this.layout.register({

            onLayoutChanged: () => {
                this.update();
            }

        });


        this.update();

    }


    private update(){

        const portrait =
            this.layout.screenHeight >
            this.layout.screenWidth;


        this.visible = portrait;

        this.text.position.set(
            this.layout.DESIGN_WIDTH / 2,
            this.layout.DESIGN_HEIGHT / 2
        );

    }

}