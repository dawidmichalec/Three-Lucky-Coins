import { Container, Text, Sprite, Assets, Graphics } from "pixi.js";
import { LocalizedText } from "../localization/LocalizedText";
import { ProbabilityDisplay } from "./components/ProbabilityDisplay";
import { DealerCard } from "./components/dealerCard/DealerCard";
import { DealerData } from "../game/dealers/DealerData";
import { DealerSkillsPanel } from "./panels/dealer/DealerSkillsPanel";
import { PerkContainer } from "./components/PerkContainer";
import { OddsTable } from "../game/probability/OddsTypes";
import { MultiplierEffect } from "./effects/MultiplierEffect";
import { AudioManager } from "../core/AudioManager";
import { SoundId } from "../audio/SoundId";
import { PerkReward } from "../game/perks/reward/PerkReward";
import { PerkTooltip } from "./components/PerkTooltip";
import { LayoutManager } from "../core/LayoutManager";

export class GameUI extends Container {
  private balanceValue: Text;
  private betValue: Text;
  private wonAmount: Text;
  private multiplierValue: Text;
  private multiplierContainer: Container;

  private currentMultiplier = 1;
  private multiplierAnimationId?: number;
  private probabilityDisplay!: ProbabilityDisplay;
  public dealerCard!: DealerCard;
  private dealerSkillsPanel!: DealerSkillsPanel;
  readonly perkContainer: PerkContainer;

  private multiplierEffect: MultiplierEffect;

  private audioManager = AudioManager.getInstance();
  private activePerkTooltip?: PerkTooltip;

  private freeBetLabel: LocalizedText;

  public clockIcon!: Sprite;
  public timeLabel!: Text;

  public decayLabel!: LocalizedText;
  public decayValue!: Text;

  public combinationStatusLabel!: LocalizedText;
  public ivyRuleLabel!: LocalizedText;
  public ivyRuleContent!: LocalizedText;

  private multiplierMalfunctionAnimationId?: number;


