import { Container, Text, Sprite } from "pixi.js";
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

export class GameUI extends Container {
  private balanceValue: Text;
  private betValue: Text;
  private wonAmount: Text;
  private multiplierValue: Text;
  private multiplierContainer: Container;

  private currentMultiplier = 1;
  private multiplierAnimationId?: number;
  private probabilityDisplay!: ProbabilityDisplay;
  readonly dealerCard!: DealerCard;
  private dealerSkillsPanel!: DealerSkillsPanel;
  readonly perkContainer: PerkContainer;

  private multiplierEffect: MultiplierEffect;

  private audioManager = AudioManager.getInstance();
  private activePerkTooltip?: PerkTooltip;

  private freeBetLabel: LocalizedText;

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
        wordWrap: true,

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
    );
  }

  async init(): Promise<void> {
    await this.createDealerCard();
  }

  async removePerk(perkId: string): Promise<void> {
    await this.perkContainer.removePerk(perkId);
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
      70,
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
}
