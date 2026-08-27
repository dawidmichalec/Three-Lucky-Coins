import { Container } from "pixi.js";
import { CoinSide } from "../../Coin";
import { CoinCombination } from "../../../game/data/CoinCombinations";
import { CoinSideSelector } from "./CoinSideSelector";

interface CombinationSelectorOptions {
  initialCombination: CoinCombination;

  onSideChange: (
    index: 0 | 1 | 2,
    side: CoinSide,
  ) => void;
}

export class CombinationSelector extends Container {
  private selectors: [
    CoinSideSelector,
    CoinSideSelector,
    CoinSideSelector,
  ];

  constructor(
    private readonly options: CombinationSelectorOptions,
  ) {
    super();

    this.selectors = [
      this.createSelector(0),
      this.createSelector(1),
      this.createSelector(2),
    ];

    this.positionSelectors();

    this.addChild(
      this.selectors[0],
      this.selectors[1],
      this.selectors[2],
    );
  }

  private createSelector(
    index: 0 | 1 | 2,
  ): CoinSideSelector {
    return new CoinSideSelector({
      initialSide:
        this.options.initialCombination[index],

      onChange: (side) => {
        this.options.onSideChange(
          index,
          side,
        );
      },
    });
  }

  private positionSelectors(): void {
    this.selectors[0].position.set(
      488.9,
      595.3,
    );

    this.selectors[1].position.set(
      805.3,
      595.3,
    );

    this.selectors[2].position.set(
      1130.1,
      595.3,
    );
  }

  setDisabled(value: boolean): void {
    for (const selector of this.selectors) {
      selector.setDisabled(value);
    }
  }

  setCombination(
    combination: CoinCombination,
  ): void {
    this.selectors[0].setSide(
      combination[0],
    );

    this.selectors[1].setSide(
      combination[1],
    );

    this.selectors[2].setSide(
      combination[2],
    );
  }
}