  constructor(private currentDealer: DealerData) {
    super();

    // BALANCE TEXT

    const balanceLabel = new LocalizedText("balance", {
      font: "Open Sans",
      fontSize: 40,
      fontWeight: "bold",
      fill: 0x4ca626,
      wordWrap: true,
    });

    balanceLabel.position.set(384.9, 1033.5);

    // BALANCE VALUE TEXT

    this.balanceValue = new Text({
      text: "0.00",
      style: {
        font: "Open Sans",
        fontSize: 40,
        fontWeight: "bold",
        fill: 0xffffff,
      },
    });

    this.balanceValue.position.set(600.9, 1033.5);

    // BET LABEL

    const betLabel = new LocalizedText("betLabel", {
      font: "Open Sans",
      fontSize: 40,
      fontWeight: "bold",
      fill: 0x4ca626,
      wordWrap: true,
    });
    betLabel.anchor.set(0.25, 0);
    betLabel.position.set(1364.5, 1033.5);

    // BET VALUE

    this.betValue = new Text({
      text: "0.00",
      style: {
        font: "Open Sans",
        fontSize: 40,
        fontWeight: "bold",
        fill: 0xffffff,
      },
    });

    this.betValue.anchor.set(0.75, 0);
    this.betValue.position.set(1255, 1033.5);

    // WON TEXT

    const wonLabel = new LocalizedText("winLabel", {
      font: "Open Sans",
      fontSize: 47.2,
      fontWeight: "bold",
      fill: 0xffffff,
      wordWrap: true,

      dropShadow: {
          alpha: 1,
          blur: 15,
          color: "#ffde59",
          distance: 0,
        },
    });

    wonLabel.anchor.set(1, 0.5);
    wonLabel.position.set(930, 712.8);

    this.wonAmount = new Text({
      text: "0.00",
      style: {
        font: "Open Sans",
        fontSize: 47.2,
        fontWeight: "bold",
        fill: 0xffffff,

        dropShadow: {
          alpha: 1,
          blur: 15,
          color: "#ffde59",
          distance: 0,
        },
      },
    });

    this.wonAmount.anchor.set(0, 0.5);
    this.wonAmount.position.set(970, 712.8);


    // MULTIPLIER VALUE

    this.multiplierContainer = new Container();

    this.multiplierContainer.position.set(0, 705.5);

    this.multiplierEffect = new MultiplierEffect();

    this.multiplierContainer.addChildAt(this.multiplierEffect, 0);

    this.multiplierValue = new Text({
      text: "x1",
      style: {
        fontFamily: "JackCondensed",
        fontSize: 100,
        fontWeight: "bold",
        fill: 0xffffff,
        wordWrap: false,

        dropShadow: {
          alpha: 1,
          blur: 15,
          color: "#ffaa00",
          distance: 0,
        },

        stroke: {
          color: "#331100",
          width: 3,
        },
      },
    });

    

    this.multiplierContainer.addChild(this.multiplierValue);

    // PROBABILITY DISPLAY

    this.probabilityDisplay = new ProbabilityDisplay();
    this.probabilityDisplay.position.set(220, 130);

    // SKILLS PANEL

    this.dealerSkillsPanel = new DealerSkillsPanel(626, 600);

    this.dealerSkillsPanel.zIndex = 500;


    this.sortableChildren = true;

    // PERKS CONTAINER

    const handlePerkClick = (
      reward: PerkReward,
      icon: Sprite,
    ) => {
      void this.showPerkTooltip(
        reward,
        icon,
      );
    };

    this.perkContainer = new PerkContainer(924, 119, handlePerkClick);
    this.perkContainer.position.set(497.6, 770.8);

    // FREE BET LABEL

    this.freeBetLabel = new LocalizedText("freeBet", {
      font: "Open Sans",
      fontSize: 40,
      fontWeight: "bold",
      fill: 0xffffff,
      dropShadow: {
        alpha: 0.8,
        blur: 8,
        color: "#ffaa00",
        distance: 0,
      },
    });

    this.freeBetLabel.position.set(1135.3, 980);
    this.freeBetLabel.anchor.set(0, 0);

    this.freeBetLabel.visible = false;

    // TIME LABEL

    this.timeLabel = new Text({
      text: "10",
      style: {
        font: "Open Sans",
        fontSize: 72,
        fontWeight: "bold",
        fill: 0xff3131,
      }
    });

    this.timeLabel.position.set(132, 100);

    this.timeLabel.visible = false;
    this.timeLabel.anchor.set(0.5, 0);

    // DECAY LABEL

    this.decayLabel = new LocalizedText(
      "decayIn",
      {
        font: "Open Sans",
        fontSize: 44,
        fontWeight: "bold",
        fill: 0xff3131,
        align: "center"
      }
    );

    this.decayLabel.position.set(62.4, 345.6);
    this.decayLabel.visible = false;

    this.decayValue = new Text({
      text: "10",
      style: {
        font: "Open Sans",
        fontSize: 72,
        fontWeight: "bold",
        fill: 0xff3131,
      }
    });

    this.decayValue.position.set(130, 457.6);
    this.decayValue.anchor.set(0.5, 0);
    this.decayValue.visible = false;

    // COMBINATION STATUS LABEL

    this.combinationStatusLabel = new LocalizedText(
      "combinationWontScore",
      {
        fontFamily: "EgyptianSlateBd",
        fontSize: 44,
        fontWeight: "bold",
        fill: 0xff3131,
        align: "center"
      }
    );

    this.combinationStatusLabel.position.set(960, 228);
    this.combinationStatusLabel.anchor.set(0.5, 0);
    this.combinationStatusLabel.visible = false;

    // IVY RULE LABELS

    this.ivyRuleLabel = new LocalizedText(
      "ivyRule",
      {
        font: "Open Sans",
        fontSize: 34,
        fontWeight: "bold",
        fill: 0xffd21f,
      }
    )
    this.ivyRuleLabel.position.set(1665, 345.6);
    this.ivyRuleLabel.visible = false;

    this.ivyRuleContent = new LocalizedText(
      "noAllSame",
      {
        font: "Open Sans",
        fontSize: 30,
        fontWeight: "bold",
        fill: 0xffffff,
        wordWrap: true,
        wordWrapWidth: 280,
      }
    );
    this.ivyRuleContent.position.set(1665, 395.6);
    this.ivyRuleContent.visible = false;


    // ADD

    this.addChild(
      balanceLabel,
      this.balanceValue,
      betLabel,
      this.betValue,
      wonLabel,
      this.wonAmount,
      this.multiplierContainer,
      this.probabilityDisplay,
      this.dealerSkillsPanel,
      this.perkContainer,
      this.freeBetLabel,
      this.timeLabel,
      this.decayLabel,
      this.decayValue,
      this.combinationStatusLabel,
      this.ivyRuleLabel,
      this.ivyRuleContent
    );
  }

