import { Container, Sprite, Assets } from "pixi.js";

export class HamburgerMenuButton extends Container{
    private bg!: Sprite;
    private buttonWidth: number;
    private buttonHeight: number;

    constructor(){
        super();

        this.buttonWidth = 100;
        this.buttonHeight = 100;

        this.eventMode = 'static';
        this.cursor = 'pointer';
    }

    async init() {
        const texture = await Assets.load(
            '/assets/main/icons/hamburger_menu_icon.png'
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
}