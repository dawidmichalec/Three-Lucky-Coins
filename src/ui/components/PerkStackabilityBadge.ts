
import {
  Container,
  Graphics,
  Text,
} from "pixi.js";

import { LocalizedText } from "../../localization/LocalizedText";
import { PerkData } from "../../game/perks/PerkData";

export class PerkStackabilityBadge extends Container {
  static readonly HEIGHT = 38;

  constructor(
    perk: PerkData,
    badgeWidth: number,
    onHelpRequested: (perk: PerkData) => void,
  ) {
    super();

    this.eventMode = "static";
    this.cursor = "pointer";

    const isStackable = perk.isStackable;

    const backgroundColor = isStackable
      ? 0x1e3528
      : 0x303030;

    const borderColor = isStackable
      ? 0x5c9c76
      : 0x777777;

    const textColor = isStackable
      ? 0xbdefcb
      : 0xdddddd;

    const badgeBackground = new Graphics()
      .roundRect(
        0,
        0,
        badgeWidth,
        PerkStackabilityBadge.HEIGHT,
        9,
      )
      .fill(backgroundColor)
      .stroke({
        color: borderColor,
        width: 2,
      });

    const label = new LocalizedText(
      isStackable
        ? "stackableLabel"
        : "nonStackableLabel",
      {
        fontFamily: "Arial",
        fontSize: 17,
        fontWeight: "bold",
        fill: textColor,
        align: "center",
      },
    );

    label.anchor.set(0.5);

    label.position.set(
      badgeWidth / 2 - 8,
      PerkStackabilityBadge.HEIGHT / 2,
    );

    const helpIndicator = new Text({
      text: "?",
      style: {
        fontFamily: "Arial",
        fontSize: 19,
        fontWeight: "bold",
        fill: textColor,
      },
    });

    helpIndicator.anchor.set(0.5);

    helpIndicator.position.set(
      badgeWidth - 20,
      PerkStackabilityBadge.HEIGHT / 2,
    );

    this.addChild(
      badgeBackground,
      label,
      helpIndicator,
    );

    this.on("pointertap", (event) => {
      event.stopPropagation();

      onHelpRequested(perk);
    });
  }
}