  async init(): Promise<void> {
    await this.createDealerCard();
    await this.createClockIcon();
  }

  async removePerk(perkId: string): Promise<void> {
    await this.perkContainer.removePerk(perkId);
  }

  private async createClockIcon() {
    const texture = await Assets.load("/assets/main/icons/blake_skill_clock_icon.png");
    this.clockIcon = new Sprite(texture);

    this.clockIcon.width = 85;
    this.clockIcon.height = 85;
    this.clockIcon.position.set(90.5, 0);

    this.clockIcon.visible = false;

    this.addChild(this.clockIcon);
  }

  showRoundTimer(): void {
    this.clockIcon.visible = true;
    this.timeLabel.visible = true;
  }

  hideRoundTimer(): void {
    this.clockIcon.visible = false;
    this.timeLabel.visible = false;
  }

  updateRoundTimer(seconds: number): void {
    this.timeLabel.text =
      seconds.toString();
  }

  updateDecayTimer(rounds: number): void {
    this.decayValue.text =
      rounds.toString();
  }

  showDecayTimer(): void {
    this.decayLabel.visible = true;
    this.decayValue.visible = true;
  }

  hideDecayTimer(): void {
    this.decayLabel.visible = false;
    this.decayValue.visible = false;
  }

  showCombinationStatusLabel(){
    this.combinationStatusLabel.visible = true;
  }

  hideCombinationStatusLabel() {
    this.combinationStatusLabel.visible = false;
  }

  showIvyRules() {
    this.ivyRuleLabel.visible = true;
    this.ivyRuleContent.visible = true;
  }

  hideIvyRules() {
    this.ivyRuleLabel.visible = false;
    this.ivyRuleContent.visible = false;
  }

  async animatePenaltyIntoWon(
    penaltyAmount: number,
    finalAmount: number,
  ): Promise<void> {
    const penaltyText = new Text({
      text: `-${penaltyAmount.toFixed(2)}`,

      style: {
        fontFamily: "Anek-Kannada Bold",

        fontSize: 36,

        fontWeight: "bold",

        fill: 0xff3131,

        dropShadow: {
          alpha: 1,

          blur: 12,

          color: "#ff0000",

          distance: 0,

          angle: 0,
        },
      },
    });

    penaltyText.anchor.set(0.5);

    penaltyText.position.set(1100, 650);

    penaltyText.alpha = 0;

    penaltyText.scale.set(0.8);

    this.addChild(penaltyText);

    await this.animateBonusAppear(penaltyText);

    await this.animateBonusFly(penaltyText);

    penaltyText.destroy();

    this.wonAmount.text = finalAmount.toFixed(2);

    await this.animateWonAmountPulse();
  }

