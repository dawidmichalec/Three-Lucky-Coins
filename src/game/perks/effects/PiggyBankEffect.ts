import { RunPerkManager } from "../RunPerkManager";
import { roundMoney } from "../../util/MoneyUtils";

export interface PiggyBankResult {
  triggered: boolean;
  amountGranted: number;
  finalBalance: number;
  consumed: boolean;
}

export class PiggyBankEffect {
  constructor(
    private readonly runPerkManager: RunPerkManager,
  ) {}

  apply(
    balance: number,
    minimumBet: number,
  ): PiggyBankResult {
    const piggyBank =
      this.runPerkManager.getPerk("piggy_bank");

    if (!piggyBank || balance >= minimumBet) {
      return {
        triggered: false,
        amountGranted: 0,
        finalBalance: balance,
        consumed: false,
      };
    }

    const amountGranted = roundMoney(
      minimumBet - balance,
    );

    /*
        Piggy Bank jest consumable.

        Po aktywacji natychmiast usuwamy
        go z aktywnych perków runa.
    */

    this.runPerkManager.removePerk("piggy_bank");

    return {
      triggered: true,
      amountGranted,
      finalBalance: minimumBet,
      consumed: true,
    };
  }
}