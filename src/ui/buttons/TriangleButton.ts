import { Container, Graphics, Text } from 'pixi.js';

type TriangleButtonProps = {
  direction: 'left' | 'right';
  label: string;
  onClick?: () => void;
};

export class TriangleButton extends Container {
  private bg: Graphics;
  private defaultColor = 0x4ca626;
  private pressedColor = 0x134d18;
  private disabled = false;

  constructor({
    direction,
    label,
    onClick,
  }: TriangleButtonProps) {
    super();

    this.bg = new Graphics();

    this.draw(this.defaultColor);

    if (direction === 'left') {
      this.bg.scale.x = -1;
      this.bg.x = 50;
    }

    this.bg.eventMode = 'static';
    this.bg.cursor = 'pointer';

    const text = new Text({
      text: label,
      style: {
        font: 'Open Sans',
        fontWeight: 'bold',
        fontSize: 36,
        fill: 0xffffff,
      },
    });

    text.anchor.set(0.5);
    text.position.set(20, 15);

    if (label === '+') {
      text.position.set(15, 20);
    } else {
      text.position.set(35, 15);
    }

    this.bg.on('pointerdown', () => {
      this.draw(this.pressedColor);
    });

    this.bg.on('pointerup', () => {
      this.draw(this.defaultColor);
      if (!this.disabled) onClick?.();
    });

    this.bg.on('pointerupoutside', () => {
      this.draw(this.defaultColor);
    });

    this.bg.on('pointerover', () => {
      this.alpha = 0.9;
    });

    this.bg.on('pointerout', () => {
      this.alpha = 1;
    });

    this.addChild(this.bg);
    this.addChild(text);
  }

  private draw(color: number) {
    this.bg.clear();

    this.bg
      .poly([
        0, 0,
        50, 20,
        0, 40,
      ])
      .fill(color);
  }

  setDisabled(value: boolean) {
    this.disabled = value;

    this.bg.eventMode = value ? 'none' : 'static';
    this.bg.cursor = value ? 'default' : 'pointer';

    this.alpha = value ? 0.5 : 1;
  }
}