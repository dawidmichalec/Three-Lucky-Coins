import { PerkReward } from "./reward/PerkReward";
import { RunPerkManager } from "./RunPerkManager";
import { StreakMultiplierManager } from "../streak/StreakMultiplierManager";
import { StreakResolution } from "../streak/StreakResolution";
import { MultiplierBoosterConfig } from "./data/MultiplierBooster";
import { CoinSenseEffect, CoinSenseResult } from "./effects/CoinSenseEffect";
import { CoinSide } from "../../ui/Coin";
import { RiskTakerEffect, RiskTakerResult } from "./effects/RiskTakerEffect";
import { GamblerEffect, GamblerResult } from "./effects/GamblerEffect";
import { InsuranceEffect, InsuranceResult, } from "./effects/InsuranceEffect";
import { LuckyHandEffect, LuckyHandResult, } from "./effects/LuckyHandEffect";
import { DoubleDownEffect } from "./effects/DoubleDownEffect";
import { PiggyBankEffect, PiggyBankResult, } from "./effects/PiggyBankEffect";
import { CasinoBonusEffect } from "./effects/CasinoBonusEffect";
import { DecisivenessEffect } from "./effects/DecisivenessEffect";
import { SafetyNetEffect } from "./effects/SafetyNetEffect";
import { UnderdogEffect } from "./effects/UnderdogEffect";
import { HotStreakEffect, HotStreakResult } from "./effects/HotStreakEffect";
import { OnARollActivationResult, OnARollEffect, OnARollResult } from "./effects/OnARollEffect";
import { GreedEffect, GreedResult } from "./effects/GreedEffect";
import { DamageControlEffect } from "./effects/DamageControlEffect";
import { LotteryLoverEffect, LotteryLoverResult } from "./effects/LotteryLoverEffect";
import { RiskyGainsEffect, RiskyGainsResult } from "./effects/RiskyGainsEffect";
import { LuckyPrizeEffect } from "./effects/LuckyPrizeEffect";
import { GoldenBoyEffect, GoldenBoyResult, } from "./effects/GoldenBoyEffect";
import { BounceBackEffect } from "./effects/BounceBackEffect";

export class PerkEffectApplier {
  private readonly coinSenseEffect: CoinSenseEffect;
  private readonly riskTakerEffect: RiskTakerEffect;
  private readonly gamblerEffect: GamblerEffect;
  private readonly insuranceEffect: InsuranceEffect;
  private readonly luckyHandEffect: LuckyHandEffect;
  private readonly doubleDownEffect: DoubleDownEffect;
  private readonly piggyBankEffect: PiggyBankEffect;
  private readonly casinoBonusEffect: CasinoBonusEffect;
  private readonly decisivenessEffect: DecisivenessEffect;
  private readonly safetyNetEffect: SafetyNetEffect;
  private readonly underdogEffect: UnderdogEffect;
  private readonly hotStreakEffect: HotStreakEffect;
  private readonly onARollEffect: OnARollEffect;
  private readonly greedEffect: GreedEffect;
  private readonly damageControlEffect: DamageControlEffect;
  private readonly lotteryLoverEffect: LotteryLoverEffect;
  private readonly riskyGainsEffect: RiskyGainsEffect;
  private readonly luckyPrizeEffect: LuckyPrizeEffect;
  private readonly goldenBoyEffect: GoldenBoyEffect;
  private readonly bounceBackEffect: BounceBackEffect;

