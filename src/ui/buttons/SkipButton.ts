import { Container, Sprite, Assets } from "pixi.js";
import { LocalizedText } from "../../localization/LocalizedText";

export class SkipButton extends Container{
    private bg!: Sprite;
    private buttonWidth: number;
    private buttonHeight: number;

    constructor(){
        super();

        this.buttonWidth = 175;
        this.buttonHeight = 175;
        
        this.eventMode = 'static';
        this.cursor = 'pointer';
    }

    async init() {
        const texture = await Assets.load(
            '/assets/main/icons/skip_button_icon.png'
        );
    
        this.bg = new Sprite(texture);
    
        const scaleX = this.buttonWidth / this.bg.texture.width;
        const scaleY = this.buttonHeight / this.bg.texture.height;

        this.bg.scale.set(scaleX, scaleY);

        const skipLabel = new LocalizedText(
            "skip",
            {
                font: "Open Sans",
                fontWeight: "bold",
                fill: 0xffffff
            }
        );

        skipLabel.anchor.set(0.5, 0);
        skipLabel.position.set(75, (this.bg.height-skipLabel.height)/2);

        this.bg.addChild(skipLabel);

        this.addChild(this.bg);
    }

}