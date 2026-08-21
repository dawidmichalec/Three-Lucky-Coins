import { Container, Graphics } from "pixi.js";
import { LocalizedText } from "../../localization/LocalizedText";
import { TranslationKey } from "../../core/LocalizationManager";

export class GameMessageOverlay extends Container {
  private readonly barHeight = 245;

  private background: Graphics;

  private messageLabel: LocalizedText;

  private animationFrameId?: number;

  private isAnimating = false;

  constructor(
    private screenWidth: number,
    private screenHeight: number,
  ) {
    super();

    this.eventMode = "static";
    this.cursor = "default";

    /*
            Cały komponent zaczyna jako niewidoczny.
        */

    this.visible = false;
    this.alpha = 0;

    this.background = new Graphics()
      .rect(0, 0, this.screenWidth, this.barHeight)
      .fill({
        color: 0x000000,
        alpha: 0.8,
      });

    /*
            Pas ustawiamy dokładnie
            na środku wysokości ekranu.
        */

    this.background.position.set(0, (this.screenHeight - this.barHeight) / 2);

    this.messageLabel = new LocalizedText("youWon", {
      fontFamily: "Anek-Kannada Bold",

      fontSize: 92,

      fontWeight: "bold",

      fill: 0xffd21f,

      dropShadow: {
        alpha: 1,
        blur: 18,
        color: "#ffaa00",
        distance: 0,
      },
    });

    this.messageLabel.anchor.set(0.5);

    this.messageLabel.position.set(this.screenWidth / 2, this.screenHeight / 2);

    this.addChild(this.background, this.messageLabel);
  }

  async play(message: TranslationKey, visibleDuration = 1200): Promise<void> {
    if (this.isAnimating) {
      return;
    }

    this.messageLabel.setKey(message);

    this.isAnimating = true;
    this.visible = true;
    this.alpha = 0;

    this.messageLabel.scale.set(0.88);

    await this.fadeIn(350);
    await this.delay(visibleDuration);
    await this.fadeOut(450);

    this.visible = false;
    this.alpha = 0;

    this.messageLabel.scale.set(1);

    this.isAnimating = false;
  }

  private fadeIn(duration: number): Promise<void> {
    return new Promise((resolve) => {
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const progress = Math.min(1, (currentTime - startTime) / duration);

        /*
                    Delikatne wygładzenie ruchu.
                */

        const easedProgress = 1 - Math.pow(1 - progress, 3);

        this.alpha = easedProgress;

        /*
                    Tekst:
                    0.88 → 1.04 → 1
                */

        const punch = Math.sin(progress * Math.PI);

        const scale = 0.88 + easedProgress * 0.12 + punch * 0.04;

        this.messageLabel.scale.set(scale);

        if (progress < 1) {
          this.animationFrameId = requestAnimationFrame(animate);

          return;
        }

        this.alpha = 1;

        this.messageLabel.scale.set(1);

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

        this.alpha = 0;

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

  override destroy(options?: Parameters<Container["destroy"]>[0]) {
    if (this.animationFrameId !== undefined) {
      cancelAnimationFrame(this.animationFrameId);
    }

    super.destroy(options);
  }
}
