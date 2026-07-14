import { Container, Graphics } from 'pixi.js';

export class Overlay extends Container {
  private bg: Graphics;

  constructor(width: number, height: number) {
    super();

    this.bg = new Graphics()
      .rect(0, 0, width, height)
      .fill({ color: 0x000000, alpha: 0.5 });

    this.addChild(this.bg);

    this.eventMode = "static";
    this.cursor = "default";
  }
}