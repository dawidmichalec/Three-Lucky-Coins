import { Assets, Container, Graphics, Sprite } from "pixi.js";

import { LocalizedText } from "../../localization/LocalizedText";
import { PerkReward } from "../../game/perks/reward/PerkReward";

export class PerkRewardCard extends Container {
  private readonly selectionBorder: Graphics;

  private isSelected = false;

  private readonly contentWidth = 320;

  constructor(
    private readonly reward: PerkReward,
    private readonly cardWidth: number,
    private readonly cardHeight: number,
    private readonly onSelect: () => void,
  ) {
    super();

    this.eventMode = "static";
    this.cursor = "pointer";

    this.selectionBorder = new Graphics()
      .rect(6, 6, this.cardWidth - 12, this.cardHeight - 12)
      .stroke({
        color: 0xffde59,
        width: 12,
      });

    this.selectionBorder.visible = false;

    this.on("pointertap", () => {
      this.onSelect();
    });

    this.addChild(this.selectionBorder);

    void this.init().catch((error) => {
      console.error(
        "FAILED TO INITIALIZE PERK REWARD CARD:",
        this.reward.perk.id,
        this.reward.variant.rarity,
        error,
      );
    });
  }

  private async init(): Promise<void> {
    await this.createPerkIcon();

    this.createPerkName();

    this.createDescription();
  }

  private async createPerkIcon(): Promise<void> {
    const assetPath = this.reward.variant.assets.mid;

    console.log("LOADING PERK ICON:", this.reward.perk.id, assetPath);

    const texture = await Assets.load(this.reward.variant.assets.mid);

    const perkIcon = new Sprite(texture);

    perkIcon.anchor.set(0.5);

    perkIcon.position.set(this.cardWidth / 2, 115);

    this.addChild(perkIcon);
  }

  private createPerkName(): void {
    const perkName = new LocalizedText(this.reward.perk.name, {
      font: "JackCondensed",
      fontWeight: "bold",
      fontSize: 34,
      fill: 0xffd21f,

      wordWrap: true,
      wordWrapWidth: this.contentWidth,

      align: "center",
    });

    perkName.anchor.set(0.5, 0);

    perkName.position.set(this.cardWidth / 2, 220);

    this.addChild(perkName);
  }

  private createDescription(): void {
    const descriptionViewportHeight = 210;

    const descriptionContainer = new Container();

    descriptionContainer.position.set(
      (this.cardWidth - this.contentWidth) / 2,
      300,
    );

    const description = new LocalizedText(this.reward.variant.description, {
      font: "Open Sans",
      fontWeight: "bold",
      fontSize: 28,
      fill: 0xffd21f,

      wordWrap: true,
      wordWrapWidth: this.contentWidth,

      align: "left",
    });

    const mask = new Graphics()
      .rect(0, 0, this.contentWidth, descriptionViewportHeight)
      .fill({
        color: 0xffffff,
      });

    descriptionContainer.addChild(description);

    this.addChild(descriptionContainer, mask);

    mask.position.copyFrom(descriptionContainer.position);

    descriptionContainer.mask = mask;

    descriptionContainer.eventMode = "static";

    descriptionContainer.on("wheel", (event) => {
      const minimumY = Math.min(
        0,
        descriptionViewportHeight - description.height,
      );

      const nextY = description.y - event.deltaY * 0.5;

      description.y = Math.max(minimumY, Math.min(0, nextY));
    });
  }

  setSelected(selected: boolean): void {
    this.isSelected = selected;

    this.selectionBorder.visible = selected;
  }

  getSelected(): boolean {
    return this.isSelected;
  }

  getReward(): PerkReward {
    return this.reward;
  }
}