  async animateBonusIntoWon(
    bonusAmount: number,
    finalAmount: number,
  ): Promise<void> {
    const bonusText = new Text({
      text: `+${bonusAmount.toFixed(2)}`,

      style: {
        fontFamily: "Anek-Kannada Bold",

        fontSize: 36,

        fontWeight: "bold",

        fill: 0x39ff14,

        dropShadow: {
          alpha: 1,

          blur: 12,

          color: "#00ff66",

          distance: 0,

          angle: 0,
        },
      },
    });

    bonusText.anchor.set(0.5);

    /*
            Start trochę poniżej / obok WON.
            Potem możesz sobie dopracować pozycję.
        */

    bonusText.position.set(1100, 650);

    bonusText.alpha = 0;

    bonusText.scale.set(0.8);

    this.addChild(bonusText);

    await this.animateBonusAppear(bonusText);

    await this.animateBonusFly(bonusText);

    bonusText.destroy();

    this.wonAmount.text = finalAmount.toFixed(2);

    await this.animateWonAmountPulse();
  }

  private animateBonusAppear(bonusText: Text): Promise<void> {
    return this.animate(
      250,

      (progress) => {
        const eased = 1 - Math.pow(1 - progress, 3);

        bonusText.alpha = eased;

        bonusText.scale.set(0.8 + eased * 0.2);
      },
    );
  }

  private animateBonusFly(bonusText: Text): Promise<void> {
    const startX = bonusText.x;

    const startY = bonusText.y;

    const targetX = this.wonAmount.x + this.wonAmount.width / 2;

    const targetY = this.wonAmount.y;

    return this.animate(
      500,

      (progress) => {
        const eased = progress * progress;

        bonusText.x = startX + (targetX - startX) * eased;

        bonusText.y = startY + (targetY - startY) * eased;

        /*
                    Pod koniec bonus zanika,
                    jakby "wchłaniał się"
                    w WON.
                */

        if (progress > 0.7) {
          bonusText.alpha = 1 - (progress - 0.7) / 0.3;
        }

        const scale = 1 - progress * 0.25;

        bonusText.scale.set(scale);
      },
    );
  }

  private animateWonAmountPulse(): Promise<void> {
    return this.animate(
      260,

      (progress) => {
        const punch = Math.sin(progress * Math.PI);

        const scale = 1 + punch * 0.22;

        this.wonAmount.scale.set(scale);
      },
    ).then(() => {
      this.wonAmount.scale.set(1);
    });
  }

  async animatePenaltyIntoBalance(
    penaltyAmount: number,
    finalBalance: number,
  ): Promise<void> {
    const penaltyText = new Text({
      text: `-${penaltyAmount.toFixed(2)}`,

      style: {
        fontFamily: "Anek-Kannada Bold",
        fontSize: 36,
        fontWeight: "bold",
        fill: 0xff3131,

        dropShadow: {
          alpha: 1,
          blur: 12,
          color: "#ff0000",
          distance: 0,
          angle: 0,
        },
      },
    });

    penaltyText.anchor.set(0.5);

    penaltyText.position.set(
      900,
      850,
    );

    penaltyText.alpha = 0;
    penaltyText.scale.set(0.8);

    this.addChild(penaltyText);

    await this.animateBonusAppear(
      penaltyText,
    );

    await this.animatePenaltyFlyToBalance(
      penaltyText,
    );

    penaltyText.destroy();

    this.balanceValue.text =
      finalBalance.toFixed(2);

    await this.animateBalancePulse();
  }

  private animatePenaltyFlyToBalance(
    penaltyText: Text,
  ): Promise<void> {
    const startX = penaltyText.x;
    const startY = penaltyText.y;

    const targetX =
      this.balanceValue.x +
      this.balanceValue.width / 2;

    const targetY =
      this.balanceValue.y +
      this.balanceValue.height / 2;

    return this.animate(
      500,

      (progress) => {
        const eased =
          progress * progress;

        penaltyText.x =
          startX +
          (targetX - startX) * eased;

        penaltyText.y =
          startY +
          (targetY - startY) * eased;

        if (progress > 0.7) {
          penaltyText.alpha =
            1 -
            (progress - 0.7) / 0.3;
        }

        const scale =
          1 - progress * 0.25;

        penaltyText.scale.set(scale);
      },
    );
  }

