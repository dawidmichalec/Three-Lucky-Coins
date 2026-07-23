import { Container, Graphics, FederatedPointerEvent, FederatedWheelEvent } from "pixi.js";


export class ScrollableContainer extends Container {


    private content: Container;

    private maxScroll = 0;

    private scrollY = 0;

    private viewportHeight: number;

    private dragging = false;

    private lastPointerY = 0;



    constructor(
        width:number,
        height:number
    ){

        super();


        this.viewportHeight = height;


        this.content = new Container();



        const mask = new Graphics()
            .rect(
                0,
                0,
                width,
                height
            )
            .fill(0xffffff);



        this.addChild(
            this.content
        );


        this.addChild(
            mask
        );


        this.mask = mask;



        this.eventMode = "static";



        this.on(
            "wheel",
            (event:FederatedWheelEvent)=>{

                this.scroll(
                    event.deltaY
                );

            }
        );

        this.on("pointerdown", (e: FederatedPointerEvent) => {
            this.dragging = true;
            this.lastPointerY = e.global.y;
        });

        this.on("pointermove", (e: FederatedPointerEvent) => {
            if (!this.dragging) return;

            const delta = this.lastPointerY - e.global.y;
            this.lastPointerY = e.global.y;

            this.scroll(delta);
        });

        this.on("pointerup", () => {
            this.dragging = false;
        });

        this.on("pointerupoutside", () => {
            this.dragging = false;
        });

    }



    addContent(
        child:Container
    ){

        this.content.addChild(
            child
        );


        this.updateScroll();

    }



    scroll(
        deltaY:number
    ){


        this.scrollY += deltaY;



        this.scrollY =
            Math.max(
                0,
                Math.min(
                    this.scrollY,
                    this.maxScroll
                )
            );



        this.content.y =
            -this.scrollY;


    }



    refresh(){

        this.updateScroll();

    }



    private updateScroll(){


        const bounds =
            this.content.getLocalBounds();



        this.maxScroll =
            Math.max(
                0,
                bounds.height -
                this.viewportHeight
            );


    }

    clearContent(){

        this.content.removeChildren();

        this.scrollY = 0;
        this.maxScroll = 0;

        this.content.y = 0;

    }


}