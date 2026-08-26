import { PerkReward } from "./reward/PerkReward";
import { RunPerkManager } from "./RunPerkManager";
import { StreakMultiplierManager } from "../streak/StreakMultiplierManager";
import { roundMoney } from "../util/MoneyUtils";
import { StreakAction, StreakResolution } from "../streak/StreakResolution";
import { MultiplierBoosterConfig } from "./data/MultiplierBooster";
import { CasinoBonusConfig } from "./data/CasinoBonus";
import { DoubleDownConfig } from "./data/DoubleDown";
import { LuckyHandConfig } from "./data/LuckyHand";
import { CoinSenseEffect, CoinSenseResult } from "./effects/CoinSenseEffect";
import { CoinSide } from "../../ui/Coin";
import { RiskTakerEffect, RiskTakerResult } from "./effects/RiskTakerEffect";
import { GamblerEffect, GamblerResult } from "./effects/GamblerEffect";

export interface InsuranceResult {
  triggered: boolean;
  streakResolution: StreakResolution;
}

export interface LuckyHandResult {
  triggered: boolean;
  baseWinAmount: number;
  bonusAmount: number;
  finalWinAmount: number;
  payoutMultiplier: number;
}

export interface PiggyBankResult {
  triggered: boolean;
  amountGranted: number;
  finalBalance: number;
  consumed: boolean;
}

export class PerkEffectApplier {
  private casinoBonusBetsPlacedThisFight = 0;
  private doubleDownSuccessfulSpins = 0;
  private luckyHandTossCount = 0;
  private readonly coinSenseEffect: CoinSenseEffect;
  private readonly riskTakerEffect: RiskTakerEffect;
  private readonly gamblerEffect: GamblerEffect;

  constructor(
    private readonly runPerkManager: RunPerkManager,

    private readonly streakMultiplierManager: StreakMultiplierManager,
  ) {

    this.coinSenseEffect = new CoinSenseEffect(
      this.runPerkManager,
    );

    this.riskTakerEffect = new RiskTakerEffect(
      this.runPerkManager,
    );

    this.gamblerEffect = new GamblerEffect(
      this.runPerkManager,
    );

  }

  applyPerk(reward: PerkReward): void {
    switch (reward.perk.id) {
      case "multiplier_booster":
        this.applyMultiplierBooster(reward);

        break;
    }
  }

  isCurrentBetFree(bet: number): boolean {
    const casinoBonus = this.runPerkManager.getPerk("casino_bonus");

    if (!casinoBonus) {
      return false;
    }

    const config = casinoBonus.variant.config as CasinoBonusConfig;

    return (
      this.casinoBonusBetsPlacedThisFight < config.freeBetsPerFight &&
      bet <= config.maximumFreeBet
    );
  }

  resolveBetCost(bet: number): number {
    if (this.isCurrentBetFree(bet)) {
      return 0;
    }

    return bet;
  }

  recordBet(): void {
    const casinoBonus = this.runPerkManager.getPerk("casino_bonus");

    if (!casinoBonus) {
      return;
    }

    this.casinoBonusBetsPlacedThisFight++;
  }

  resetFightEffects(): void {
    this.casinoBonusBetsPlacedThisFight = 0;

    this.coinSenseEffect.resetFight();
  }

  private applyMultiplierBooster(reward: PerkReward): void {
    const config = reward.variant.config as MultiplierBoosterConfig;

    const increase = config.streakMultiplierIncrease;

    this.streakMultiplierManager.setBaseValue(1 + increase);

    this.streakMultiplierManager.setGrowthPerWin(1 + increase);

    this.streakMultiplierManager.reset();
  }

  getRiskTakerPayoutMultiplier(
    currentBet: number,
    highestAffordableBet: number,
  ): number | undefined {
    return this.riskTakerEffect.getPayoutMultiplier(
      currentBet,
      highestAffordableBet,
    );
  }

  applyRiskTaker(
    winAmount: number,
    currentBet: number,
    highestAffordableBet: number,
  ): RiskTakerResult {
    return this.riskTakerEffect.apply(
      winAmount,
      currentBet,
      highestAffordableBet,
    );
  }

  resolveLossStreakResolution(resolution: StreakResolution): InsuranceResult {
    const insurance = this.runPerkManager.getPerk("insurance");

    if (!insurance || resolution.action !== StreakAction.RESET) {
      return {
        triggered: false,
        streakResolution: resolution,
      };
    }

    return {
      triggered: true,

      streakResolution: {
        action: StreakAction.DECREASE,

        value: 1,
      },
    };
  }

