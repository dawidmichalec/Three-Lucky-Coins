import { Container, Graphics, Text, wordWrap} from "pixi.js";

export class DealerCardBackground extends Container {

    private bg!: Graphics;

    constructor(width:number, height:number){
        super();

        this.bg = new Graphics()
            .roundRect(0, 0, width, height, 50)
            .fill({ color: 0x000000 });

        this.addChild(this.bg);
    }

}