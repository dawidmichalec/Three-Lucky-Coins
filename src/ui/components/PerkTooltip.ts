import { Container, Graphics } from "pixi.js";

import { LocalizedText } from "../../localization/LocalizedText";
import { PerkReward } from "../../game/perks/reward/PerkReward";
import { PerkTooltipCloseButton } from "../buttons/PerkTooltipCloseButton";

export class PerkTooltip extends Container {
  private readonly tooltipWidth = 380;

  private readonly contentWidth = 320;

  private readonly minimumHeight = 220;

  private readonly onClose: () => void;

  constructor(reward: PerkReward, onClose: () => void) {
    super();

    this.onClose = onClose;

    this.eventMode = "static";

    /*
            PERK NAME
        */

    const perkName = new LocalizedText(reward.perk.name, {
      fontFamily: "JackCondensed",

      fontWeight: "bold",

      fontSize: 30,

      fill: 0xffd21f,

      wordWrap: true,

      wordWrapWidth: this.contentWidth,

      align: "center",
    });

    perkName.anchor.set(0.5, 0);

    perkName.position.set(this.tooltipWidth / 2, 30);

    /*
            DESCRIPTION
        */

    const description = new LocalizedText(reward.variant.description, {
      font: "Open Sans",

      fontWeight: "bold",

      fontSize: 20,

      fill: 0xffffff,

      wordWrap: true,

      wordWrapWidth: this.contentWidth,

      align: "left",
    });

    description.position.set((this.tooltipWidth - this.contentWidth) / 2, 90);

    /*
            HEIGHT CALCULATED FROM CONTENT
        */

    const tooltipHeight = Math.max(
      this.minimumHeight,

      description.y + description.height + 30,
    );

    /*
            BACKGROUND
        */

    const bg = new Graphics()
      .roundRect(0, 0, this.tooltipWidth, tooltipHeight, 16)
      .fill({
        color: 0x111111,

        alpha: 0.97,
      })
      .stroke({
        color: 0xffde59,

        width: 4,
      });

    /*
            Nie przepuszczamy pointertap
            przez tooltip.
        */

    this.on("pointertap", (event) => {
      event.stopPropagation();
    });

    this.addChild(bg, perkName, description);
  }

  async init(): Promise<void> {
    await this.createCloseButton();
  }

  private async createCloseButton(): Promise<void> {
    const close = new PerkTooltipCloseButton();

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

    close.on("pointertap", (event) => {
      event.stopPropagation();

      this.onClose();
    });

    close.position.set(this.tooltipWidth - 45, 40);

    this.addChild(close);
  }

  show(): void {
    this.visible = true;
  }

  hide(): void {
    this.visible = false;
  }
}
