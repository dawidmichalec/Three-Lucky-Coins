import { Container } from "pixi.js";
import { TriangleButton } from "../buttons/TriangleButton";
import { TossButton } from "../buttons/TossButton";
import { CoinSide } from "../Coin";
import { CoinCombination } from "../../game/data/CoinCombinations";
import { CombinationSelector } from "./combination/CombinationSelector";

interface GameControlsOptions {
  onBetDown: () => void;
  onBetUp: () => void;

  initialCombination: CoinCombination;

  onCombinationSideChange: (
    index: 0 | 1 | 2,
    side: CoinSide,
  ) => void;
  onToss: () => void;
}

export class GameControls extends Container {
  private betDown!: TriangleButton;
  private betUp!: TriangleButton;

  private combinationSelector!: CombinationSelector;

  private tossButton!: TossButton;

  constructor(private options: GameControlsOptions) {
    super();

    this.createBetButtons();
    this.createCombinationSelector();
    this.createTossButton();
  }

  // BET BUTTONS

  private createBetButtons() {
    const betDown = new TriangleButton({
      direction: "left",
      label: "-",
      onClick: () => {
        this.options.onBetDown();
      },
    });

    const betUp = new TriangleButton({
      direction: "right",
      label: "+",
      onClick: () => {
        this.options.onBetUp();
      },
    });

    betDown.position.set(1060.8, 1030.4);
    betUp.position.set(1527.5, 1030.4);

    this.betDown = betDown;
    this.betUp = betUp;

    this.addChild(betDown, betUp);
  }

  // COMBINATIONS

  private createCombinationSelector() {
    this.combinationSelector =
      new CombinationSelector({
        initialCombination:
          this.options.initialCombination,

        onSideChange: (
          index,
          side,
        ) => {
          this.options.onCombinationSideChange(
            index,
            side,
          );
        },
      });

    this.addChild(
      this.combinationSelector,
    );
  }

  // TOSS BUTTON

  private async createTossButton() {
    this.tossButton = new TossButton();

    await this.tossButton.init();

    this.tossButton.position.set(1711.8, 685.7);

    this.addChild(this.tossButton);

    this.tossButton.on("toss", () => {
      this.options.onToss();
    });
  }

  setDisabled(value: boolean) {
    this.betDown.setDisabled(value);
    this.betUp.setDisabled(value);

    this.combinationSelector.setDisabled(value);

    this.tossButton.setDisabled(value);
  }

  startTossAnimation() {
    this.tossButton.startAnimation();
  }

  update(delta: number) {
    if (this.tossButton) {
      this.tossButton.update(delta);
    }
  }
}
