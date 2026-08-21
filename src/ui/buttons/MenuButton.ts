import { Container, Graphics } from "pixi.js";
import { LocalizedText } from "../../localization/LocalizedText";
import { TranslationKey } from "../../core/LocalizationManager";

export interface MenuButtonOptions {
  text: TranslationKey;

  buttonWidth?: number;
  buttonHeight?: number;

  onClick: () => void;
}

export class MenuButton extends Container {
  private background!: Graphics;
  private text!: LocalizedText;

  private buttonWidth!: number;
  private buttonHeight!: number;

  constructor(private options: MenuButtonOptions) {
    super();

    this.buttonWidth = options.buttonWidth ?? 600;
    this.buttonHeight = options.buttonHeight ?? 80;

    this.eventMode = "static";
    this.cursor = "pointer";

    const hitbox = new Graphics()
      .rect(0, 0, this.buttonWidth, this.buttonHeight)
      .fill({
        color: 0x000000,
        alpha: 0,
      });

    this.addChild(hitbox);

    this.text = new LocalizedText(options.text, {
      fontFamily: "Crimson Pro",
      fontSize: 38,
      fill: 0xffde59,
      dropShadow: {
        alpha: 1,
        blur: 10,
        color: "#c3d751",
        distance: 0,
      },

      stroke: {
        color: "#f3e19a",
        width: 1.5,
      },
    });

    this.text.anchor.set(0.5);
    this.text.position.set(this.buttonWidth / 2, this.buttonHeight / 2);

    this.on("pointertap", () => {
      this.options.onClick();
    });

    this.addChild(this.text);
  }
}
