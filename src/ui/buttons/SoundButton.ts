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
        this.visible = false;

        this.eventMode = 'static';
        this.cursor = 'pointer';

        this.on("click", () => {

            this.toggle();

        });
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

    hide(){
        this.visible = false;
    }

    show() {
        this.visible = true;
    }

    async toggle() {
        if (this.isMuted === false){
            this.isMuted = true;
            const sound_off = await Assets.load(
            '/assets/main/icons/sound_off_icon.png'
            );
    
            this.bg.texture = sound_off;
        } else {
            this.isMuted = false;
            const sound_on = await Assets.load(
            '/assets/main/icons/sound_on_icon.png'
            );

            this.bg.texture = sound_on;
        }
    }
}