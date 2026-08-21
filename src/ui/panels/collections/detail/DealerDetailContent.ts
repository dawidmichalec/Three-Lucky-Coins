import { Assets, Container, Graphics, Sprite, Text } from "pixi.js";

import { DealerData } from "../../../../game/dealers/DealerData";
import { LocalizedText } from "../../../../localization/LocalizedText";
import { LayoutManager } from "../../../../core/LayoutManager";
import { ScrollableContainer } from "../../../components/ScrollableContainer";
import { DealerCollectionManager } from "../../../../game/dealers/collection/DealerCollectionManager";

export class DealerDetailContent extends Container {
  private layoutManager = LayoutManager.getInstance();

  private collectionManager = DealerCollectionManager.getInstance();

  private scrollableContainer!: ScrollableContainer;

  private scrollContent = new Container();

  private signatureTokenTooltip!: Container;
  private signatureTokenTooltipVisible = false;

  constructor(private dealer: DealerData) {
    super();
  }

  async init(): Promise<void> {
    this.createDealerName();

    await this.createAvatar();

    this.createScrollableContent();

    this.createSaying();

    await this.createSignatureToken();
  }

  private createDealerName() {
    const name = new Text({
      text: this.dealer.name,
      style: {
        font: "Open Sans",
        fontSize: 50,
        fontWeight: "bold",
        fill: 0xffd21f,
      },
    });

    name.anchor.set(0.5);

    name.position.set(this.layoutManager.DESIGN_WIDTH / 2, 80);

    this.addChild(name);
  }

  private async createAvatar(): Promise<void> {
    const texture = await Assets.load(this.dealer.avatarNormal);

    const avatar = new Sprite(texture);

    avatar.width = 643.4;
    avatar.height = 643.4;

    avatar.position.set(284.6, 180);

    this.addChild(avatar);
  }

  private createScrollableContent() {
    this.scrollableContainer = new ScrollableContainer(520, 1230);

    this.scrollableContainer.position.set(1060.2, 221.1);

    this.scrollContent.position.set(0, 0);

    this.scrollableContainer.addChild(this.scrollContent);

    let currentY = 0;

    const titleLabel = new LocalizedText(this.dealer.title, {
      font: "Open Sans",
      fontSize: 38,
      fontWeight: "bold",
      fill: 0xffd21f,
    });

    titleLabel.position.set(0, currentY);

    currentY = titleLabel.y + titleLabel.height + 24;

    const descriptionLabel = new LocalizedText("dealerDescription", {
      font: "Open Sans",
      fontSize: 38,
      fontWeight: "bold",
      fill: 0xffd21f,
    });

    descriptionLabel.position.set(0, currentY);

    currentY = descriptionLabel.y + descriptionLabel.height + 12;

    const description = new LocalizedText(this.dealer.dealerDescription, {
      font: "Open Sans",
      fontSize: 24,
      fill: 0xffffff,
      wordWrap: true,
      wordWrapWidth: 520,
    });

    description.position.set(0, currentY);

    currentY = description.y + description.height + 24;

    const skillsLabel = new LocalizedText("skills", {
      font: "Open Sans",
      fontSize: 38,
      fontWeight: "bold",
      fill: 0xffd21f,
    });

    skillsLabel.position.set(0, currentY);

    currentY = skillsLabel.y + skillsLabel.height + 12;

    this.scrollContent.addChild(
      titleLabel,
      descriptionLabel,
      description,
      skillsLabel,
    );

    if (this.dealer.skills.length === 0) {
      const noSkills = new LocalizedText("noSkills", {
        font: "Open Sans",
        fontSize: 24,
        fill: 0xffffff,
        wordWrap: true,
        wordWrapWidth: 520,
      });

      noSkills.position.set(0, currentY);

      this.scrollContent.addChild(noSkills);
    } else {
      for (const skill of this.dealer.skills) {
        const skillName = new LocalizedText(skill.name, {
          font: "Open Sans",
          fontSize: 24,
          fontWeight: "bold",
          fill: 0xffffff,
          wordWrap: true,
          wordWrapWidth: 500,
        });

        skillName.position.set(0, currentY);

        const skillDescription = new LocalizedText(skill.description, {
          font: "Open Sans",
          fontSize: 22,
          fill: 0xffffff,
          wordWrap: true,
          wordWrapWidth: 500,
        });

        skillDescription.position.set(0, skillName.y + skillName.height + 6);

        this.scrollContent.addChild(skillName, skillDescription);

        currentY = skillDescription.y + skillDescription.height + 24;
      }
    }

    this.addChild(this.scrollableContainer);

    this.scrollableContainer.refresh();
  }

