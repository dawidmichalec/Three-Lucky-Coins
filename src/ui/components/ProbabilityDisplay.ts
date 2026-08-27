import {
  Container,
  Text,
} from "pixi.js";

import { LocalizedText } from "../../localization/LocalizedText";

import {
  CoinOdds,
  OddsTable,
} from "../../game/probability/OddsTypes";

import {
  TranslationKey,
} from "../../core/LocalizationManager";

interface CoinProbabilityDisplay {
  sideLabel: LocalizedText;
  valueLabel: Text;
}

export class ProbabilityDisplay extends Container {
  private coinDisplays: [
    CoinProbabilityDisplay,
    CoinProbabilityDisplay,
    CoinProbabilityDisplay,
  ];

  constructor() {
    super();

    this.coinDisplays = [
      this.createCoinDisplay(0),
      this.createCoinDisplay(1),
      this.createCoinDisplay(2),
    ];

    this.addChild(
      this.coinDisplays[0].sideLabel,
      this.coinDisplays[0].valueLabel,
      this.coinDisplays[1].sideLabel,
      this.coinDisplays[1].valueLabel,
      this.coinDisplays[2].sideLabel,
      this.coinDisplays[2].valueLabel,
    );
  }

  private createCoinDisplay(
    index: 0 | 1 | 2,
  ): CoinProbabilityDisplay {
    const positions = [
      { x: 425, y: 216 },
      { x: 750, y: 216 },
      { x: 1075, y: 216 },
    ];

    const position = positions[index];

    const sideLabel =
      new LocalizedText(
        "heads",
        {
          fontFamily:
            "EgyptianSlateBd",

          fontSize: 34,

          fontWeight:
            "bold",

          fill:
            0xffffff,
        },
      );

    const valueLabel =
      new Text({
        text: "—",

        style: {
          fontFamily:
            "EgyptianSlateBd",

          fontSize: 34,

          fontWeight:
            "bold",

          fill:
            0xffffff,
        },
      });

    sideLabel.anchor.set(
      1,
      0.5,
    );

    valueLabel.anchor.set(
      0,
      0.5,
    );

    sideLabel.position.set(
      position.x,
      position.y,
    );

    valueLabel.position.set(
      position.x + 8,
      position.y,
    );

    return {
      sideLabel,
      valueLabel,
    };
  }

  updateOdds(
    odds: OddsTable,
  ): void {
    this.updateCoinDisplay(
      this.coinDisplays[0],
      odds.coin1,
    );

    this.updateCoinDisplay(
      this.coinDisplays[1],
      odds.coin2,
    );

    this.updateCoinDisplay(
      this.coinDisplays[2],
      odds.coin3,
    );
  }

  private updateCoinDisplay(
    display:
      CoinProbabilityDisplay,

    odds:
      CoinOdds,
  ): void {
    const headsIsMoreLikely =
      odds.heads >=
      odds.tails;

    const translationKey:
      TranslationKey =
      headsIsMoreLikely
        ? "heads"
        : "tails";

    const probability =
      headsIsMoreLikely
        ? odds.heads
        : odds.tails;

    display.sideLabel.setKey(
      translationKey,
    );

    display.valueLabel.text =
      this.formatPercentage(
        probability,
      );
  }

  private formatPercentage(
    probability: number,
  ): string {
    return `${Math.round(
      probability * 100,
    )}%`;
  }
}