  activateGamblerAfterLoss(): number | undefined {
    return this.gamblerEffect.activateAfterLoss();
  }

  applyGambler(winAmount: number): GamblerResult {
    return this.gamblerEffect.apply(winAmount);
  }

  isDoubleDownActive(): boolean {
    const doubleDown = this.runPerkManager.getPerk("double_down");

    if (!doubleDown) {
      return false;
    }

    const config = doubleDown.variant.config as DoubleDownConfig;

    return this.doubleDownSuccessfulSpins >= config.requiredSuccessfulSpins;
  }

  resolvePayoutBet(bet: number): number {
    const doubleDown = this.runPerkManager.getPerk("double_down");

    if (!doubleDown || !this.isDoubleDownActive()) {
      return bet;
    }

    const config = doubleDown.variant.config as DoubleDownConfig;

    return bet * config.betMultiplier;
  }

  recordDoubleDownSpinResult(
    won: boolean,
    doubleDownWasActive: boolean,
  ): boolean {
    const doubleDown = this.runPerkManager.getPerk("double_down");

    if (!doubleDown) {
      return false;
    }

    /*
            Jeżeli właśnie wykorzystaliśmy
            Double Down, zaczynamy progress
            od nowa.
        */

    if (doubleDownWasActive) {
      this.doubleDownSuccessfulSpins = 0;

      return false;
    }

    /*
            Przegrana przerywa serię.
        */

    if (!won) {
      this.doubleDownSuccessfulSpins = 0;

      return false;
    }

    this.doubleDownSuccessfulSpins++;

    const config = doubleDown.variant.config as DoubleDownConfig;

    /*
            true TYLKO w rundzie,
            która właśnie uzbroiła Double Down.
        */

    return this.doubleDownSuccessfulSpins === config.requiredSuccessfulSpins;
  }

  resetDoubleDownProgress(): void {
    this.doubleDownSuccessfulSpins = 0;
  }

  isCoinSenseAvailable(): boolean {
    return this.coinSenseEffect.isAvailable();
  }


  prepareCoinSenseResult(result: CoinSide[]): void {
    this.coinSenseEffect.prepareResult(result);
  }

  consumePreparedCoinSenseResult(): CoinSide[] | undefined {
      return this.coinSenseEffect.consumePreparedResult();
  }

  applyCoinSense(
    winAmount: number,
    coinSenseWasActive: boolean,
  ): CoinSenseResult {
    return this.coinSenseEffect.apply(
      winAmount,
      coinSenseWasActive,
    );
  }

  consumeCoinSense(): void {
    this.coinSenseEffect.consume();
  }

  recordLuckyHandToss(won: boolean): boolean {
    const luckyHand = this.runPerkManager.getPerk("lucky_hand");

    if (!luckyHand) {
      return false;
    }

    const config = luckyHand.variant.config as LuckyHandConfig;

    this.luckyHandTossCount++;

    if (this.luckyHandTossCount < config.triggerEvery) {
      return false;
    }

    /*
            Osiągnęliśmy piąty toss.
            Po nim cykl zaczyna się od nowa,
            niezależnie od wyniku.
        */

    this.luckyHandTossCount = 0;

    return won;
  }

  applyLuckyHand(winAmount: number, triggered: boolean): LuckyHandResult {
    const luckyHand = this.runPerkManager.getPerk("lucky_hand");

    if (!luckyHand || !triggered) {
      return {
        triggered: false,
        baseWinAmount: winAmount,
        bonusAmount: 0,
        finalWinAmount: winAmount,
        payoutMultiplier: 1,
      };
    }

    const config = luckyHand.variant.config as LuckyHandConfig;

    const finalWinAmount = roundMoney(winAmount * config.payoutMultiplier);

    const bonusAmount = roundMoney(finalWinAmount - winAmount);

    return {
      triggered: true,
      baseWinAmount: winAmount,
      bonusAmount,
      finalWinAmount,
      payoutMultiplier: config.payoutMultiplier,
    };
  }

  applyPiggyBank(balance: number, minimumBet: number): PiggyBankResult {
    const piggyBank = this.runPerkManager.getPerk("piggy_bank");

    if (!piggyBank || balance >= minimumBet) {
      return {
        triggered: false,
        amountGranted: 0,
        finalBalance: balance,
        consumed: false,
      };
    }

    const amountGranted = roundMoney(minimumBet - balance);

    /*
            Piggy Bank jest consumable.

            Skoro właśnie się aktywował,
            natychmiast usuwamy go
            z aktywnych perków runa.
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
