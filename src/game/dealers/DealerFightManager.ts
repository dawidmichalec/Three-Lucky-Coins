import { DealerData } from "./DealerData";
import { ObjectiveType } from "../objectives/ObjectiveTypes";

export interface DealerFightState {
  targetBalance?: number;
  targetWins?: number;
  targetMultiplier?: number;
}

export class DealerFightManager {
  private currentDealerIndex = 0;

  private fightStartingBalance = 0;
  private fightTargetBalance = 0;

  private fightWins = 0;
  private fightTargetWins = 0;

  constructor(
    private readonly dealerOrder: readonly DealerData[],
  ) {
    if (dealerOrder.length === 0) {
      throw new Error(
        "DealerFightManager requires at least one dealer.",
      );
    }
  }

  getCurrentDealer(): DealerData {
    return this.dealerOrder[this.currentDealerIndex];
  }

  startFight(playerBalance: number): DealerFightState {
    const dealer = this.getCurrentDealer();

    this.fightStartingBalance = playerBalance;

    this.fightTargetBalance = 0;
    this.fightWins = 0;
    this.fightTargetWins = 0;

    switch (dealer.objectiveType) {
      case ObjectiveType.INCREASE_BALANCE:
        this.fightTargetBalance =
          this.fightStartingBalance +
          dealer.objectiveValue;

        return {
          targetBalance: this.fightTargetBalance,
        };

      case ObjectiveType.WIN_BETS:
        this.fightTargetWins =
          dealer.objectiveValue;

        return {
          targetWins: this.fightTargetWins,
        };

      case ObjectiveType.REACH_MULTIPLIER:
        return {
          targetMultiplier: dealer.objectiveValue,
        };

      default:
        throw new Error(
          `Unsupported objective type: ${dealer.objectiveType}`,
        );
    }
  }

  recordWonBet(): void {
    const dealer = this.getCurrentDealer();

    if (
      dealer.objectiveType !==
      ObjectiveType.WIN_BETS
    ) {
      return;
    }

    this.fightWins++;
  }

  isCurrentDealerDefeated(
    playerBalance: number,
    currentMultiplier: number,
  ): boolean {
    const dealer = this.getCurrentDealer();

    switch (dealer.objectiveType) {
      case ObjectiveType.INCREASE_BALANCE:
        return (
          playerBalance >=
          this.fightTargetBalance
        );

      case ObjectiveType.WIN_BETS:
        return (
          this.fightWins >=
          this.fightTargetWins
        );

      case ObjectiveType.REACH_MULTIPLIER:
        return (
          currentMultiplier >=
          dealer.objectiveValue
        );

      default:
        console.warn(
          "Unsupported objective type:",
          dealer.objectiveType,
        );

        return false;
    }
  }

  advanceToNextDealer(): DealerData | null {
    const nextIndex =
      this.currentDealerIndex + 1;

    if (nextIndex >= this.dealerOrder.length) {
      return null;
    }

    this.currentDealerIndex = nextIndex;

    return this.getCurrentDealer();
  }

  getFightTargetBalance(): number {
    return this.fightTargetBalance;
  }

  getFightStartingBalance(): number {
    return this.fightStartingBalance;
  }

  getFightWins(): number {
    return this.fightWins;
  }

  getFightTargetWins(): number {
    return this.fightTargetWins;
  }
}