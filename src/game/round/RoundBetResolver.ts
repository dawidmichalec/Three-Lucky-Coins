import {
  PerkEffectApplier
} from "../perks/PerkEffectApplier";


export interface RoundBetInput {
  bet: number;
}


export interface RoundBetResult {
  betCost: number;

  payoutBet: number;

  doubleDownActive: boolean;

  coinSenseActive: boolean;
}


export class RoundBetResolver {
  constructor(
    private readonly perkEffectApplier:
      PerkEffectApplier,
  ) {}


  resolve(
    input: RoundBetInput,
  ): RoundBetResult {
    return {
      betCost:
        this.perkEffectApplier
          .resolveBetCost(
            input.bet,
          ),

      payoutBet:
        this.perkEffectApplier
          .resolvePayoutBet(
            input.bet,
          ),

      doubleDownActive:
        this.perkEffectApplier
          .isDoubleDownActive(),

      coinSenseActive:
        this.perkEffectApplier
          .isCoinSenseAvailable(),
    };
  }
}