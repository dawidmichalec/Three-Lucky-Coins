import {
  Assets,
  Container,
  Sprite,
  Text,
} from "pixi.js";

import { DealerCardBackground } from "./DealerCardBackground";
import { DealerData } from "../../../game/dealers/DealerData";
import { LocalizedText } from "../../../localization/LocalizedText";
import { OBJECTIVE_DISPLAY_CONFIG, ObjectiveDisplayMode, } from "../../../game/objectives/ObjectiveDisplayConfig";
import { DealerSkillData } from "../../../game/dealers/DealerSkill";

const NO_SKILLS_ICON =
  "/assets/main/icons/dealer_skill_icons/no_skills.png";

export class DealerCard extends Container {
  private avatar!: Sprite;

  private skillIconsContainer = new Container();

  private objectiveDescription: LocalizedText;
  private objectiveAmount: Text;

  private secondaryObjectiveDescription: LocalizedText;
  private secondaryObjectiveAmount: Text;

  constructor(
    private dealer: DealerData,
    private onSkillClick?: (
      skill: DealerSkillData,
      iconPosition: { x: number; y: number },
    ) => void,
    private onNoSkillsClick?: (
      iconPosition: { x: number; y: number },
    ) => void,
  ) {
    super();

    this.createBackground();

    // DEALER NAME

    const dealerName = new Text({
      text: this.dealer.name,

      style: {
        font: "Open Sans",
        fontSize: 38,
        fontWeight: "bold",
        fill: 0xffd21f,
      },
    });

    dealerName.position.set(
      200,
      20,
    );

    // DEALER TITLE

    const dealerTitle =
      new LocalizedText(
        this.dealer.title,
        {
          font: "Open Sans",
          fontSize: 28,
          fontWeight: "bold",
          fill: 0xffd21f,
        },
      );

    dealerTitle.position.set(
      200,
      110,
    );

    // SKILLS HEADER

    const skillsLabel =
      new LocalizedText(
        "skills",
        {
          font: "Open Sans",
          fontSize: 38,
          fontWeight: "bold",
          fill: 0xffd21f,
        },
      );

    skillsLabel.position.set(
      500,
      18,
    );

    this.skillIconsContainer.position.set(
      500,
      82,
    );

    // OBJECTIVE HEADER

    const objectiveLabel =
      new LocalizedText(
        "objective",
        {
          font: "Open Sas",
          fontSize: 38,
          fontWeight: "bold",
          fill: 0xffd21f,
        },
      );

    objectiveLabel.position.set(
      760,
      18,
    );

    // OBJECTIVE DESCRIPTION

    this.objectiveDescription =
      new LocalizedText(
        "increaseBalanceBy",
        {
          font: "Open Sans",
          fontSize: 28,
          fontWeight: "bold",
          fill: 0xffffff,
        },
      );

    this.objectiveDescription.position.set(
      760,
      78,
    );

    // OBJECTIVE VALUE

    this.objectiveAmount =
      new Text({
        text: "0.00",

        style: {
          font: "Open Sans",
          fontSize: 28,
          fontWeight: "bold",
          fill: 0x4ca626,
        },
      });

    this.objectiveAmount.position.set(
      760,
      115,
    );

    // TARGET BALANCE

    this.secondaryObjectiveDescription =
      new LocalizedText(
        "targetBalance",
        {
          font: "Open Sans",
          fontSize: 28,
          fontWeight: "bold",
          fill: 0xffffff,
        },
      );

    this.secondaryObjectiveDescription.position.set(
      1075,
      78,
    );

    this.secondaryObjectiveAmount =
      new Text({
        text: "0.00",

        style: {
          font: "Open Sans",
          fontSize: 28,
          fontWeight: "bold",
          fill: 0xffd21f,
        },
      });

    this.secondaryObjectiveAmount.position.set(
      1075,
      115,
    );

    this.addChild(
      dealerName,
      dealerTitle,
      skillsLabel,
      this.skillIconsContainer,
      objectiveLabel,
      this.objectiveDescription,
      this.objectiveAmount,
      this.secondaryObjectiveDescription,
      this.secondaryObjectiveAmount,
    );
  }

  async init(): Promise<void> {
    await Promise.all([
      this.createAvatar(),
      this.createSkillIcons(),
    ]);
  }

  async updateSkills(skills: DealerSkillData[]): Promise<void> {
      await this.createSkillIcons(skills);
  }

  private async createAvatar(): Promise<void> {
    const texture =
      await Assets.load(
        this.dealer.avatarSmall,
      );

    this.avatar =
      new Sprite(texture);

    this.avatar.width = 174.3;
    this.avatar.height = 174.3;

    this.avatar.position.set(
      5,
      5,
    );

    this.addChild(this.avatar);
  }

  private async createSkillIcons(skills: DealerSkillData[] = this.dealer.skills): Promise<void> {
    this.skillIconsContainer
      .removeChildren();

    if (skills.length === 0) {
      await this.createNoSkillsIcon();
      return;
    }

    const skillsWithIcons = skills.filter(
      (skill): skill is DealerSkillData & { icon: string } => skill.icon !== undefined,
    );

    await Promise.all(
      skillsWithIcons.map(async (skill, index) => {
        const texture = await Assets.load(skill.icon);

        const icon = new Sprite(texture);

        icon.width = 77;
        icon.height = 77;

        icon.position.set(index * 100, 0);

        if (this.onSkillClick) {
          icon.eventMode = "static";
          icon.cursor = "pointer";

          icon.on("pointertap", () => {
            const globalPosition = icon.getGlobalPosition();

            this.onSkillClick?.(
              skill,
              globalPosition,
            );
          });
        }

        this.skillIconsContainer.addChild(icon);
      }),
    );
  }