  constructor(
    private readonly runPerkManager: RunPerkManager,

    private readonly streakMultiplierManager: StreakMultiplierManager,
  ) {

    this.coinSenseEffect = new CoinSenseEffect(this.runPerkManager,);

    this.riskTakerEffect = new RiskTakerEffect(this.runPerkManager,);

    this.gamblerEffect = new GamblerEffect(this.runPerkManager,);

    this.insuranceEffect = new InsuranceEffect(this.runPerkManager,);

    this.luckyHandEffect = new LuckyHandEffect(this.runPerkManager,);

    this.doubleDownEffect = new DoubleDownEffect(this.runPerkManager,);

    this.piggyBankEffect = new PiggyBankEffect(this.runPerkManager,);

    this.casinoBonusEffect = new CasinoBonusEffect(this.runPerkManager,);

    this.decisivenessEffect = new DecisivenessEffect(this.runPerkManager,);

    this.safetyNetEffect = new SafetyNetEffect(this.runPerkManager,);

    this.underdogEffect = new UnderdogEffect(this.runPerkManager);

    this.hotStreakEffect = new HotStreakEffect(this.runPerkManager);

    this.onARollEffect = new OnARollEffect(this.runPerkManager);

    this.greedEffect = new GreedEffect(this.runPerkManager);

    this.damageControlEffect = new DamageControlEffect(this.runPerkManager);

    this.lotteryLoverEffect = new LotteryLoverEffect(this.runPerkManager);

    this.riskyGainsEffect = new RiskyGainsEffect(this.runPerkManager);

    this.luckyPrizeEffect = new LuckyPrizeEffect(this.runPerkManager);

    this.goldenBoyEffect = new GoldenBoyEffect(this.runPerkManager);

    this.bounceBackEffect = new BounceBackEffect(this.runPerkManager);

  }

  applyPerk(reward: PerkReward): void {
    switch (reward.perk.id) {
      case "multiplier_booster":
      case "greed":
        this.refreshStreakMultiplierSettings();
        break;
    }
  }

  isCurrentBetFree(bet: number): boolean {
    return this.casinoBonusEffect.isCurrentBetFree(bet);
  }

  resolveBetCost(bet: number): number {
    return this.casinoBonusEffect.resolveBetCost(bet);
  }

  recordBet(): void {
    this.casinoBonusEffect.recordBet();
  }

  resetFightEffects(): void {
    this.casinoBonusEffect.resetFight();

    this.coinSenseEffect.resetFight();

    this.hotStreakEffect.resetFight();

    this.onARollEffect.resetFight();

    this.lotteryLoverEffect.resetFight();

    this.riskyGainsEffect.resetFight();

    this.luckyPrizeEffect.resetFight();

    this.refreshStreakMultiplierGrowth();

    this.goldenBoyEffect.resetFight();

    this.bounceBackEffect.resetFight();

    this.gamblerEffect.resetFight();
  }
  
  private getMultiplierBoosterBonus(): number {
    const instances =
      this.runPerkManager.getPerkInstances(
        "multiplier_booster",
      );

    const totalBonus = instances.reduce(
      (total, instance) => {
        const config =
          instance.variant.config as MultiplierBoosterConfig;

        return total + config.streakMultiplierIncrease;
      },
      0,
    );

    return Math.round(totalBonus * 100) / 100;
  }

  private refreshStreakMultiplierSettings(): void {
    const baseValue =
      1 + this.getMultiplierBoosterBonus();

    this.streakMultiplierManager.setBaseValue(baseValue);

    this.refreshStreakMultiplierGrowth();

    this.streakMultiplierManager.reset();
  }

  private refreshStreakMultiplierGrowth(): void {
    let growthPerWin =
      1 + this.getMultiplierBoosterBonus();

    // Other perk modifiers remain unchanged.

    growthPerWin -=
      this.greedEffect.getMultiplierGrowthReduction();

    growthPerWin +=
      this.luckyPrizeEffect.getMultiplierGrowthBonus();

    this.streakMultiplierManager.setGrowthPerWin(
      Math.round(growthPerWin * 100) / 100,
    );
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
    return this.doubleDownEffect.isActive();
  }

  resolvePayoutBet(bet: number): number {
    return this.doubleDownEffect.resolvePayoutBet(bet);
  }

  recordDoubleDownSpinResult(
    won: boolean,
    doubleDownWasActive: boolean,
  ): boolean {
    return this.doubleDownEffect.recordSpinResult(
      won,
      doubleDownWasActive,
    );
  }

