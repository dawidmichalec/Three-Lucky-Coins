import {
  Container,
  Graphics,
  Rectangle,
  Text,
} from "pixi.js";

import { LocalizedText } from "../../localization/LocalizedText";
import { PerkData } from "../../game/perks/PerkData";
import { ScrollableContainer } from "../components/ScrollableContainer";

export class PerkStackabilityHelpOverlay extends Container {
  private readonly panelWidth = 1360;
  private readonly panelHeight = 690;

  private readonly contentWidth = 1200;
  private readonly scrollHeight = 420;

  private readonly panelBackground = new Graphics();

  private readonly heading: LocalizedText;
  private readonly explanation: LocalizedText;
  private readonly scrollArea: ScrollableContainer;
  private readonly scrollHint: LocalizedText;

  constructor(
    screenWidth: number,
    screenHeight: number,
  ) {
    super();

    this.visible = false;
    this.eventMode = "static";

    // FULL-SCREEN DIMMED BACKGROUND

    const backdrop = new Graphics()
      .rect(0, 0, screenWidth, screenHeight)
      .fill({
        color: 0x000000,
        alpha: 0.85,
      });

    backdrop.eventMode = "static";
    backdrop.cursor = "pointer";

    backdrop.on("pointertap", () => {
      this.hide();
    });

    this.addChild(backdrop);

    // CENTRAL PANEL

    const panel = new Container();

    panel.position.set(
      (screenWidth - this.panelWidth) / 2,
      (screenHeight - this.panelHeight) / 2,
    );

    panel.eventMode = "static";

    panel.on("pointertap", (event) => {
      event.stopPropagation();
    });

    this.panelBackground
      .roundRect(
        0,
        0,
        this.panelWidth,
        this.panelHeight,
        20,
      )
      .fill({
        color: 0x171717,
        alpha: 0.99,
      })
      .stroke({
        color: 0x5c9c76,
        width: 5,
      });

    panel.addChild(this.panelBackground);

    // TITLE

    this.heading = new LocalizedText(
      "stackableLabel",
      {
        fontFamily: "Arial",
        fontSize: 56,
        fontWeight: "bold",
        fill: 0xffd21f,
      },
    );

    this.heading.position.set(75, 65);

    panel.addChild(this.heading);

    // DIVIDER

    const divider = new Graphics()
      .rect(75, 153, this.panelWidth - 150, 2)
      .fill(0x555555);

    panel.addChild(divider);

    // EXPLANATION

    this.explanation = new LocalizedText(
      "stackableHelp",
      {
        fontFamily: "Arial",
        fontSize: 50,
        lineHeight: 64,
        fill: 0xffffff,
        wordWrap: true,
        wordWrapWidth: this.contentWidth,
        align: "left",
      },
    );

    this.scrollArea = new ScrollableContainer(
      this.contentWidth,
      this.scrollHeight,
    );

    this.scrollArea.position.set(80, 180);

    this.scrollArea.addContent(this.explanation);

    panel.addChild(this.scrollArea);

    // SCROLL HINT FOR LONG DESCRIPTIONS

    this.scrollHint = new LocalizedText(
      "stackabilityScrollHint",
      {
        fontFamily: "Arial",
        fontSize: 25,
        fill: 0xaaaaaa,
      },
    );

    this.scrollHint.anchor.set(0.5, 0);

    this.scrollHint.position.set(
      this.panelWidth / 2,
      this.panelHeight - 47,
    );

    this.scrollHint.visible = false;

    panel.addChild(this.scrollHint);

    // CLOSE BUTTON

    const closeButton = new Container();

    closeButton.position.set(
      this.panelWidth - 112,
      36,
    );

    closeButton.eventMode = "static";
    closeButton.cursor = "pointer";
    closeButton.hitArea = new Rectangle(0, 0, 75, 75);

    const closeBackground = new Graphics()
      .roundRect(0, 0, 75, 75, 12)
      .fill(0x303030);

    const closeLabel = new Text({
      text: "×",
      style: {
        fontFamily: "Arial",
        fontSize: 54,
        fill: 0xffffff,
      },
    });

    closeLabel.anchor.set(0.5);
    closeLabel.position.set(37.5, 37.5);

    closeButton.addChild(
      closeBackground,
      closeLabel,
    );

    closeButton.on("pointertap", (event) => {
      event.stopPropagation();
      this.hide();
    });

    panel.addChild(closeButton);

    this.addChild(panel);
  }

  show(perk: PerkData): void {
    const isStackable = perk.isStackable;

    const labelKey = isStackable
      ? "stackableLabel"
      : "nonStackableLabel";

    const explanationKey =
      perk.stackingDescription ??
      (
        isStackable
          ? "stackableHelp"
          : "nonStackableHelp"
      );

    this.heading.setKey(labelKey);
    this.explanation.setKey(explanationKey);

    // Reset scrolling each time a new explanation opens.

    this.scrollArea.clearContent();
    this.scrollArea.addContent(this.explanation);

    this.scrollHint.visible =
      this.explanation.height > this.scrollHeight;

    // Match the border to the perk type.

    this.panelBackground
      .clear()
      .roundRect(
        0,
        0,
        this.panelWidth,
        this.panelHeight,
        20,
      )
      .fill({
        color: 0x171717,
        alpha: 0.99,
      })
      .stroke({
        color: isStackable ? 0x5c9c76 : 0x777777,
        width: 5,
      });

    this.visible = true;
  }

  hide(): void {
    this.visible = false;
  }
}
