import { DealerData } from "./DealerData";

import { ObjectiveType } from "../objectives/ObjectiveTypes";

export interface DealerFightState {
  startingBalance: number;

  targetBalance: number;
}

export class DealerFightManager {
  private currentDealerIndex = 0;

  private fightStartingBalance = 0;

  private fightTargetBalance = 0;

  constructor(private readonly dealerOrder: readonly DealerData[]) {
    if (dealerOrder.length === 0) {
      throw new Error("DealerFightManager requires at least one dealer.");
    }
  }

  getCurrentDealer(): DealerData {
    return this.dealerOrder[this.currentDealerIndex];
  }

  startFight(playerBalance: number): DealerFightState {
    const dealer = this.getCurrentDealer();

    this.fightStartingBalance = playerBalance;

    switch (dealer.objectiveType) {
      case ObjectiveType.INCREASE_BALANCE:
        this.fightTargetBalance =
          this.fightStartingBalance + dealer.objectiveValue;

        break;

      default:
        throw new Error(`Unsupported objective type: ${dealer.objectiveType}`);
    }

    return {
      startingBalance: this.fightStartingBalance,

      targetBalance: this.fightTargetBalance,
    };
  }

  isCurrentDealerDefeated(playerBalance: number): boolean {
    const dealer = this.getCurrentDealer();

    switch (dealer.objectiveType) {
      case ObjectiveType.INCREASE_BALANCE:
        return playerBalance >= this.fightTargetBalance;

      default:
        console.warn("Unsupported objective type:", dealer.objectiveType);

        return false;
    }
  }

  advanceToNextDealer(): DealerData | null {
    const nextIndex = this.currentDealerIndex + 1;

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
}
