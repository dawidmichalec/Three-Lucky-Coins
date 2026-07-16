import { Container, Graphics } from "pixi.js";


export class ScrollableContainer extends Container {


    private content: Container;

    private maxScroll = 0;

    private scrollY = 0;

    private viewportHeight: number;



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
            (event:any)=>{

                this.scroll(
                    event.deltaY
                );

            }
        );

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