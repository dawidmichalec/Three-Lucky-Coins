import { Container, Graphics, Text } from "pixi.js";

import { LocalizedText } from "../../localization/LocalizedText";

import { TranslationKey } from "../../core/LocalizationManager";

import { LocalizationManager } from "../../core/LocalizationManager";

export interface PerkMilestoneMessage {
  name: TranslationKey;
  multiplier: number;
  bonusPercentage: number;
  appliesFrom: "current" | "next";
}

export enum PerkEffectMessageType {
  POSITIVE = "positive",
  NEGATIVE = "negative",
}

export class PerkEffectMessageOverlay extends Container {
  private readonly barHeight = 180;

  private background: Graphics;

  private messageContainer: Container;

  private messageLabel: LocalizedText;

  private valueLabel: Text;

  private suffixLabel: LocalizedText;

  private animationFrameId?: number;

  private isAnimating = false;

  constructor(
    private screenWidth: number,
    private screenHeight: number,
  ) {
    super();

    this.eventMode = "none";

    this.visible = false;

    this.alpha = 0;

    this.background = new Graphics()
      .rect(0, 0, this.screenWidth, this.barHeight)
      .fill({
        color: 0x000000,
        alpha: 0.8,
      });

    this.background.position.set(0, (this.screenHeight - this.barHeight) / 2);

    this.messageContainer = new Container();

    this.messageContainer.position.set(
      this.screenWidth / 2,
      this.screenHeight / 2,
    );

    this.messageLabel = new LocalizedText("winningsIncreasedBy", {
      fontFamily: "Anek-Kannada Bold",

      fontSize: 64,

      fontWeight: "bold",

      fill: 0x39ff14,
    });

    this.valueLabel = new Text({
      text: "",

      style: {
        fontFamily: "Anek-Kannada Bold",

        fontSize: 64,

        fontWeight: "bold",

        fill: 0x39ff14,
      },
    });

    this.suffixLabel = new LocalizedText("accepted", {
      fontFamily: "Anek-Kannada Bold",
      fontSize: 64,
      fontWeight: "bold",
      fill: 0x39ff14,
    });

    this.messageContainer.addChild(
      this.messageLabel,
      this.valueLabel,
      this.suffixLabel,
    );

    this.addChild(this.background, this.messageContainer);
  }

  async play(
    message: TranslationKey,
    value = "",
    type: PerkEffectMessageType = PerkEffectMessageType.POSITIVE,
    visibleDuration = 850,
    suffix?: TranslationKey,
  ): Promise<void> {
    if (this.isAnimating) {
      return;
    }

    this.messageLabel.setKey(message);

    this.valueLabel.text = value;

    if (suffix) {
      this.suffixLabel.setKey(suffix);
      this.suffixLabel.visible = true;
    } else {
      this.suffixLabel.visible = false;
    }

    this.setMessageStyle(type);

    this.updateMessageLayout();

    this.isAnimating = true;

    this.visible = true;

    this.alpha = 0;

    this.messageContainer.scale.set(0.88);

    await this.fadeIn(250);

    await this.delay(visibleDuration);

    await this.fadeOut(300);

    this.visible = false;

    this.alpha = 0;

    this.messageContainer.scale.set(1);

    this.isAnimating = false;
  }

  private updateMessageLayout(): void {
    const spacing = 20;

    const valueWidth =
      this.valueLabel.text
        ? spacing + this.valueLabel.width
        : 0;

    const suffixWidth =
      this.suffixLabel.visible
        ? spacing + this.suffixLabel.width
        : 0;

    const totalWidth =
      this.messageLabel.width +
      valueWidth +
      suffixWidth;

    let currentX = -totalWidth / 2;

    this.messageLabel.position.set(
      currentX,
      -this.messageLabel.height / 2,
    );

    currentX += this.messageLabel.width;

    if (this.valueLabel.text) {
      currentX += spacing;

      this.valueLabel.position.set(
        currentX,
        -this.valueLabel.height / 2,
      );

      currentX += this.valueLabel.width;
    }

    if (this.suffixLabel.visible) {
      currentX += spacing;

      this.suffixLabel.position.set(
        currentX,
        -this.suffixLabel.height / 2,
      );
    }
  }

