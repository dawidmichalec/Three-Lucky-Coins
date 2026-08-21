import { Container, Sprite, Assets, Text } from "pixi.js";
import { DealerCardBackground } from "./DealerCardBackground";
import { SkillsButton } from "../../buttons/SkillsButton";
import { ObjectiveButton } from "../../buttons/ObjectiveButton";
import { DealerData } from "../../../game/dealers/DealerData";
import { LocalizedText } from "../../../localization/LocalizedText";

export class DealerCard extends Container {
  private skillsButton!: SkillsButton;
  private objectiveButton!: ObjectiveButton;
  private avatar!: Sprite;

  constructor(
    private dealer: DealerData,
    private onSkillsClick: () => void,
    private onObjectiveClick: () => void,
  ) {
    super();

    const dealerName = new Text({
      text: this.dealer.name,
      style: {
        font: "Open Sans",
        fontSize: 38,
        fontWeight: "bold",
        fill: 0xffd21f,
      },
    });

    dealerName.position.set(200, 20);

    const dealerTitle = new LocalizedText(this.dealer.title, {
      font: "Open Sans",
      fontSize: 28,
      fontWeight: "bold",
      fill: 0xffd21f,
    });

    dealerTitle.position.set(200, 110);

    this.createBackground();

    this.addChild(dealerName, dealerTitle);
  }

  async init() {
    this.createAvatar();
    this.createSkillsButton();
    this.createObjectiveButton();

    await this.skillsButton.init();
    await this.objectiveButton.init();
  }

  private async createAvatar() {
    const texture = await Assets.load(this.dealer.avatarSmall);

    this.avatar = new Sprite(texture);

    this.avatar.width = 174.3;
    this.avatar.height = 174.3;

    this.avatar.position.set(0, 0);

    this.addChild(this.avatar);
  }

  private createBackground() {
    const bg = new DealerCardBackground(556.1, 180.7);

    this.addChild(bg);
  }

  private createSkillsButton() {
    this.skillsButton = new SkillsButton(this.onSkillsClick);

    this.skillsButton.position.set(480, 25);

    this.addChild(this.skillsButton);
  }

  private createObjectiveButton() {
    this.objectiveButton = new ObjectiveButton(this.onObjectiveClick);

    this.objectiveButton.position.set(480, 100);

    this.addChild(this.objectiveButton);
  }

  setDisabled(value: boolean) {
    this.skillsButton.setDisabled(value);
    this.objectiveButton.setDisabled(value);
  }
}
