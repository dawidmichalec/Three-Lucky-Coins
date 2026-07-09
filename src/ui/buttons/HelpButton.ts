import { Container, Sprite, Assets } from "pixi.js";

export class HelpButton extends Container{

    private bg!: Sprite;
    private buttonWidth: number;
    private buttonHeight: number;

    constructor(){
        super();

        this.buttonHeight = 70;
        this.buttonWidth = 70;
        this.visible = false;

        this.eventMode = 'static';
        this.cursor = 'pointer';
    }

    async init() {
        const texture = await Assets.load(
            '/assets/main/icons/help_button_icon.png'
        );
    
        this.bg = new Sprite(texture);
    
        const scaleX = this.buttonWidth / this.bg.texture.width;
        const scaleY = this.buttonHeight / this.bg.texture.height;

        this.bg.scale.set(scaleX, scaleY);

        this.addChild(this.bg);
    }

    setDisabled(value: boolean) {
        this.eventMode = value ? 'none' : 'static';
        this.alpha = value ? 0.85 : 1;
    }

    hide(){
        this.visible = false;
    }

    show() {
        this.visible = true;
    }
}