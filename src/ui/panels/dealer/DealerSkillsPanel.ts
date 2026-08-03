import { Container, Graphics, Text } from "pixi.js";
import { TooltipCloseButton } from "../../buttons/TooltipCloseButton";
import { LocalizedText } from "../../../localization/LocalizedText";
import { ScrollableContainer } from "../../components/ScrollableContainer";

export class DealerSkillsPanel extends Container {

    private bg: Graphics;
    private skillsDescriptionContainer!: ScrollableContainer;

    constructor(width: number, height: number) {
        super();

        this.bg = new Graphics()
            .roundRect(0, 0, width, height, 50)
            .fill({ color: 0x000000 });

        this.visible = false;

        this.eventMode = "static";
        this.cursor = "default";

        this.addChild(this.bg);

        const skillsLabel = new LocalizedText(
            "skills",
            {
                fontFamily: "Oswald-Bold",
                fontSize: 38,
                fontWeight: "bold",
                fill: 0xffde59,
                wordWrap: true,
                wordWrapWidth: 200
            }
        );

        skillsLabel.position.set(45, 15);

        // CREATED ONLY FOR TESTING PURPOSES

        const skillName = new Text({
            text: "Hint",
            style: {
                font: "Open Sans",
                fill: 0xffffff,
                fontWeight: "bold",
                fontSize: 24
            },
        });

        skillName.position.set(0,0);

        this.createSkillsDescriptionContainer();

        this.skillsDescriptionContainer.addChild(skillName);

        this.createCloseButton();


        this.addChild(
            skillsLabel,
        )

    }

    private createSkillsDescriptionContainer(){

        this.skillsDescriptionContainer =
        new ScrollableContainer(
            530,
            433
        );


        this.skillsDescriptionContainer.position.set(
            45,
            90
        );


        this.addChild(
            this.skillsDescriptionContainer
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