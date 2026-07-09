import { Container, Sprite, Assets } from "pixi.js";

export class RestartRunButton extends Container{

    private bg!: Sprite;
    private buttonWidth: number;
    private buttonHeight: number;

    constructor(){
        super();

        this.buttonHeight = 80;
        this.buttonWidth = 80;

        this.eventMode = 'static';
        this.cursor = 'pointer';
    }

    async init() {
        const texture = await Assets.load(
            '/assets/main/icons/restart_run_icon.png'
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