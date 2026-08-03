import { Container, Sprite, Assets } from "pixi.js";

export class ObjectiveButton extends Container {

    private bg!: Sprite;
    private buttonWidth: number;
    private buttonHeight: number;

    constructor(
        private onClick?: () => void
    ){
        super();

        this.buttonWidth = 51.5;
        this.buttonHeight = 51.2;

        this.eventMode = 'static';
        this.cursor = 'pointer';

        this.on("pointerdown", () => {
            this.scale.set(0.95);
        });

        this.on("pointerup", () => {
            this.scale.set(1);
        });

        this.on("pointerupoutside", () => {
            this.scale.set(1);
        });

        this.on("pointertap", () => {
            this.onClick?.();
        });

    }

    async init() {
        const texture = await Assets.load(
            '/assets/main/icons/objective_icon_small.png'
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