  private animateBalancePulse(): Promise<void> {
    return this.animate(
      220,

      (progress) => {
        const punch =
          Math.sin(progress * Math.PI);

        const scale =
          1 + punch * 0.14;

        this.balanceValue.scale.set(
          scale,
        );
      },
    ).then(() => {
      this.balanceValue.scale.set(1);
    });
  }

  private animate(
    duration: number,
    update: (progress: number) => void,
  ): Promise<void> {
    return new Promise((resolve) => {
      const startTime = performance.now();

      const frame = (currentTime: number) => {
        const progress = Math.min(1, (currentTime - startTime) / duration);

        update(progress);

        if (progress >= 1) {
          resolve();

          return;
        }

        requestAnimationFrame(frame);
      };

      requestAnimationFrame(frame);
    });
  }

  async addPerk(reward: PerkReward): Promise<void> {
    await this.perkContainer.addPerk(reward);
  }

  setFreeBetIndicator(visible: boolean): void {
    this.freeBetLabel.visible = visible;
  }

  private async showPerkTooltip(
    reward: PerkReward,
    icon: Sprite,
  ): Promise<void> {
    this.hidePerkTooltip();

    const tooltip = new PerkTooltip(
      reward,
      () => {
        this.hidePerkTooltip();
      },
    );

    await tooltip.init();

    /*
      Pozycja ikony w globalnym układzie.
    */

    const iconGlobalPosition =
      icon.getGlobalPosition();

    /*
      Zamieniamy globalną pozycję
      z powrotem na lokalne współrzędne GameUI.
    */

    const iconLocalPosition =
      this.toLocal(
        iconGlobalPosition,
      );

    tooltip.position.set(
      iconLocalPosition.x - 20,
      iconLocalPosition.y - 260,
    );

    tooltip.zIndex = 5000;

    this.activePerkTooltip =
      tooltip;

    this.addChild(tooltip);
  }

  private hidePerkTooltip(): void {
    if (!this.activePerkTooltip) {
      return;
    }

    this.removeChild(this.activePerkTooltip);

    this.activePerkTooltip.destroy({
      children: true,
    });

    this.activePerkTooltip = undefined;
  }

  private async createDealerCard() {
    this.dealerCard =
      new DealerCard(
        this.currentDealer,

        // NORMAL SKILL
        (skill, globalPosition) => {
          const localPosition =
            this.toLocal(
              globalPosition,
            );

          this.dealerSkillsPanel.setSkill(
            skill,
          );

          this.dealerSkillsPanel.position.set(
            localPosition.x - 626 / 2 + 77 / 2,
            localPosition.y + 80,
          );

          this.dealerSkillsPanel.show();
        },

        // NO SKILLS
        (globalPosition) => {
          const localPosition =
            this.toLocal(
              globalPosition,
            );

          this.dealerSkillsPanel.showNoSkills();

          this.dealerSkillsPanel.position.set(
            localPosition.x - 626 / 2 + 77 / 2,
            localPosition.y + 80,
          );
        },
      );

    await this.dealerCard.init();

    this.dealerCard.position.set(
      289.3,
      0,
    );

    this.addChild(
      this.dealerCard,
    );
  }

  async setDealer(
    dealer: DealerData,
  ): Promise<void> {
    this.currentDealer = dealer;

    this.dealerSkillsPanel.hide();

    if (this.dealerCard) {
      this.removeChild(
        this.dealerCard,
      );

      this.dealerCard.destroy({
        children: true,
      });
    }

    await this.createDealerCard();
  }

