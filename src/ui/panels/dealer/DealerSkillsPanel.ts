import { Container, Graphics } from "pixi.js";
import { TooltipCloseButton } from "../../buttons/TooltipCloseButton";
import { LocalizedText } from "../../../localization/LocalizedText";
import { ScrollableContainer } from "../../components/ScrollableContainer";
import { DealerSkillData } from "../../../game/dealers/DealerSkill";

export class DealerSkillsPanel extends Container {
  private readonly topPadding = 30;
  private readonly contentGap = 18;
  private readonly bottomPadding = 30;

  private readonly minHeight = 180;

  private bg: Graphics;

  private content!: Container;

  private scrollableContainer?: ScrollableContainer;

  constructor(
    private readonly panelWidth: number,
    private readonly maxHeight: number,
  ) {
    super();

    this.bg = new Graphics();

    this.visible = false;

    this.eventMode = "static";
    this.cursor = "default";

    this.addChild(this.bg);

    void this.createCloseButton();
  }

  setSkill(skill: DealerSkillData): void {
    this.content = new Container();

    const contentHeight =
      this.createSkillContent(skill);

    const requiredPanelHeight =
      this.topPadding +
      contentHeight +
      this.bottomPadding;

    const panelHeight = Math.min(
      this.maxHeight,
      Math.max(
        this.minHeight,
        requiredPanelHeight,
      ),
    );

    this.redrawBackground(
      panelHeight,
    );

    const viewportHeight =
      panelHeight -
      this.topPadding -
      this.bottomPadding;

    this.rebuildScrollableContainer(
      viewportHeight,
    );
  }

  private createSkillContent(
    skill: DealerSkillData,
  ): number {
    const contentWidth =
      this.panelWidth - 90;

    // SKILL NAME

    const skillName =
      new LocalizedText(
        skill.name,
        {
          fontFamily: "Oswald-Bold",

          fontSize: 32,

          fontWeight: "bold",

          fill: 0xffde59,

          wordWrap: true,

          wordWrapWidth:
            contentWidth - 50,
        },
      );

    skillName.position.set(
      0,
      0,
    );

    // SKILL DESCRIPTION

    const skillDescription =
      new LocalizedText(
        skill.description,
        {
          font: "Open Sans",

          fontSize: 22,

          fill: 0xffffff,

          wordWrap: true,

          wordWrapWidth:
            contentWidth,
        },
      );

    skillDescription.position.set(
      0,
      skillName.height +
        this.contentGap,
    );

    this.content.addChild(
      skillName,
      skillDescription,
    );

    return (
      skillDescription.y +
      skillDescription.height
    );
  }

  private rebuildScrollableContainer(
    viewportHeight: number,
  ): void {
    if (this.scrollableContainer) {
      this.removeChild(
        this.scrollableContainer,
      );

      this.scrollableContainer.destroy({
        children: false,
      });
    }

    this.scrollableContainer =
      new ScrollableContainer(
        this.panelWidth - 90,
        Math.max(
          1,
          viewportHeight,
        ),
      );

    this.scrollableContainer.position.set(
      45,
      this.topPadding,
    );

    this.scrollableContainer.addChild(
      this.content,
    );

    this.addChild(
      this.scrollableContainer,
    );
  }

  private redrawBackground(
    panelHeight: number,
  ): void {
    this.bg.clear();

    this.bg
      .roundRect(
        0,
        0,
        this.panelWidth,
        panelHeight,
        30,
      )
      .fill({
        color: 0x000000,
        alpha: 0.97,
      })
      .stroke({
        color: 0xffde59,
        width: 3,
      });
  }

  private async createCloseButton(): Promise<void> {
    const close =
      new TooltipCloseButton();

    await close.init();

    close.on(
      "pointerdown",
      () => {
        close.scale.set(0.95);
      },
    );

    close.on(
      "pointerup",
      () => {
        close.scale.set(1);
      },
    );

    close.on(
      "pointerupoutside",
      () => {
        close.scale.set(1);
      },
    );

    close.on(
      "pointertap",
      () => {
        this.hide();
      },
    );

    close.position.set(
      this.panelWidth - 70,
      28,
    );

    this.addChild(close);
  }

  show(): void {
    this.visible = true;
  }

  hide(): void {
    this.visible = false;
  }

  showNoSkills(): void {
    this.content = new Container();

    const contentWidth =
      this.panelWidth - 90;

    // LABEL

    const noSkillsLabel = new LocalizedText(
      "noSkillsLabel",
      {
        fontFamily: "Oswald-Bold",
        fontSize: 32,
        fontWeight: "bold",
        fill: 0xffde59,
        wordWrap: true,
        wordWrapWidth: contentWidth - 50,
      },
    );

    noSkillsLabel.position.set(
      0,
      0,
    );

    // DESCRIPTION

    const noSkillsDescription = new LocalizedText(
      "noSkills",
      {
        font: "Open Sans",
        fontSize: 22,
        fill: 0xffffff,
        wordWrap: true,
        wordWrapWidth: contentWidth,
      },
    );

    noSkillsDescription.position.set(
      0,
      noSkillsLabel.height +
        this.contentGap,
    );

    this.content.addChild(
      noSkillsLabel,
      noSkillsDescription,
    );

    const contentHeight =
      noSkillsDescription.y +
      noSkillsDescription.height;

    const requiredPanelHeight =
      this.topPadding +
      contentHeight +
      this.bottomPadding;

    const panelHeight = Math.min(
      this.maxHeight,
      Math.max(
        this.minHeight,
        requiredPanelHeight,
      ),
    );

    this.redrawBackground(
      panelHeight,
    );

    const viewportHeight =
      panelHeight -
      this.topPadding -
      this.bottomPadding;

    this.rebuildScrollableContainer(
      viewportHeight,
    );

    this.show();
  }
}