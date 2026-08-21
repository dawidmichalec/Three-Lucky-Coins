import { Assets, Container, Sprite, Texture } from "pixi.js";
import { LocalizedText } from "../../../localization/LocalizedText";
import { CardColor } from "../../../game/gambleForMore/games/redBlackCard/RedBlackCardTypes";
import { AudioManager } from "../../../core/AudioManager";
import { SoundId } from "../../../audio/SoundId";

export class RedBlackCardView extends Container {
  private redCard!: Sprite;
  private blackCard!: Sprite;

  private redTexture!: Texture;
  private blackTexture!: Texture;
  private cardBackTexture!: Texture;

  private readonly cardWidth = 228.4;
  private readonly cardHeight = 342.7;

  private readonly redStartX = 220;
  private readonly blackStartX = 750;
  private readonly cardY = 90;
  private readonly centerX = 600;

  private audioManager = AudioManager.getInstance();

  constructor(width: number) {
    super();

    const gameName = new LocalizedText("redCardBlackCardLabel", {
      fontFamily: "Old Standard Regular",
      fontSize: 48,
      fill: 0xffd21f,
    });

    gameName.position.set(width / 2, 20);
    gameName.anchor.set(0.5);

    this.addChild(gameName);
  }

  async init(): Promise<void> {
    await this.createCards();
  }

  private async createCards(): Promise<void> {
    this.redTexture = await Assets.load(
      "/assets/main/icons/cards/red_card.png",
    );

    this.blackTexture = await Assets.load(
      "/assets/main/icons/cards/black_card.png",
    );

    this.cardBackTexture = await Assets.load(
      "/assets/main/icons/cards/card_back.png",
    );

    this.redCard = new Sprite(this.redTexture);
    this.blackCard = new Sprite(this.blackTexture);

    this.redCard.width = this.cardWidth;
    this.redCard.height = this.cardHeight;

    this.blackCard.width = this.cardWidth;
    this.blackCard.height = this.cardHeight;

    this.redCard.anchor.set(0.5);
    this.blackCard.anchor.set(0.5);

    this.redCard.position.set(
      this.redStartX + this.cardWidth / 2,
      this.cardY + this.cardHeight / 2,
    );

    this.blackCard.position.set(
      this.blackStartX + this.cardWidth / 2,
      this.cardY + this.cardHeight / 2,
    );

    this.addChild(this.redCard, this.blackCard);
  }

  async startShuffle(): Promise<void> {
    await this.flipToBack();
    await this.shuffleCards();
    await this.stackCards();
  }

  private async flipToBack(): Promise<void> {
    const redBaseScaleX = this.redCard.scale.x;
    const blackBaseScaleX = this.blackCard.scale.x;

    await this.animate(200, (progress) => {
      this.redCard.scale.x = redBaseScaleX * (1 - progress);

      this.blackCard.scale.x = blackBaseScaleX * (1 - progress);
    });

    this.redCard.texture = this.cardBackTexture;
    this.blackCard.texture = this.cardBackTexture;

    await this.animate(200, (progress) => {
      this.redCard.scale.x = redBaseScaleX * progress;

      this.blackCard.scale.x = blackBaseScaleX * progress;
    });
  }

  private async shuffleCards(): Promise<void> {
    const redStartX = this.redCard.x;
    const blackStartX = this.blackCard.x;

    let soundOnePlayed = false;
    let soundTwoPlayed = false;
    let soundThreePlayed = false;
    let soundFourPlayed = false;

    await this.animate(900, (progress) => {
      const wave = Math.sin(progress * Math.PI * 8) * 100;

      this.redCard.x = redStartX + (this.centerX - redStartX) * progress + wave;

      this.blackCard.x =
        blackStartX + (this.centerX - blackStartX) * progress - wave;

      if (!soundOnePlayed && progress >= 0.15) {
        soundOnePlayed = true;

        this.audioManager.play(SoundId.CARD_SWIPE, {
          loop: false,
          volume: 0.7,
        });
      }

      if (!soundTwoPlayed && progress >= 0.35) {
        soundTwoPlayed = true;

        this.audioManager.play(SoundId.CARD_SWIPE, {
          loop: false,
          volume: 0.7,
        });
      }

      if (!soundThreePlayed && progress >= 0.55) {
        soundThreePlayed = true;

        this.audioManager.play(SoundId.CARD_SWIPE, {
          loop: false,
          volume: 0.7,
        });
      }

      if (!soundFourPlayed && progress >= 0.75) {
        soundFourPlayed = true;

        this.audioManager.play(SoundId.CARD_SWIPE, {
          loop: false,
          volume: 0.7,
        });
      }
    });
  }

  private async stackCards(): Promise<void> {
    const redStartX = this.redCard.x;
    const blackStartX = this.blackCard.x;

    await this.animate(250, (progress) => {
      this.redCard.x = redStartX + (this.centerX - redStartX) * progress;

      this.blackCard.x = blackStartX + (this.centerX - blackStartX) * progress;
    });

    /*
            Obie karty leżą teraz dokładnie
            w tym samym miejscu.

            Ukrywamy jedną, więc gracz widzi
            pojedynczą zakrytą kartę.
        */

    this.redCard.visible = false;
    this.blackCard.visible = true;
  }

  async revealResult(color: CardColor): Promise<void> {
    const baseScaleX = this.blackCard.scale.x;

    await this.animate(200, (progress) => {
      this.blackCard.scale.x = baseScaleX * (1 - progress);
    });

    this.blackCard.texture =
      color === CardColor.RED ? this.redTexture : this.blackTexture;

    await this.animate(200, (progress) => {
      this.blackCard.scale.x = baseScaleX * progress;
    });
  }

  reset() {
    this.redCard.visible = true;
    this.blackCard.visible = true;

    this.redCard.texture = this.redTexture;
    this.blackCard.texture = this.blackTexture;

    this.redCard.width = this.cardWidth;
    this.redCard.height = this.cardHeight;

    this.blackCard.width = this.cardWidth;
    this.blackCard.height = this.cardHeight;

    this.redCard.position.set(
      this.redStartX + this.cardWidth / 2,
      this.cardY + this.cardHeight / 2,
    );

    this.blackCard.position.set(
      this.blackStartX + this.cardWidth / 2,
      this.cardY + this.cardHeight / 2,
    );

    this.redCard.alpha = 1;
    this.blackCard.alpha = 1;

    this.redCard.rotation = 0;
    this.blackCard.rotation = 0;
  }

  private animate(
    duration: number,
    update: (progress: number) => void,
  ): Promise<void> {
    return new Promise((resolve) => {
      const startTime = performance.now();

      const frame = (currentTime: number) => {
        const elapsed = currentTime - startTime;

        const progress = Math.min(1, elapsed / duration);

        update(progress);

        if (progress >= 1) {
          resolve();
          return;
        }

        requestAnimationFrame(frame);
      };

      requestAnimationFrame(frame);
    });
  }
}