  updateDealerObjective(
    dealer: DealerData,
    targetBalance?: number,
  ): void {
    this.dealerCard.updateObjective(
      dealer,
      targetBalance,
    );
  }

  setDisabled(
    value: boolean,
  ): void {
    if (this.dealerCard) {
      this.dealerCard.setDisabled(
        value,
      );
    }

    if (
      this.dealerSkillsPanel.visible
    ) {
      this.dealerSkillsPanel.hide();
    }
  }

  updateBalance(balance: number) {
    this.balanceValue.text = balance.toFixed(2);
  }

  updateBet(bet: number) {
    this.betValue.text = bet.toFixed(2);
  }

  updateWon(value: number) {
    this.wonAmount.text = value.toFixed(2);
  }

  updateMultiplier(multiplier: number) {
    const previousMultiplier = this.currentMultiplier;

    this.currentMultiplier = multiplier;

    this.multiplierValue.text = `x${multiplier}`;

    if (multiplier > previousMultiplier) {
      this.animateMultiplierIncrease();
      this.audioManager.play(SoundId.MULTIPLIER_INCREASED, {
        loop: false,
        volume: 0.5,
      });

      this.multiplierEffect.play(previousMultiplier, multiplier);
    }
  }

  updateProbability(odds: OddsTable) {
    this.probabilityDisplay.updateOdds(odds);
  }

  private animateMultiplierIncrease() {
    if (this.multiplierAnimationId !== undefined) {
      cancelAnimationFrame(this.multiplierAnimationId);
    }

    const duration = 320;

    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const progress = Math.min(1, (currentTime - startTime) / duration);

      /*
                Powiększenie:
                1 → około 1.18 → 1
            */
      const punch = Math.sin(progress * Math.PI);

      const scale = 1 + punch * 0.18;

      this.multiplierContainer.scale.set(scale);

      /*
                Trzęsienie najmocniejsze na początku,
                a później stopniowo zanika.
            */
      const shakeStrength = (1 - progress) * 7;

      const shakeX = Math.sin(progress * Math.PI * 12) * shakeStrength;

      const shakeY = Math.cos(progress * Math.PI * 16) * shakeStrength * 0.35;

      this.multiplierValue.position.set(shakeX, shakeY);

      if (progress < 1) {
        this.multiplierAnimationId = requestAnimationFrame(animate);

        return;
      }

      /*
                Zawsze przywracamy stan bazowy.
            */
      this.multiplierContainer.scale.set(1);

      this.multiplierValue.position.set(0, 0);

      this.multiplierAnimationId = undefined;
    };

