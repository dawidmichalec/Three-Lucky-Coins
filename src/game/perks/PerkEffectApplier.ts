import { PerkReward } from "./reward/PerkReward";
import { RunPerkManager } from "./RunPerkManager";
import { StreakMultiplierManager } from "../streak/StreakMultiplierManager";
import { roundMoney } from "../util/MoneyUtils";
import { StreakResolution } from "../streak/StreakResolution";
import { MultiplierBoosterConfig } from "./data/MultiplierBooster";
import { CasinoBonusConfig } from "./data/CasinoBonus";
import { DoubleDownConfig } from "./data/DoubleDown";
import { CoinSenseEffect, CoinSenseResult } from "./effects/CoinSenseEffect";
import { CoinSide } from "../../ui/Coin";
import { RiskTakerEffect, RiskTakerResult } from "./effects/RiskTakerEffect";
import { GamblerEffect, GamblerResult } from "./effects/GamblerEffect";
import { InsuranceEffect, InsuranceResult, } from "./effects/InsuranceEffect";
import { LuckyHandEffect, LuckyHandResult, } from "./effects/LuckyHandEffect";


export interface PiggyBankResult {
  triggered: boolean;
  amountGranted: number;
  finalBalance: number;
  consumed: boolean;
}

export class PerkEffectApplier {
  private casinoBonusBetsPlacedThisFight = 0;
  private doubleDownSuccessfulSpins = 0;
  private readonly coinSenseEffect: CoinSenseEffect;
  private readonly riskTakerEffect: RiskTakerEffect;
  private readonly gamblerEffect: GamblerEffect;
  private readonly insuranceEffect: InsuranceEffect;
  private readonly luckyHandEffect: LuckyHandEffect;

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

    this.insuranceEffect = new InsuranceEffect(
      this.runPerkManager,
    );

    this.luckyHandEffect = new LuckyHandEffect(
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

  resolveLossStreakResolution(
    resolution: StreakResolution,
  ): InsuranceResult {
    return this.insuranceEffect.resolveLossStreakResolution(
      resolution,
    );
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
    return this.luckyHandEffect.recordToss(won);
  }

  applyLuckyHand(
    winAmount: number,
    triggered: boolean,
  ): LuckyHandResult {
    return this.luckyHandEffect.apply(
      winAmount,
      triggered,
    );
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
