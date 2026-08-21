import { Container, Text } from "pixi.js";
import { Overlay } from "../popups/Overlay";
import { LayoutManager } from "../../core/LayoutManager";
import { LocalizedText } from "../../localization/LocalizedText";
import { RoundedButton } from "../buttons/RoundedButton";
import { ButtonTheme } from "../buttons/ButtonTheme";
import { RedBlackCardView } from "./games/RedBlackCardView";
import { GambleForMoreOffer } from "../../game/gambleForMore/GambleForMoreTypes";
import { CardColor } from "../../game/gambleForMore/games/redBlackCard/RedBlackCardTypes";

export class GambleForMoreOverlay extends Container {
  private layoutManager = LayoutManager.getInstance();
  private redBlackCardView: RedBlackCardView;
  private currentWinValue: Text;
  private potentialWinValue: Text;
  private leftButton: RoundedButton;
  private rightButton: RoundedButton;
  private gameStarted = false;

  constructor(
    private onYes: () => void,

    private onNo: () => void,

    private onColorSelected: (color: CardColor) => void,
  ) {
    super();

    this.visible = false;

    const overlay = new Overlay(
      this.layoutManager.DESIGN_WIDTH,
      this.layoutManager.DESIGN_HEIGHT,
    );

    // HEADER

    const header = new LocalizedText("wouldYouLikeToGambleForMore", {
      fontFamily: "JackCondensed",
      fontWeight: "bold",
      fontSize: 50,
      fill: 0xffd21f,
    });

    header.position.set(this.layoutManager.DESIGN_WIDTH / 2, 56.5);
    header.anchor.set(0.5);

    // RED BLACK CARD VIEW

    this.redBlackCardView = new RedBlackCardView(1200);

    this.redBlackCardView.position.set(364.8, 162);

    const currentWinLabel = new LocalizedText("currentWin", {
      font: "Open Sans",
      fontSize: 28,
      fontWeight: "bold",
      fill: 0xffd21f,
    });

    currentWinLabel.position.set(595.3, 673.4);
    currentWinLabel.anchor.set(0);

    this.currentWinValue = new Text({
      text: "0.00",
      style: {
        font: "Open Sans",
        fontSize: 28,
        fontWeight: "bold",
        fill: 0xffd21f,
      },
    });

    this.currentWinValue.position.set(1190, 673.4);
    this.currentWinValue.anchor.set(0);

    const potentialWinLabel = new LocalizedText("potentialWin", {
      font: "Open Sans",
      fontSize: 28,
      fontWeight: "bold",
      fill: 0xffd21f,
    });

    potentialWinLabel.position.set(595.3, 710.4);
    potentialWinLabel.anchor.set(0);

    this.potentialWinValue = new Text({
      text: "0.00",
      style: {
        font: "Open Sans",
        fontSize: 28,
        fontWeight: "bold",
        fill: 0xffd21f,
      },
    });

    this.potentialWinValue.position.set(1190, 710.4);
    this.potentialWinValue.anchor.set(0);

    const disclaimer = new LocalizedText("disclaimer", {
      font: "Open Sans",
      fontSize: 24,
      fontWeight: "bold",
      fill: 0xffd21f,
    });

    disclaimer.position.set(this.layoutManager.DESIGN_WIDTH / 2, 807.2);
    disclaimer.anchor.set(0.5);

    this.leftButton = new RoundedButton({
      text: "yesButtonText",
      theme: ButtonTheme.GREEN,
      onClick: () => {
        this.handleYes();
      },
    });

    this.leftButton.position.set(550, 907.4);

    this.rightButton = new RoundedButton({
      text: "noButtonText",
      theme: ButtonTheme.RED,
      onClick: () => {
        this.handleNo();
      },
    });

    this.rightButton.position.set(1071.3, 907.4);

    this.addChild(
      overlay,
      header,
      this.redBlackCardView,
      currentWinLabel,
      this.currentWinValue,
      potentialWinLabel,
      this.potentialWinValue,
      disclaimer,
      this.leftButton,
      this.rightButton,
    );
  }

  async init(): Promise<void> {
    await this.redBlackCardView.init();
  }

  private handleYes() {
    if (!this.gameStarted) {
      this.onYes();
      return;
    }

    this.gameStarted = false;

    this.onColorSelected(CardColor.BLACK);
  }

  private handleNo() {
    if (!this.gameStarted) {
      this.onNo();
      return;
    }

    this.gameStarted = false;

    this.onColorSelected(CardColor.RED);
  }

  async startGame(): Promise<void> {
    this.leftButton.visible = false;
    this.rightButton.visible = false;

    await this.redBlackCardView.startShuffle();

    this.gameStarted = true;

    this.leftButton.setText("black");
    this.rightButton.setText("red");

    this.leftButton.visible = true;
    this.rightButton.visible = true;
  }

  showOffer(offer: GambleForMoreOffer) {
    this.gameStarted = false;

    this.redBlackCardView.reset();

    this.leftButton.setText("yesButtonText");
    this.rightButton.setText("noButtonText");

    this.leftButton.visible = true;
    this.rightButton.visible = true;

    this.currentWinValue.text = offer.currentWin.toFixed(2);
    this.potentialWinValue.text = offer.potentialWin.toFixed(2);

    this.visible = true;
  }

  async revealResult(color: CardColor): Promise<void> {
    this.leftButton.visible = false;
    this.rightButton.visible = false;

    await this.redBlackCardView.revealResult(color);
  }

  hide() {
    this.gameStarted = false;
    this.visible = false;
  }
}
