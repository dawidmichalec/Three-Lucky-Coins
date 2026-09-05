import { BET_LEVELS } from "./data/BetLevels";
import { CoinCombination, COMBINATION_CONFIGS, } from "./data/CoinCombinations";
import { CombinationId } from "./data/CombinationId";
import { CoinSide } from "../ui/Coin";
import { BetRestrictionManager } from "./BetRestrictionManager";

export enum BetChangeSource {
  PLAYER = "player",
  AUTO_ADJUST = "auto_adjust",
}


type ControllerConfig = {
  onBetChange: (
    bet: number,
    source: BetChangeSource,
  ) => void;
};


export class GameController {
  private betIndex = 3;
  private currentCombination: CoinCombination =
    COMBINATION_CONFIGS[CombinationId.HHH].sides;

  constructor(
    private config: ControllerConfig,
    private betRestrictionManager: BetRestrictionManager,
  ) {}

  adjustBetToBalance(
    isAffordable: (bet: number) => boolean,
  ): boolean {
    if (
      this.betRestrictionManager.isBetAvailable(
        this.getBet(),
      ) &&
      isAffordable(this.getBet())
    ) {
      return false;
    }

    for (
      let index = BET_LEVELS.length - 1;
      index >= 0;
      index--
    ) {
      const bet = BET_LEVELS[index];

      if (
        this.betRestrictionManager.isBetAvailable(bet) &&
        isAffordable(bet)
      ) {
        this.betIndex = index;

        this.config.onBetChange(
          this.getBet(),
          BetChangeSource.AUTO_ADJUST,
        );

        return true;
      }
    }

    return false;
  }

  decreaseBet() {
    const previousIndex =
      this.findPreviousAvailableBetIndex();

    if (previousIndex === null) {
      return;
    }

    this.betIndex = previousIndex;

    this.syncBet();
  }

  increaseBet() {
    const nextIndex =
      this.findNextAvailableBetIndex();

    if (nextIndex === null) {
      return;
    }

    this.betIndex = nextIndex;

    this.syncBet();
  }

  private syncBet() {
    const bet = BET_LEVELS[this.betIndex];

    this.config.onBetChange(
      bet,
      BetChangeSource.PLAYER,
    );
  }

  getBet() {
    return BET_LEVELS[this.betIndex];
  }

  getNextBet(): number | null {
    const nextIndex =
      this.findNextAvailableBetIndex();

    if (nextIndex === null) {
      return null;
    }

    return BET_LEVELS[nextIndex];
  }

  getMinBet(): number {
    return BET_LEVELS[0]; // albo jak masz strukturę
  }

  getMinAvailableBet(): number | null {
    const availableBets =
      this.betRestrictionManager.getAvailableBets();

    return availableBets[0] ?? null;
  }

  setCombinationSide(
    index: 0 | 1 | 2,
    side: CoinSide,
  ): void {
    const nextCombination: [
      CoinSide,
      CoinSide,
      CoinSide,
    ] = [...this.currentCombination];

    nextCombination[index] = side;

    this.currentCombination = nextCombination;
  }

  getCurrentCombo(): CoinCombination {
    return this.currentCombination;
  }

  getHighestAffordableBet(balance: number): number {
    for (let index = BET_LEVELS.length - 1; index >= 0; index--) {
      if (BET_LEVELS[index] <= balance) {
        return BET_LEVELS[index];
      }
    }

    return BET_LEVELS[0];
  }

  private findNextAvailableBetIndex(): number | null {
    for (
      let index = this.betIndex + 1;
      index < BET_LEVELS.length;
      index++
    ) {
      if (
        this.betRestrictionManager.isBetAvailable(
          BET_LEVELS[index],
        )
      ) {
        return index;
      }
    }

    return null;
  }

  private findPreviousAvailableBetIndex(): number | null {
    for (
      let index = this.betIndex - 1;
      index >= 0;
      index--
    ) {
      if (
        this.betRestrictionManager.isBetAvailable(
          BET_LEVELS[index],
        )
      ) {
        return index;
      }
    }

    return null;
  }

  adjustBetToRestrictions(): boolean {
    if (
      this.betRestrictionManager.isBetAvailable(
        this.getBet(),
      )
    ) {
      return false;
    }

    const nextIndex =
      this.findNextAvailableBetIndex();

    if (nextIndex !== null) {
      this.betIndex = nextIndex;

      this.config.onBetChange(
        this.getBet(),
        BetChangeSource.AUTO_ADJUST,
      );

      return true;
    }

    const previousIndex =
      this.findPreviousAvailableBetIndex();

    if (previousIndex !== null) {
      this.betIndex = previousIndex;

      this.config.onBetChange(
        this.getBet(),
        BetChangeSource.AUTO_ADJUST,
      );

      return true;
    }

    return false;
  }

  getAvailableBets(): number[] {
    return this.betRestrictionManager.getAvailableBets();
  }
}
