import { Application } from "pixi.js";

interface LayoutListener {
    onLayoutChanged(): void;
}


export class LayoutManager {

    private static instance: LayoutManager;
    private app: Application;

    private listeners: LayoutListener[] = [];

    readonly DESIGN_WIDTH = 1920;
    readonly DESIGN_HEIGHT = 1080;


    screenWidth = 0;
    screenHeight = 0;


    scale = 1;


    private constructor(){}



    static getInstance(){

        if(!LayoutManager.instance){

            LayoutManager.instance = new LayoutManager();

        }

        return LayoutManager.instance;
    }



    initialize(app: Application){

        this.app = app;


        const resize = () => {

            this.update(
                window.innerWidth,
                window.innerHeight
            );

        };


        resize();


        window.addEventListener(
            "resize",
            resize
        );

    }


    get scaleX(){

        return this.scale;

    }


    get scaleY(){

        return this.scale;

    }



    register(listener: LayoutListener){

        this.listeners.push(listener);

    }



    private notify(){

        for(const listener of this.listeners){

            listener.onLayoutChanged();

        }

    }



    update(
        width:number,
        height:number
    ){

        this.screenWidth = width;
        this.screenHeight = height;

        console.log(
            "LAYOUT UPDATE",
            width,
            height
        );


        const scaleX =
            width / this.DESIGN_WIDTH;


        const scaleY =
            height / this.DESIGN_HEIGHT;


        this.scale =
            Math.min(
                scaleX,
                scaleY
            );


        this.notify();

    }



    get offsetX(){

        return (
            this.screenWidth -
            this.DESIGN_WIDTH * this.scale
        ) / 2;

    }

    get offsetY(){

        return (
            this.screenHeight -
            this.DESIGN_HEIGHT * this.scale
        ) / 2;

    }
}