  resetDoubleDownProgress(): void {
    this.doubleDownEffect.resetProgress();
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

  applyPiggyBank(
    balance: number,
    minimumBet: number,
  ): PiggyBankResult {
    return this.piggyBankEffect.apply(
      balance,
      minimumBet,
    );
  }

  preventsCombinationBlocking(): boolean {
    return this.decisivenessEffect.preventsCombinationBlocking();
  }

  recordSafetyNetRoundResult(
    win: boolean,
  ): void {
    this.safetyNetEffect.recordRoundResult(
      win,
    );
  }

  isSafetyNetReady(): boolean {
    return this.safetyNetEffect.isReady();
  }

  consumeSafetyNet(): void {
    this.safetyNetEffect.consume();
  }

  prepareSafetyNetResult(result: CoinSide[]): void {
    this.safetyNetEffect.prepareResult(result);
  }

  consumePreparedSafetyNetResult(): CoinSide[] | undefined {
    return this.safetyNetEffect.consumePreparedResult();
  }

  getPreparedSafetyNetResult(): CoinSide[] | undefined {
    return this.safetyNetEffect.getPreparedResult();
  }

  resetSafetyNet(): void {
    this.safetyNetEffect.reset();
  }

  getUnderdogWinningsBonus(currentBalance: number, startingBalance: number): number {
    return this.underdogEffect.getWinningsBonus(currentBalance, startingBalance);
  }

  tryActivateHotStreak(multiplier: number): boolean {
    return this.hotStreakEffect.tryActivate(multiplier);
  }

  applyHotStreak(winAmount: number): HotStreakResult {
    return this.hotStreakEffect.apply(winAmount);
  }

  tryActivateOnARoll(multiplier: number): OnARollActivationResult {
    return this.onARollEffect.tryActivate(multiplier);
  }

  applyOnARoll(winAmount: number): OnARollResult {
    return this.onARollEffect.apply(winAmount);
  }

  applyGreed(winAmount: number): GreedResult {
    return this.greedEffect.apply(winAmount);
  }

  getGreedMultiplierGrowthReduction(): number {
    return this.greedEffect.getMultiplierGrowthReduction();
  }

  reducePenalty(penalty: number, bet: number): number {
    return this.damageControlEffect.reducePenalty(penalty, bet);
  }

  reducePenaltyPercentage(penaltyPercentage: number): number {
    return this.damageControlEffect.reducePenaltyPercentage(penaltyPercentage);
  }

  recordGambleForMoreWin(): boolean {
    return this.lotteryLoverEffect.recordGambleForMoreWin();
  }

  applyLotteryLover(winAmount: number): LotteryLoverResult {
    return this.lotteryLoverEffect.apply(winAmount);
  }

  recordRiskyGainsGambleForMoreWin(): void {
    this.riskyGainsEffect.recordGambleForMoreWin();
  }

  applyRiskyGains(winAmount: number): RiskyGainsResult {
    return this.riskyGainsEffect.apply(winAmount);
  }

  recordLuckyPrizeGambleForMoreWin(): void {
    const bonusChanged =
      this.luckyPrizeEffect.recordGambleForMoreWin();

    if (!bonusChanged) {
      return;
    }

    this.refreshStreakMultiplierGrowth();
  }

  getLuckyPrizeMultiplierGrowthBonus(): number {
    return this.luckyPrizeEffect.getMultiplierGrowthBonus();
  }

  recordGoldenBoyGoldenCoins(amount: number): void {
    this.goldenBoyEffect.recordGoldenCoins(amount);
  }

  applyGoldenBoy(winAmount: number): GoldenBoyResult {
    return this.goldenBoyEffect.apply(winAmount);
  }

  activateBounceBackAfterLoss(): void {
    this.bounceBackEffect.activateAfterLoss();
  }

  consumeBounceBackGrowthBonus(): number {
    return this.bounceBackEffect.consumeOnMultiplierIncrease();
  }
}
