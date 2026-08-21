import { Container, Graphics } from "pixi.js";
import { RoundedButton } from "../buttons/RoundedButton";
import { ButtonTheme } from "../buttons/ButtonTheme";
import { TranslationKey } from "../../core/LocalizationManager";
import { LocalizedText } from "../../localization/LocalizedText";

interface ConfirmationPopupOptions {
  message: TranslationKey;

  onConfirm: () => void;

  onCancel: () => void;
}

export class ConfirmationPopup extends Container {
  private readonly popupWidth = 750;
  private readonly popupHeight = 300;

  constructor(private options: ConfirmationPopupOptions) {
    super();

    this.createBackground();
    this.createMessage();
    this.createButtons();
  }

  private createBackground() {
    const bg = new Graphics();

    bg.roundRect(0, 0, this.popupWidth, this.popupHeight, 25);

    bg.fill(0x222222);

    this.addChild(bg);
  }

  private createMessage() {
    const text = new LocalizedText(
      this.options.message,

      {
        fill: 0xffffff,
        fontSize: 26,
        align: "center",
        wordWrap: true,
        wordWrapWidth: 650,
      },
    );

    text.anchor.set(0.5);

    text.position.set(this.popupWidth / 2, 80);

    this.addChild(text);
  }

  private createButtons() {
    const yesButton = new RoundedButton({
      text: "yesButtonText",

      theme: ButtonTheme.GREEN,

      buttonWidth: 180,

      buttonHeight: 60,

      onClick: () => {
        this.options.onConfirm();
      },
    });

    yesButton.position.set(190, 200);

    const noButton = new RoundedButton({
      text: "noButtonText",

      theme: ButtonTheme.RED,

      buttonWidth: 180,

      buttonHeight: 60,

      onClick: () => {
        this.options.onCancel();
      },
    });

    noButton.position.set(400, 200);

    this.addChild(yesButton, noButton);
  }
}
