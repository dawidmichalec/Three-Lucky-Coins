import { Container, Sprite, Assets } from "pixi.js";

export class SoundButton extends Container{

    private bg!: Sprite;
    private buttonWidth: number;
    private buttonHeight: number;
    private isMuted: boolean;

    constructor(){
        super();

        this.buttonWidth = 80;
        this.buttonHeight = 80;
        this.isMuted = false;

        this.eventMode = 'static';
        this.cursor = 'pointer';
    }

    async init() {
        const texture = await Assets.load(
            '/assets/main/icons/sound_on_icon.png'
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