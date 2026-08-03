import { Container, Graphics } from "pixi.js";

export class PerkContainer extends Container {

    private bg: Graphics;

    constructor(width: number, height:number) {
        super();

        this.bg = new Graphics()
                    .rect(0, 0, width, height)
                    .fill({ color: 0x4ca626, alpha: 0.25 });
        
                this.visible = true;
        
        this.addChild(this.bg);
    }

}