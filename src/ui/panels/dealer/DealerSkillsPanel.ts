import {
    Container,
    Graphics
} from "pixi.js";

import {
    TooltipCloseButton
} from "../../buttons/TooltipCloseButton";

import {
    LocalizedText
} from "../../../localization/LocalizedText";

import {
    ScrollableContainer
} from "../../components/ScrollableContainer";

import {
    DealerData
} from "../../../game/dealers/DealerData";


export class DealerSkillsPanel extends Container {

    private bg: Graphics;

    private skillsContent!: Container;

    private skillsDescriptionContainer!:
        ScrollableContainer;


    constructor(
        width: number,
        height: number
    ) {

        super();

        this.bg = new Graphics()
            .roundRect(
                0,
                0,
                width,
                height,
                50
            )
            .fill({
                color: 0x000000
            });

        this.visible = false;

        this.eventMode = "static";
        this.cursor = "default";

        this.addChild(this.bg);

        const skillsLabel =
            new LocalizedText(
                "skills",
                {
                    fontFamily:
                        "Oswald-Bold",

                    fontSize: 38,

                    fontWeight:
                        "bold",

                    fill:
                        0xffde59
                }
            );

        skillsLabel.position.set(
            45,
            15
        );

        this.createSkillsDescriptionContainer();

        this.createCloseButton();

        this.addChild(
            skillsLabel
        );
    }


    setDealer(dealer: DealerData) {

        this.skillsContent.removeChildren();

        console.log(
            "SETTING DEALER SKILLS:",
            dealer.name,
            dealer.skills
        );

        if (dealer.skills.length === 0) {

            const noSkillsText =
                new LocalizedText(
                    "noSkills",
                    {
                        font: "Open Sans",
                        fontSize: 24,
                        fill: 0xffffff,
                        wordWrap: true,
                        wordWrapWidth: 500
                    }
                );

            noSkillsText.position.set(
                0,
                0
            );

            this.skillsContent.addChild(
                noSkillsText
            );

            return;
        }

        this.createSkillRows(dealer);
    }


    private createSkillRows(
        dealer: DealerData
    ) {

        let currentY = 0;

        for (const skill of dealer.skills) {

            const skillName =
                new LocalizedText(
                    skill.name,
                    {
                        font: "Open Sans",
                        fontSize: 24,
                        fontWeight: "bold",
                        fill: 0xffffff,
                        wordWrap: true,
                        wordWrapWidth: 500
                    }
                );

            skillName.position.set(
                0,
                currentY
            );

            const skillDescription =
                new LocalizedText(
                    skill.description,
                    {
                        font: "Open Sans",
                        fontSize: 22,
                        fill: 0xffffff,
                        wordWrap: true,
                        wordWrapWidth: 500
                    }
                );

            skillDescription.position.set(
                0,
                currentY +
                skillName.height +
                6
            );

            this.skillsContent.addChild(
                skillName,
                skillDescription
            );

            currentY =
                skillDescription.y +
                skillDescription.height +
                28;
        }
    }


    private createSkillsDescriptionContainer() {

        this.skillsDescriptionContainer =
            new ScrollableContainer(
                530,
                433
            );

        this.skillsDescriptionContainer.position.set(
            45,
            90
        );

        this.skillsContent =
            new Container();

        this.skillsDescriptionContainer.addChild(
            this.skillsContent
        );

        this.addChild(
            this.skillsDescriptionContainer
        );
    }


    private async createCloseButton() {

        const close =
            new TooltipCloseButton();

        await close.init();

        close.on(
            "pointerdown",
            () => {
                close.scale.set(0.95);
            }
        );

        close.on(
            "pointerup",
            () => {
                close.scale.set(1);
            }
        );

        close.on(
            "pointerupoutside",
            () => {
                close.scale.set(1);
            }
        );

        close.on(
            "pointertap",
            () => {
                this.hide();
            }
        );

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