  private async createNoSkillsIcon(): Promise<void> {
    const texture =
      await Assets.load(
        NO_SKILLS_ICON,
      );

    const icon =
      new Sprite(texture);

    icon.width = 77;
    icon.height = 77;

    icon.position.set(
      0,
      0,
    );

    if (this.onNoSkillsClick) {
      icon.eventMode = "static";
      icon.cursor = "pointer";

      icon.on(
        "pointertap",
        () => {
          const globalPosition =
            icon.getGlobalPosition();

          this.onNoSkillsClick?.(
            globalPosition,
          );
        },
      );
    }

    this.skillIconsContainer
      .addChild(icon);
  }

  updateObjective(
    dealer: DealerData,
    targetBalance?: number,
  ): void {
    const config =
      OBJECTIVE_DISPLAY_CONFIG[
        dealer.objectiveType
      ];

    this.objectiveDescription.setKey(
      config.descriptionKey,
    );

    this.secondaryObjectiveDescription.visible = false;
    this.secondaryObjectiveAmount.visible = false;

    switch (config.displayMode) {
      case ObjectiveDisplayMode.BALANCE_TARGET:
        this.objectiveAmount.text =
          config.formatValue(
            dealer.objectiveValue,
          );

        if (targetBalance !== undefined) {
          this.secondaryObjectiveDescription.setKey(
            "targetBalance",
          );

          this.secondaryObjectiveAmount.text =
            targetBalance.toFixed(2);

          this.secondaryObjectiveDescription.visible =
            true;

          this.secondaryObjectiveAmount.visible =
            true;
        }

        break;

      case ObjectiveDisplayMode.STATIC:
        this.objectiveAmount.text =
          config.formatValue(
            dealer.objectiveValue,
          );

        break;

      case ObjectiveDisplayMode.PROGRESS:
        /*
          Na początku walki progres wynosi 0.
        */

        this.objectiveAmount.text =
          this.formatProgress(
            0,
            dealer.objectiveValue,
          );

        break;
    }
  }

  private formatProgress(
    current: number,
    target: number,
  ): string {
    return `${current} / ${target}`;
  }


  updateObjectiveProgress(
    current: number,
    target: number,
  ): void {
    this.objectiveAmount.text =
      this.formatProgress(
        current,
        target,
      );
  }

  private createBackground(): void {
    const bg =
      new DealerCardBackground(
        1343.4,
        186.5,
      );

    this.addChild(bg);
  }

  setDisabled(
    value: boolean,
  ): void {
    this.skillIconsContainer.eventMode =
      value
        ? "none"
        : "auto";

    this.alpha =
      value
        ? 0.8
        : 1;
  }

  async replaceActiveSkill(skill: DealerSkillData): Promise<void> {

    console.log(
      "BEFORE REPLACE:",
      this.skillIconsContainer.children.map((child, index) => ({
        index,
        x: child.x,
        destroyed: child.destroyed,
      })),
    );
    const oldIcon = this.skillIconsContainer.children.find(
      (child): child is Sprite => child instanceof Sprite && child.x === 100,
    );

    if (!oldIcon || !skill.icon) {
      return;
    }

    await this.animateSkillOut(oldIcon);

    this.skillIconsContainer.removeChild(oldIcon);
    oldIcon.destroy();

    const texture = await Assets.load(skill.icon);
    const newIcon = new Sprite(texture);

    newIcon.width = 77;
    newIcon.height = 77;
    newIcon.position.set(100, 0);

    if (this.onSkillClick) {
      newIcon.eventMode = "static";
      newIcon.cursor = "pointer";

      newIcon.on("pointertap", () => {
        const globalPosition = newIcon.getGlobalPosition();

        this.onSkillClick?.(skill, globalPosition);
      });
    }

    this.skillIconsContainer.addChild(newIcon);

    await this.animateSkillIn(newIcon);

    console.log(
      "AFTER REPLACE:",
      this.skillIconsContainer.children.map((child, index) => ({
        index,
        x: child.x,
        destroyed: child.destroyed,
      })),
    );
  }

  private animateSkillOut(icon: Sprite): Promise<void> {
    const duration = 280;
    const startTime = performance.now();
    const startX = icon.x;

    return new Promise((resolve) => {
      const animate = (currentTime: number) => {
        const progress = Math.min(1, (currentTime - startTime) / duration);
        const eased = progress * progress;

        icon.x = startX + eased * 45;
        icon.alpha = 1 - progress;
        icon.rotation = progress * 0.25;

        if (progress < 1) {
          requestAnimationFrame(animate);
          return;
        }

        resolve();
      };

      requestAnimationFrame(animate);
    });
  }

  private animateSkillIn(icon: Sprite): Promise<void> {
    const duration = 320;
    const startTime = performance.now();
    const targetX = 100;
    const startX = targetX - 45;

    icon.x = startX;
    icon.alpha = 0;
    icon.rotation = -0.25;
    icon.scale.set(0.9);

    return new Promise((resolve) => {
      const animate = (currentTime: number) => {
        const progress = Math.min(1, (currentTime - startTime) / duration);
        const eased = 1 - Math.pow(1 - progress, 3);

        icon.x = startX + (targetX - startX) * eased;
        icon.alpha = eased;
        icon.rotation = -0.25 * (1 - eased);

        const snap = Math.sin(progress * Math.PI) * 0.08;
        icon.scale.set(0.9 + eased * 0.1 + snap);

        if (progress < 1) {
          requestAnimationFrame(animate);
          return;
        }

        icon.position.set(targetX, 0);
        icon.alpha = 1;
        icon.rotation = 0;
        icon.scale.set(1);

        resolve();
      };

      requestAnimationFrame(animate);
    });
  }
}