  private createSaying() {
    const saying = new LocalizedText(this.dealer.saying, {
      fontFamily: "CrimsonPro-Italic",
      fontSize: 38,
      fontWeight: "bold",
      fill: 0xffd21f,
      wordWrap: true,
      wordWrapWidth: 640,
    });

    saying.position.set(287.3, 871.1);

    this.addChild(saying);
  }

  private async createSignatureToken(): Promise<void> {
    const unlocked = this.collectionManager.isSignatureTokenUnlocked(
      this.dealer.id,
    );

    const texturePath = unlocked
      ? this.dealer.signatureToken
      : this.dealer.avatarLocked;

    const texture = await Assets.load(texturePath);

    const token = new Sprite(texture);

    token.width = 120;
    token.height = 120;

    token.position.set(1220, 850);

    token.eventMode = "static";
    token.cursor = "pointer";

    const label = new LocalizedText("signatureToken", {
      font: "Open Sans",
      fontSize: 28,
      fontWeight: "bold",
      fill: 0xffd21f,
    });

    label.position.set(1060, 805);

    this.signatureTokenTooltip = this.createSignatureTokenTooltip(unlocked);

    this.signatureTokenTooltip.position.set(
      token.x + token.width / 2,
      token.y - 20,
    );

    token.on("pointerover", () => {
      this.showSignatureTokenTooltip();
    });

    token.on("pointerout", () => {
      this.hideSignatureTokenTooltip();
    });

    token.on("pointertap", () => {
      this.toggleSignatureTokenTooltip();
    });

    this.addChild(label, token, this.signatureTokenTooltip);
  }

  private createSignatureTokenTooltip(unlocked: boolean): Container {
    const tooltip = new Container();

    tooltip.visible = false;

    const tooltipWidth = 420;

    const background = new Graphics();

    if (!unlocked) {
      const lockedText = new LocalizedText("signatureTokenLocked", {
        font: "Open Sans",
        fontSize: 22,
        fill: 0xffffff,
        wordWrap: true,
        wordWrapWidth: tooltipWidth - 40,
        align: "center",
      });

      lockedText.anchor.set(0.5, 0);

      lockedText.position.set(0, 20);

      const tooltipHeight = lockedText.height + 40;

      background
        .roundRect(-tooltipWidth / 2, 0, tooltipWidth, tooltipHeight, 12)
        .fill({
          color: 0x000000,
          alpha: 0.9,
        });

      tooltip.addChild(background, lockedText);

      return tooltip;
    }

    const tokenName = new LocalizedText(this.dealer.signatureTokenName, {
      font: "Open Sans",
      fontSize: 24,
      fontWeight: "bold",
      fill: 0xffd21f,
      wordWrap: true,
      wordWrapWidth: tooltipWidth - 40,
      align: "center",
    });

    tokenName.anchor.set(0.5, 0);

    tokenName.position.set(0, 18);

    const tokenDescription = new LocalizedText(
      this.dealer.signatureTokenDescription,
      {
        font: "Open Sans",
        fontSize: 20,
        fill: 0xffffff,
        wordWrap: true,
        wordWrapWidth: tooltipWidth - 40,
        align: "center",
      },
    );

    tokenDescription.anchor.set(0.5, 0);

    tokenDescription.position.set(0, tokenName.y + tokenName.height + 10);

    const tooltipHeight = tokenDescription.y + tokenDescription.height + 18;

    background
      .roundRect(-tooltipWidth / 2, 0, tooltipWidth, tooltipHeight, 12)
      .fill({
        color: 0x000000,
        alpha: 0.9,
      });

    tooltip.addChild(background, tokenName, tokenDescription);

    return tooltip;
  }

  private showSignatureTokenTooltip() {
    this.signatureTokenTooltipVisible = true;
    this.signatureTokenTooltip.visible = true;
  }

  private hideSignatureTokenTooltip() {
    this.signatureTokenTooltipVisible = false;
    this.signatureTokenTooltip.visible = false;
  }

  private toggleSignatureTokenTooltip() {
    this.signatureTokenTooltipVisible = !this.signatureTokenTooltipVisible;

    this.signatureTokenTooltip.visible = this.signatureTokenTooltipVisible;
  }
}
