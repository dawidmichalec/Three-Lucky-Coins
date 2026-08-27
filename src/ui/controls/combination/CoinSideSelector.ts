import { Container } from "pixi.js";
import { TriangleButton } from "../../buttons/TriangleButton";
import { LocalizedText } from "../../../localization/LocalizedText";
import { CoinSide } from "../../Coin";
import { TranslationKey } from "../../../core/LocalizationManager";

interface CoinSideSelectorOptions {
  initialSide: CoinSide;
  onChange: (side: CoinSide) => void;
}

export class CoinSideSelector extends Container {
  private currentSide: CoinSide;

  private leftButton: TriangleButton;
  private rightButton: TriangleButton;

  private sideText: LocalizedText;

  constructor(
    private readonly options: CoinSideSelectorOptions,
  ) {
    super();

    this.currentSide = options.initialSide;

    this.leftButton = new TriangleButton({
      direction: "left",
      onClick: () => {
        this.toggleSide();
      },
    });

    this.rightButton = new TriangleButton({
      direction: "right",
      onClick: () => {
        this.toggleSide();
      },
    });

    this.sideText = new LocalizedText(
      this.getTranslationKey(),
      {
        fontFamily: "EgyptianSlateBd",
        fontSize: 34,
        fontWeight: "bold",
        fill: 0xffffff,
      },
    );

    this.leftButton.position.set(0, 0);
    this.sideText.position.set(140, 25);
    this.rightButton.position.set(210, 0);

    this.sideText.anchor.set(0.5);

    this.addChild(
      this.leftButton,
      this.sideText,
      this.rightButton,
    );
  }

  private toggleSide(): void {
    this.currentSide =
      this.currentSide === CoinSide.Heads
        ? CoinSide.Tails
        : CoinSide.Heads;

    this.sideText.setKey(
      this.getTranslationKey(),
    );

    this.options.onChange(
      this.currentSide,
    );
  }

  private getTranslationKey(): TranslationKey {
    return this.currentSide === CoinSide.Heads
      ? "headsSelector"
      : "tailsSelector";
  }

  setSide(side: CoinSide): void {
    if (side === this.currentSide) {
      return;
    }

    this.currentSide = side;

    this.sideText.setKey(
      this.getTranslationKey(),
    );
  }

  getSide(): CoinSide {
    return this.currentSide;
  }

  setDisabled(value: boolean): void {
    this.leftButton.setDisabled(value);
    this.rightButton.setDisabled(value);
  }
}