    this.multiplierAnimationId = requestAnimationFrame(animate);
  }

  async playMultiplierMalfunction(): Promise<void> {
    if (
      this.multiplierMalfunctionAnimationId !== undefined
    ) {
      cancelAnimationFrame(
        this.multiplierMalfunctionAnimationId,
      );
    }

    if (
      this.multiplierAnimationId !== undefined
    ) {
      cancelAnimationFrame(
        this.multiplierAnimationId,
      );

      this.multiplierAnimationId = undefined;
    }

    this.playMultiplierSmoke();

    const duration = 1400;

    const startTime = performance.now();

    return new Promise((resolve) => {
      const animate = (currentTime: number) => {
        const progress = Math.min(
          1,
          (currentTime - startTime) / duration,
        );

        /*
          Migotanie jak zepsuta jarzeniówka.

          Celowo nie jest regularne.
        */

        const flicker =
          Math.sin(progress * Math.PI * 34) +
          Math.sin(progress * Math.PI * 57);

        if (flicker > 0.4) {
          this.multiplierValue.alpha = 0.2;
        } else if (flicker > -0.2) {
          this.multiplierValue.alpha = 0.55;
        } else {
          this.multiplierValue.alpha = 1;
        }

        /*
          Multiplier próbuje "ruszyć",
          ale coś go blokuje.
        */

        const struggle =
          Math.sin(progress * Math.PI * 10);

        const scale =
          1 +
          Math.max(0, struggle) *
            0.08 *
            (1 - progress);

        this.multiplierContainer.scale.set(scale);

        /*
          Lekko mechaniczny shake.
        */

        const shakeStrength =
          (1 - progress) * 5;

        const shakeX =
          Math.sin(
            progress * Math.PI * 42,
          ) * shakeStrength;

        const shakeY =
          Math.cos(
            progress * Math.PI * 31,
          ) *
          shakeStrength *
          0.3;

        this.multiplierValue.position.set(
          shakeX,
          shakeY,
        );

        /*
          Glow też "traci zasilanie".
        */

        const glowAlpha =
          0.35 +
          Math.abs(flicker) * 0.4;

        this.multiplierValue.style.dropShadow.alpha =
          Math.min(1, glowAlpha);

        if (progress < 1) {
          this.multiplierMalfunctionAnimationId =
            requestAnimationFrame(animate);

          return;
        }

        this.multiplierValue.alpha = 1;

        this.multiplierValue.position.set(0, 0);

        this.multiplierContainer.scale.set(1);

        this.multiplierValue.style.dropShadow.alpha = 1;

        this.multiplierMalfunctionAnimationId =
          undefined;

        resolve();
      };

      this.multiplierMalfunctionAnimationId =
        requestAnimationFrame(animate);
    });
  }

  private createMultiplierSmokeParticle(): Graphics {
    const smoke = new Graphics();

    const radius =
      24 + Math.random() * 16;

    /*
      Kilka nachodzących na siebie kółek,
      żeby nie wyglądało to jak jedna kulka.
    */

    smoke.circle(0, 0, radius);

    smoke.circle(
      radius * 0.55,
      -radius * 0.15,
      radius * 0.7,
    );

    smoke.circle(
      -radius * 0.5,
      -radius * 0.1,
      radius * 0.65,
    );

    smoke.fill({
      color: 0xd0d0d0,
      alpha: 0.65,
    });

    smoke.alpha = 0;

    smoke.position.set(
      this.multiplierValue.x +
        this.multiplierValue.width * 0.5 +
        (Math.random() - 0.5) * 70,
      this.multiplierValue.y + 20,
    );

    return smoke;
  }

  private animateMultiplierSmokeParticle(
    smoke: Graphics,
  ): Promise<void> {
    const duration =
      700 + Math.random() * 350;

    const startX = smoke.x;
    const startY = smoke.y;

    const driftX =
      (Math.random() - 0.5) * 45;

    return this.animate(
      duration,

      (progress) => {
        /*
          Szybkie pojawienie,
          potem stopniowe zanikanie.
        */

        if (progress < 0.2) {
          smoke.alpha =
            (progress / 0.2) * 0.25;
        } else {
          smoke.alpha =
            (1 - progress) * 0.25;
        }

        /*
          Dym idzie do góry
          i trochę dryfuje na bok.
        */

        smoke.x =
          startX +
          driftX * progress;

        smoke.y =
          startY -
          progress * 65;

        /*
          Chmurka rozszerza się
          podczas unoszenia.
        */

        const scale =
          0.7 + progress * 1.2;

        smoke.scale.set(scale);
      },
    ).then(() => {
      smoke.destroy();
    });
  }

  private playMultiplierSmoke(): void {
    const particleCount = 4;

    for (
      let i = 0;
      i < particleCount;
      i++
    ) {
      window.setTimeout(() => {
        const smoke =
          this.createMultiplierSmokeParticle();

        const multiplierValueIndex =
          this.multiplierContainer.getChildIndex(
            this.multiplierValue,
          );

        this.multiplierContainer.addChildAt(
          smoke,
          multiplierValueIndex,
        );

        void this.animateMultiplierSmokeParticle(
          smoke,
        );
      }, i * 110);
    }
  }
}
