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

    private readonly headerHeight = 90;
    private readonly bottomPadding = 30;
    private readonly minHeight = 180;

    private bg: Graphics;

    private skillsContent!: Container;

    private skillsDescriptionContainer?:
        ScrollableContainer;


    constructor(
        private panelWidth: number,
        private maxHeight: number
    ) {

        super();

        this.bg =
            new Graphics();

        this.visible = false;

        this.eventMode = "static";
        this.cursor = "default";

        this.addChild(
            this.bg
        );


        const skillsLabel =
            new LocalizedText(
                "skills",
                {
                    fontFamily: "Oswald-Bold",
                    fontSize: 38,
                    fontWeight: "bold",
                    fill: 0xffde59
                }
            );

        skillsLabel.position.set(
            45,
            15
        );

        this.addChild(
            skillsLabel
        );

        void this.createCloseButton();
    }


    setDealer(
        dealer: DealerData
    ) {

        console.log(
            "SETTING DEALER SKILLS:",
            dealer.name,
            dealer.skills
        );

        this.skillsContent =
            new Container();

        const contentHeight =
            this.createSkillsContent(
                dealer
            );


        const requiredPanelHeight =
            this.headerHeight +
            contentHeight +
            this.bottomPadding;

        const panelHeight =
            Math.min(
                this.maxHeight,
                Math.max(
                    this.minHeight,
                    requiredPanelHeight
                )
            );

        this.redrawBackground(
            panelHeight
        );

        const viewportHeight =
            panelHeight -
            this.headerHeight -
            this.bottomPadding;

        this.rebuildScrollableContainer(
            viewportHeight
        );
    }


    private createSkillsContent(
        dealer: DealerData
    ): number {

        let currentY = 0;


        // NO SKILLS

        if (
            dealer.skills.length === 0
        ) {

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

            return noSkillsText.height;
        }


        // SKILLS

        for (
            const skill of dealer.skills
        ) {

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
                skillName.y +
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


        return Math.max(
            0,
            currentY - 28
        );
    }


    private rebuildScrollableContainer(
        viewportHeight: number
    ) {

        if (
            this.skillsDescriptionContainer
        ) {

            this.removeChild(
                this.skillsDescriptionContainer
            );

            this.skillsDescriptionContainer.destroy({
                children: false
            });
        }


        this.skillsDescriptionContainer =
            new ScrollableContainer(
                530,
                Math.max(
                    1,
                    viewportHeight
                )
            );

        this.skillsDescriptionContainer.position.set(
            45,
            this.headerHeight
        );

        this.skillsDescriptionContainer.addChild(
            this.skillsContent
        );

        this.addChild(
            this.skillsDescriptionContainer
        );
    }


    private redrawBackground(
        panelHeight: number
    ) {

        this.bg.clear();

        this.bg
            .roundRect(
                0,
                0,
                this.panelWidth,
                panelHeight,
                50
            )
            .fill({
                color: 0x000000
            });
    }


    private async createCloseButton() {

        const close =
            new TooltipCloseButton();

        await close.init();


        close.on(
            "pointerdown",
            () => {

                close.scale.set(
                    0.95
                );
            }
        );


        close.on(
            "pointerup",
            () => {

                close.scale.set(
                    1
                );
            }
        );


        close.on(
            "pointerupoutside",
            () => {

                close.scale.set(
                    1
                );
            }
        );


        close.on(
            "pointertap",
            () => {

                this.hide();
            }
        );


        close.position.set(
            this.panelWidth - 86,
            25
        );

        this.addChild(
            close
        );
    }


    show() {

        this.visible = true;
    }


    hide() {

        this.visible = false;
    }
}