  private setMessageStyle(type: PerkEffectMessageType): void {
    const positive = type === PerkEffectMessageType.POSITIVE;

    const fill = positive ? 0x39ff14 : 0xff3131;

    const shadowColor = positive ? "#00ff66" : "#ff0000";

    this.messageLabel.style.fill = fill;

    this.valueLabel.style.fill = fill;

    this.suffixLabel.style.fill = fill;

    /*
            Pixi wymaga angle w TextDropShadow,
            nawet jeśli distance = 0.
        */

    this.messageLabel.style.dropShadow = {
      alpha: 1,
      blur: 18,
      color: shadowColor,
      distance: 0,
      angle: 0,
    };

    this.valueLabel.style.dropShadow = {
      alpha: 1,
      blur: 18,
      color: shadowColor,
      distance: 0,
      angle: 0,
    };

    this.suffixLabel.style.dropShadow = {
      alpha: 1,
      blur: 18,
      color: shadowColor,
      distance: 0,
      angle: 0,
    };
  }

  private fadeIn(duration: number): Promise<void> {
    return new Promise((resolve) => {
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const progress = Math.min(1, (currentTime - startTime) / duration);

        const eased = 1 - Math.pow(1 - progress, 3);

        this.alpha = eased;

        const punch = Math.sin(progress * Math.PI);

        const scale = 0.88 + eased * 0.12 + punch * 0.04;

        this.messageContainer.scale.set(scale);

        if (progress < 1) {
          this.animationFrameId = requestAnimationFrame(animate);

          return;
        }

        this.alpha = 1;

        this.messageContainer.scale.set(1);

        this.animationFrameId = undefined;

        resolve();
      };

      this.animationFrameId = requestAnimationFrame(animate);
    });
  }

  private fadeOut(duration: number): Promise<void> {
    return new Promise((resolve) => {
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const progress = Math.min(1, (currentTime - startTime) / duration);

        this.alpha = 1 - progress;

        if (progress < 1) {
          this.animationFrameId = requestAnimationFrame(animate);

          return;
        }

        this.animationFrameId = undefined;

        resolve();
      };

      this.animationFrameId = requestAnimationFrame(animate);
    });
  }

  private delay(milliseconds: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, milliseconds);
    });
  }

  
  async playMilestoneSummary(
    entries: readonly PerkMilestoneMessage[],
  ): Promise<void> {
    if (entries.length === 0 || this.isAnimating) {
      return;
    }

    const localization =
      LocalizationManager.getInstance();

    const heading = localization.t(
      "perkBonusesUpdated",
    );

    const rows = entries.map((entry) => {
      const timingKey =
        entry.appliesFrom === "current"
          ? "perkBonusCurrentWin"
          : "perkBonusNextWin";

      const timing = localization.t(timingKey);

      return (
        `${localization.t(entry.name)} ` +
        `x${entry.multiplier} ` +
        `+${entry.bonusPercentage}% ` +
        `(${timing})`
      );
    });

    const summaryText = new Text({
      text: [heading, ...rows].join("\n"),
      style: {
        fontFamily: "Anek-Kannada Bold",
        fontSize: 40,
        lineHeight: 54,
        fontWeight: "bold",
        fill: 0x39ff14,
        align: "center",
      },
    });

    summaryText.anchor.set(0.5);

    this.isAnimating = true;

    this.messageLabel.visible = false;
    this.valueLabel.visible = false;
    this.suffixLabel.visible = false;

    this.messageContainer.addChild(summaryText);

    this.visible = true;
    this.alpha = 0;
    this.messageContainer.scale.set(0.88);

    try {
      await this.fadeIn(250);
      await this.delay(1100);
      await this.fadeOut(300);
    } finally {
      summaryText.destroy();

      this.visible = false;
      this.alpha = 0;
      this.messageContainer.scale.set(1);

      this.messageLabel.visible = true;
      this.valueLabel.visible = true;

      this.isAnimating = false;
    }
  }

}
