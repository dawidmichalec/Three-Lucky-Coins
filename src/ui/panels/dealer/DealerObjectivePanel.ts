import { Container, Graphics, Text } from "pixi.js";
import { TooltipCloseButton } from "../../buttons/TooltipCloseButton";
import { LocalizedText } from "../../../localization/LocalizedText";

export class DealerObjectivePanel extends Container {

    private bg: Graphics;

    constructor(width:number, height:number) {
        super();

        this.bg = new Graphics()
                    .roundRect(0, 0, width, height, 50)
                    .fill({ color: 0x000000 });
        
                this.visible = true;
        
        this.addChild(this.bg);

        this.visible = false;

        this.eventMode = "static";
        this.cursor = "default";

        const objectiveLabel = new LocalizedText(
            "objective",
            {
                fontFamily: "Oswald-Bold",
                fontSize: 38,
                fontWeight: "bold",
                fill: 0xffde59,
                wordWrap: true,
                wordWrapWidth: 200
            }
        );

        objectiveLabel.position.set(45, 15);

        const objectiveDescriptionDummy= new Text({
            text: "Achieve a balance of 100 000",
            style: {
                font: "Open Sans",
                fill: 0xffffff,
                fontWeight: "bold",
                fontSize: 24
            },
        }); 

        objectiveDescriptionDummy.position.set(45, 90);

        this.createCloseButton();

        this.addChild(
            objectiveLabel,
            objectiveDescriptionDummy
        );

    }

    async createCloseButton() {
            const close = new TooltipCloseButton();
    
            await close.init();
    
            close.on("pointerdown", () => {
                close.scale.set(0.95);
            });
    
            close.on("pointerup", () => {
                close.scale.set(1);
            });
    
            close.on("pointerupoutside", () => {
                close.scale.set(1);
            });
    
            close.on("pointertap", () => {
                this.hide();
            });
    
            close.position.set(
                540,
                25
            );
    
            this.addChild(close);
        }

    show() {
        this.visible = true;
    }

    hide() {
        this.visible = false;
    }

}