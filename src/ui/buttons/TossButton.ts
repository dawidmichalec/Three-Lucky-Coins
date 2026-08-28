import {
  Container,
  Sprite,
  Assets,
  Graphics,
  Texture,
} from "pixi.js";

import { AudioManager } from "../../core/AudioManager";
import { SoundId } from "../../audio/SoundId";

export class TossButton extends Container {
  private bg!: Sprite;

  private idleTexture!: Texture;

  private animationTextures: Texture[] = [];

  private buttonWidth: number;
  private buttonHeight: number;

  private isAnimating = false;

  private currentFrame = 0;
  private frameTimer = 0;
  private frameSpeed = 2;

  private audioManager =
    AudioManager.getInstance();

  constructor() {
    super();

    this.buttonWidth = 160;
    this.buttonHeight = 160;

    this.eventMode = "static";
    this.cursor = "pointer";
  }

  async init() {
    this.idleTexture =
      await Assets.load(
        "/assets/main/icons/new_toss_button_icon.png",
      );

    for (let i = 1; i <= 16; i++) {
      this.animationTextures.push(
        await Assets.load(
          `/assets/main/icons/toss_button_animation_assets/coin_asset_${i}.png`,
        ),
      );
    }

    this.bg = new Sprite(
      this.idleTexture,
    );

    const scaleX =
      this.buttonWidth /
      this.bg.texture.width;

    const scaleY =
      this.buttonHeight /
      this.bg.texture.height;

    this.bg.scale.set(
      scaleX,
      scaleY,
    );

    this.bg.anchor.set(
      0.5,
      0.5,
    );

    this.bg.position.set(
      this.buttonWidth / 2,
      this.buttonHeight / 2,
    );

    this.addChild(this.bg);

    const hit =
      new Graphics()
        .rect(
          0,
          0,
          this.buttonWidth,
          this.buttonHeight,
        )
        .fill(0x000000);

    hit.alpha = 0.001;

    hit.eventMode = "static";
    hit.cursor = "pointer";

    hit.on(
      "pointertap",
      () => {
        this.startAnimation();

        this.emit("toss");

        this.audioManager.play(
          SoundId.TOSS_BUTTON_CLICKED,
          {
            loop: false,
            volume: 0.5,
          },
        );
      },
    );

    this.addChild(hit);
  }

  setDisabled(
    value: boolean,
  ) {
    this.eventMode =
      value
        ? "none"
        : "static";

    this.alpha =
      value
        ? 0.85
        : 1;
  }

  startAnimation() {
    if (this.isAnimating) {
      return;
    }

    this.isAnimating = true;

    this.currentFrame = 0;
    this.frameTimer = 0;

    this.bg.texture =
      this.animationTextures[0];
  }

  update(
    delta: number,
  ) {
    if (!this.isAnimating) {
      return;
    }

    this.frameTimer += delta;

    if (
      this.frameTimer <
      this.frameSpeed
    ) {
      return;
    }

    this.frameTimer = 0;

    this.currentFrame++;

    if (
      this.currentFrame >=
      this.animationTextures.length
    ) {
      this.bg.texture =
        this.idleTexture;

      this.isAnimating = false;

      return;
    }

    this.bg.texture =
      this.animationTextures[
        this.currentFrame
      ];
  }
}