import { Container, Sprite, Assets } from "pixi.js";

export class ClosePanelButton extends Container{
    private bg!: Sprite;
    private buttonWidth: number;
    private buttonHeight: number;

    constructor(){
        super();

        this.buttonWidth = 50;
        this.buttonHeight = 50;

        this.eventMode = 'static';
        this.cursor = 'pointer';
    }

    async init() {
        const texture = await Assets.load(
            '/assets/main/icons/close_button_icon.png'
        );
    
        this.bg = new Sprite(texture);
    
        const scaleX = this.buttonWidth / this.bg.texture.width;
        const scaleY = this.buttonHeight / this.bg.texture.height;

        this.bg.scale.set(scaleX, scaleY);

        this.addChild(this.bg);
    }

}