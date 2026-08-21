import { Container, Graphics, Text } from "pixi.js";

import { TooltipCloseButton } from "../../buttons/TooltipCloseButton";

import { LocalizedText } from "../../../localization/LocalizedText";

import { DealerData } from "../../../game/dealers/DealerData";

import { ObjectiveType } from "../../../game/objectives/ObjectiveTypes";

export class DealerObjectivePanel extends Container {
  private bg: Graphics;

  private objectiveDescription: LocalizedText;

  private objectiveAmount: Text;

  private targetBalanceDescription: LocalizedText;

  private targetBalanceAmount: Text;

  constructor(width: number, height: number) {
    super();

    this.bg = new Graphics().roundRect(0, 0, width, height, 50).fill({
      color: 0x000000,
    });

    this.visible = false;

    this.eventMode = "static";
    this.cursor = "default";

    this.addChild(this.bg);

    // OBJECTIVE HEADER

    const objectiveLabel = new LocalizedText("objective", {
      fontFamily: "Oswald-Bold",
      fontSize: 38,
      fontWeight: "bold",
      fill: 0xffde59,
    });

    objectiveLabel.position.set(45, 15);

    // INCREASE BALANCE BY

    this.objectiveDescription = new LocalizedText("increaseBalanceBy", {
      font: "Open Sans",
      fontSize: 24,
      fontWeight: "bold",
      fill: 0xffffff,
    });

    this.objectiveDescription.position.set(45, 82);

    this.objectiveAmount = new Text({
      text: "0.00",

      style: {
        font: "Open Sans",
        fontSize: 24,
        fontWeight: "bold",
        fill: 0x4ca626,
      },
    });

    this.objectiveAmount.position.set(45, 118);

    // TARGET BALANCE

    this.targetBalanceDescription = new LocalizedText("targetBalance", {
      font: "Open Sans",
      fontSize: 24,
      fontWeight: "bold",
      fill: 0xffffff,
    });

    this.targetBalanceDescription.position.set(320, 82);

    this.targetBalanceAmount = new Text({
      text: "0.00",

      style: {
        font: "Open Sans",
        fontSize: 24,
        fontWeight: "bold",
        fill: 0xffd21f,
      },
    });

    this.targetBalanceAmount.position.set(320, 118);

    this.addChild(
      objectiveLabel,
      this.objectiveDescription,
      this.objectiveAmount,
      this.targetBalanceDescription,
      this.targetBalanceAmount,
    );

    void this.createCloseButton();
  }

  setDealer(dealer: DealerData, targetBalance: number) {
    switch (dealer.objectiveType) {
      case ObjectiveType.INCREASE_BALANCE:
        this.objectiveDescription.visible = true;

        this.objectiveAmount.visible = true;

        this.targetBalanceDescription.visible = true;

        this.targetBalanceAmount.visible = true;

        this.objectiveAmount.text = dealer.objectiveValue.toFixed(2);

        this.targetBalanceAmount.text = targetBalance.toFixed(2);

        break;

      default:
        console.warn("Unsupported objective type:", dealer.objectiveType);

        /*
                    Tymczasowy fallback.

                    Pokazujemy tylko wartość objective,
                    bez sekcji Target Balance.
                */

        this.objectiveDescription.visible = false;

        this.targetBalanceDescription.visible = false;

        this.targetBalanceAmount.visible = false;

        this.objectiveAmount.visible = true;

        this.objectiveAmount.text = dealer.objectiveValue.toString();

        break;
    }
  }

  private async createCloseButton() {
    const close = new TooltipCloseButton();

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

    close.on("pointertap", () => {
      this.hide();
    });

    close.position.set(540, 25);

    this.addChild(close);
  }

  show() {
    this.visible = true;
  }

  hide() {
    this.visible = false;
  }
}
